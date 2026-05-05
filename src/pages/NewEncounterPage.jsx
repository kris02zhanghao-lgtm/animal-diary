import { useState, useEffect, useRef } from 'react'
import { saveRecord, confirmReturning } from '../services/supabaseService'
import { trackEvent } from '../services/analyticsService'
import { reverseGeocode } from '../services/amapService'
import ReturningSuggestionModal from '../components/ReturningSuggestionModal'
import EncounterResultCard from '../components/EncounterResultCard'
import ShareModal from '../components/ShareModal'
import SpeciesCorrectionSheet from '../components/SpeciesCorrectionSheet'
import LocationPicker from '../components/LocationPicker'

function compressImage(file, maxSize = 800) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > height) {
        if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize }
      } else {
        if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize }
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.src = url
  })
}

async function safeParseJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function NewEncounterPage({ onNavigate }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [species, setSpecies] = useState('')
  const [category, setCategory] = useState('')
  const [speciesTag, setSpeciesTag] = useState('')
  const [journal, setJournal] = useState('')
  const [recognizedAt, setRecognizedAt] = useState(null)
  const [recognitionFailed, setRecognitionFailed] = useState(false)
  const [recognitionError, setRecognitionError] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [geoStatus, setGeoStatus] = useState('idle')
  const [coordinates, setCoordinates] = useState(null)
  const [suggestedRecord, setSuggestedRecord] = useState(null)
  const [suggestedScore, setSuggestedScore] = useState(null)
  const [savedRecord, setSavedRecord] = useState(null)
  const [showSpeciesCorrection, setShowSpeciesCorrection] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [shareDraftRecord, setShareDraftRecord] = useState(null)
  const hasManualLocationInputRef = useRef(false)
  const locationRef = useRef(location)

  useEffect(() => {
    locationRef.current = location
  }, [location])

  useEffect(() => {
    if (!navigator.geolocation) return
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude
        setCoordinates({ lat: latitude, lng: longitude })
        setGeoStatus('success')

        if (hasManualLocationInputRef.current || locationRef.current.trim()) return

        try {
          const nextLocation = await reverseGeocode(latitude, longitude)
          if (!hasManualLocationInputRef.current && !locationRef.current.trim()) {
            setLocation(nextLocation)
          }
        } catch {
          // Keep the current text input empty if reverse geocoding fails.
        }
      },
      (err) => {
        setGeoStatus(err.code === 1 ? 'denied' : 'unavailable')
      },
      { timeout: 10000 }
    )
  }, [])

  const handleImageSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const compressed = await compressImage(file)
      setSelectedImage(compressed)
      setTitle('')
      setSpecies('')
      setCategory('')
      setSpeciesTag('')
      setJournal('')
      setRecognizedAt(null)
      setRecognitionFailed(false)
      setRecognitionError(null)
      setSaveError(null)
    }
  }

  const handleGenerateLog = async () => {
    if (!selectedImage) return

    setIsLoading(true)
    setRecognitionFailed(false)
    setRecognitionError(null)
    setSaveError(null)

    trackEvent('recognize_attempt')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedImage, location }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      const result = await safeParseJson(response)

      if (response.ok && result?.success) {
        setTitle(result.title)
        setSpecies(result.species)
        setCategory(result.category || '其他')
        setSpeciesTag(result.speciesTag || 'other-animal')
        setJournal(result.journal)
        setRecognizedAt(new Date())
        setRecognitionFailed(false)
        trackEvent('recognize_success', { category: result.category, species: result.species })
      } else {
        setTitle('')
        setSpecies('')
        setCategory('')
        setSpeciesTag('')
        setJournal('')
        setRecognizedAt(new Date())
        setRecognitionFailed(true)
        setRecognitionError(result?.error || 'AI识别失败，请手动补充')
        trackEvent('recognize_failure', { error_code: result?.code || 'unknown' })
      }
    } catch (e) {
      clearTimeout(timeoutId)
      setTitle('')
      setSpecies('')
      setCategory('')
      setSpeciesTag('')
      setJournal('')
      setRecognizedAt(new Date())
      setRecognitionFailed(true)
      if (e.name === 'AbortError') {
        setRecognitionError('识别超时（30秒），请手动补充或重试')
        trackEvent('recognize_failure', { error_code: 'timeout' })
      } else {
        setRecognitionError('网络错误，请检查连接后手动补充或重试')
        trackEvent('recognize_failure', { error_code: 'network_error' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setSaveError(null)

    try {
      const result = await saveRecord({
        image_base64: selectedImage,
        location: location || '城市某处',
        title,
        species,
        category,
        species_tag: speciesTag || 'other-animal',
        journal,
        latitude: coordinates?.lat ?? null,
        longitude: coordinates?.lng ?? null,
      })

      setSavedRecord(result.record)
      trackEvent('save_record', { category, species })

      if (result.returningDetection?.detected && result.returningDetection?.score >= 60) {
        setSuggestedRecord(result.returningDetection.similarRecord)
        setSuggestedScore(result.returningDetection.score)
      } else {
        onNavigate('list')
      }
    } catch {
      setSaveError('保存失败，请重试')
    }
  }

  const handleConfirmReturning = async () => {
    if (!savedRecord) return

    try {
      await confirmReturning(savedRecord.id)
      setSuggestedRecord(null)
      setSuggestedScore(null)
      setSavedRecord(null)
      onNavigate('list')
    } catch {
      setSaveError('确认失败，请重试')
    }
  }

  const handleDismissReturning = () => {
    setSuggestedRecord(null)
    setSuggestedScore(null)
    setSavedRecord(null)
    onNavigate('list')
  }

  const handleLocationConfirm = ({ location: nextLocation, latitude, longitude }) => {
    hasManualLocationInputRef.current = true
    setLocation(nextLocation)
    setCoordinates({
      lat: latitude ?? coordinates?.lat ?? null,
      lng: longitude ?? coordinates?.lng ?? null,
    })
    setGeoStatus('success')
    setShowLocationPicker(false)
  }

  const formatDate = (date) => {
    const d = date || new Date()
    return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`
  }

  const generateButtonLabel = isLoading
    ? '识别中...'
    : recognizedAt !== null || recognitionFailed
    ? '重新生成'
    : '✨ AI 帮我生成档案'

  const handleOpenShare = () => {
    if (!selectedImage) return

    setShareDraftRecord({
      id: 'draft-share',
      imageBase64: selectedImage,
      title,
      species,
      location: location || '城市某处',
      journal,
      createdAt: (recognizedAt || new Date()).toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <header className="flex items-center px-4 py-4" style={{ borderBottom: `1px solid var(--border-color)`, background: 'var(--bg-primary)' }}>
        <button
          onClick={() => onNavigate('list')}
          className="text-2xl"
          style={{ color: 'var(--text-primary)' }}
          aria-label="返回"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
          记录偶遇
        </h1>
        <div className="w-8" />
      </header>

      {/* 表单内容 */}
      <div className="px-4 py-6 space-y-6">
        {/* 图片上传区域 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            上传照片
          </label>
          <div
            onClick={() => document.getElementById('imageInput').click()}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-[#f5f0e8]"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="预览"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <>
                <div className="text-4xl mb-2">📷</div>
                <span className="text-gray-500 text-sm">点击上传照片</span>
              </>
            )}
          </div>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* AI 生成按钮 */}
        <button
          onClick={handleGenerateLog}
          disabled={isLoading || !selectedImage}
          className="w-full btn btn-md btn-primary"
        >
          {generateButtonLabel}
        </button>

        {/* 偶遇档案卡片 */}
        <EncounterResultCard
          title={title}
          onTitleChange={setTitle}
          recognizedAt={recognizedAt}
          journal={journal}
          onJournalChange={setJournal}
          species={species}
          onSpeciesChange={(nextSpecies) => {
            setSpecies(nextSpecies)
            setCategory('')
            setSpeciesTag('')
          }}
          location={location}
          onLocationChange={(nextLocation) => {
            hasManualLocationInputRef.current = true
            setLocation(nextLocation)
          }}
          onOpenSpeciesCorrection={() => setShowSpeciesCorrection(true)}
          onOpenLocationPicker={() => setShowLocationPicker(true)}
          geoStatus={geoStatus}
          formatDate={formatDate}
          isFailed={recognitionFailed}
        />

        {/* AI 识别错误提示 */}
        {recognitionError && (
          <div className="px-1">
            <p className="text-sm text-red-600">❌ AI识别失败，请手动补充</p>
            <p className="mt-1 text-xs text-red-500">{recognitionError}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!species.trim()}
            className="flex-1 btn btn-md btn-primary"
          >
            保存到日志
          </button>
          <button
            onClick={handleOpenShare}
            disabled={!selectedImage}
            className="flex-1 btn btn-md btn-default"
          >
            分享发现
          </button>
        </div>

        {/* 保存失败提示 */}
        {saveError && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-600">{saveError}</p>
          </div>
        )}
      </div>

      {/* 回头客建议弹窗 */}
      {suggestedRecord && (
        <ReturningSuggestionModal
          similarRecord={suggestedRecord}
          score={suggestedScore}
          onConfirm={handleConfirmReturning}
          onDismiss={handleDismissReturning}
        />
      )}

      <SpeciesCorrectionSheet
        isOpen={showSpeciesCorrection}
        onClose={() => setShowSpeciesCorrection(false)}
        value={species}
        category={category}
        speciesTag={speciesTag}
        onApply={({ species: nextSpecies, category: nextCategory, speciesTag: nextSpeciesTag }) => {
          setSpecies(nextSpecies)
          setCategory(nextCategory)
          setSpeciesTag(nextSpeciesTag)
        }}
      />

      {showLocationPicker && (
        <LocationPicker
          onConfirm={handleLocationConfirm}
          onClose={() => setShowLocationPicker(false)}
        />
      )}

      <ShareModal
        record={shareDraftRecord}
        isOpen={Boolean(shareDraftRecord)}
        onClose={() => setShareDraftRecord(null)}
      />
    </div>
  )
}

export default NewEncounterPage
