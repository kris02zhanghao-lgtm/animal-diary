import { useState, useEffect } from 'react'
import { saveRecord } from '../services/supabaseService'

function NewEncounterPage({ onNavigate }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [species, setSpecies] = useState('')
  const [journal, setJournal] = useState('')
  const [recognizedAt, setRecognizedAt] = useState(null)
  const [error, setError] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [geoStatus, setGeoStatus] = useState('idle')
  const [coordinates, setCoordinates] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoStatus('success')
      },
      (err) => {
        setGeoStatus(err.code === 1 ? 'denied' : 'unavailable')
      },
      { timeout: 10000 }
    )
  }, [])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        setRecognizedAt(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateLog = async () => {
    if (!selectedImage) return

    setIsLoading(true)
    setError(null)
    setSaveError(null)

    try {
      const response = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedImage, location }),
      })
      const result = await response.json()

      if (result.success) {
        setTitle(result.title)
        setSpecies(result.species)
        setJournal(result.journal)
        setRecognizedAt(new Date())
      } else {
        setError(result.error || '识别失败，请重试')
      }
    } catch {
      setError('网络错误，请检查连接后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setSaveError(null)

    try {
      await saveRecord({
        image_base64: selectedImage,
        location: location || '城市某处',
        title,
        species,
        journal,
        latitude: coordinates?.lat ?? null,
        longitude: coordinates?.lng ?? null,
      })
      onNavigate('list')
    } catch {
      setSaveError('保存失败，请重试')
    }
  }

  const formatDate = (date) => {
    const d = date || new Date()
    return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`
  }

  const generateButtonLabel = isLoading
    ? '识别中...'
    : recognizedAt !== null
    ? '重新生成'
    : '✨ AI 帮我生成档案'

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
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)' }}
        >
          {/* 标题区 */}
          <div className="px-5 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #ede0c4 100%)' }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给这次偶遇起个名字..."
              className="w-full text-xl font-bold text-[#3d2b1a] bg-transparent border-none outline-none placeholder-[#a08060]"
            />
            <p className="text-xs text-[#a08060] mt-1">{formatDate(recognizedAt)}</p>
          </div>

          {/* 日志内容区 */}
          <div className="px-5 py-4 bg-[#fffdf7]">
            <textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              rows={5}
              placeholder="记录这次偶遇的故事，或点击上方按钮让 AI 帮你生成..."
              className="w-full text-[#3d2b1a] text-sm leading-relaxed bg-transparent border-none outline-none resize-none placeholder-[#c4b49a]"
            />
          </div>

          {/* 标签行 */}
          <div className="px-5 py-3 flex gap-3 flex-wrap" style={{ background: '#f5ede0', borderTop: '1px solid #e0d0b8' }}>
            <div className="flex items-center gap-1">
              <span className="text-base">🐾</span>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="text-sm font-medium text-[#3d2b1a] bg-transparent border-none outline-none w-24"
                placeholder="动物种类"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base">📍</span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-sm text-[#5a4a3a] bg-transparent border-none outline-none w-28"
                placeholder="地点"
              />
            </div>
          </div>
          {/* 定位状态提示 */}
          {geoStatus === 'loading' && (
            <div className="px-5 pb-3" style={{ background: '#f5ede0' }}>
              <span className="text-xs text-[#a08060]">定位中...</span>
            </div>
          )}
          {geoStatus === 'success' && (
            <div className="px-5 pb-3" style={{ background: '#f5ede0' }}>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#e8d9c0', color: '#7a5c3a' }}>📍 已自动定位</span>
            </div>
          )}
          {geoStatus === 'denied' && (
            <div className="px-5 pb-3" style={{ background: '#f5ede0' }}>
              <span className="text-xs text-[#b0a090]">位置权限已拒绝，请手动输入</span>
            </div>
          )}
          {geoStatus === 'unavailable' && (
            <div className="px-5 pb-3" style={{ background: '#f5ede0' }}>
              <span className="text-xs text-[#b0a090]">定位暂不可用，请手动输入（手机端效果更好）</span>
            </div>
          )}
        </div>

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
            onClick={() => alert('即将上线，敬请期待！')}
            className="flex-1 btn btn-md btn-default"
          >
            分享发现
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 保存失败提示 */}
        {saveError && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-600">{saveError}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewEncounterPage
