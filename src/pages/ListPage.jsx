import { useState, useEffect } from 'react'
import { getRecords, deleteRecord } from '../services/storageService'

function ListPage({ onNavigate }) {
  const [records, setRecords] = useState([])

  useEffect(() => {
    setRecords(getRecords())
  }, [])

  const handleDelete = (id) => {
    deleteRecord(id)
    setRecords(getRecords())
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[#fffdf7] px-4 py-6">
      {/* Google Fonts - Press Start 2P */}
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      {/* 页面标题 */}
      <h1
        className="text-center text-xl mt-4 mb-8"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        我的动物图鉴
      </h1>

      {records.length === 0 ? (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-6xl mb-6">🐿️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">还没有偶遇记录</h2>
          <p className="text-gray-500 text-base text-center leading-relaxed">
            出门遇见小动物拍一张吧～<br />让你的城市日志热闹起来！
          </p>
        </div>
      ) : (
        /* 记录列表 */
        <div className="space-y-4 pb-24">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-lg overflow-hidden"
              style={{ border: '3px solid #5a4a3a', boxShadow: '4px 4px 0px #5a4a3a' }}
            >
              {/* 图片 */}
              <img
                src={record.imageBase64}
                alt={record.species}
                className="w-full h-48 object-cover"
              />
              {/* 内容 */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-800">{record.species}</span>
                    <span className="ml-2 text-sm text-gray-500">{record.location}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-xl leading-none"
                    aria-label="删除"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{record.journal}"
                </p>
                <p className="text-xs text-gray-400">{formatDate(record.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 浮动添加按钮 */}
      <button
        onClick={() => onNavigate('new')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#7cb342] text-white text-2xl shadow-lg flex items-center justify-center hover:bg-[#6a9e38] transition-colors"
        aria-label="添加新记录"
      >
        +
      </button>
    </div>
  )
}

export default ListPage
