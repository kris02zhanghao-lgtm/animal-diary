import { useState } from 'react'
import { recognizeAnimal } from '../services/aiService'
import { saveRecord } from '../services/storageService'

function NewEncounterPage({ onNavigate }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [species, setSpecies] = useState(null)
  const [journal, setJournal] = useState(null)
  const [error, setError] = useState(null)
  const [saveError, setSaveError] = useState(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        setSpecies(null)
        setJournal(null)
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

    const result = await recognizeAnimal(selectedImage, location)

    setIsLoading(false)

    if (result.success) {
      setSpecies(result.species)
      setJournal(result.journal)
    } else {
      setError(result.error)
    }
  }

  const handleSave = () => {
    try {
      saveRecord({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        imageBase64: selectedImage,
        location: location || '城市某处',
        species,
        journal,
        createdAt: new Date().toISOString(),
      })
      onNavigate('list')
    } catch {
      setSaveError('保存失败，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <header className="flex items-center px-4 py-4 border-b border-gray-200">
        <button
          onClick={() => onNavigate('list')}
          className="text-2xl text-gray-700 hover:text-gray-900"
          aria-label="返回"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-lg font-medium text-gray-800">
          记录偶遇
        </h1>
        <div className="w-8" /> {/* 占位保持标题居中 */}
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
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-white"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="预览"
                className="w-full h-full object-cover rounded-lg"
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

        {/* 地点输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            地点
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="在哪里遇到的？"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7cb342] focus:border-transparent"
          />
        </div>

        {/* 生成日志按钮 */}
        <button
          onClick={handleGenerateLog}
          disabled={isLoading || !selectedImage}
          className="w-full py-3 bg-[#7cb342] text-white font-medium rounded-lg hover:bg-[#6a9e38] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '识别中...' : '生成日志'}
        </button>

        {/* 识别结果（可编辑） */}
        {species && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
            <div>
              <label className="text-sm text-gray-600">识别结果：</label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-lg font-bold text-green-700 bg-white border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
              />
            </div>
            {journal !== null && (
              <div className="pt-3 border-t border-green-200">
                <label className="text-sm text-gray-500 mb-2 block">偶遇日志：</label>
                <textarea
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 text-gray-700 text-sm leading-relaxed bg-white border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7cb342] resize-none"
                />
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={!species.trim()}
              className="w-full py-3 bg-[#7cb342] text-white font-medium rounded-lg hover:bg-[#6a9e38] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              保存这次偶遇
            </button>
          </div>
        )}

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
