function EncounterResultCard({
  title,
  onTitleChange,
  recognizedAt,
  journal,
  onJournalChange,
  species,
  onSpeciesChange,
  location,
  onLocationChange,
  onOpenSpeciesCorrection,
  onOpenLocationPicker,
  geoStatus,
  formatDate,
  isFailed = false,
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)' }}
    >
      <div className="px-5 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #f5e6c8 0%, #ede0c4 100%)' }}>
        <div className="flex items-start justify-between gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="给这次偶遇起个名字..."
            className="w-full text-xl font-bold text-[#3d2b1a] bg-transparent border-none outline-none placeholder-[#a08060]"
          />
          {isFailed && (
            <span
              className="shrink-0 rounded-full px-2 py-1 text-[11px] font-medium"
              style={{ background: 'rgba(193, 76, 58, 0.12)', color: '#b4533f' }}
            >
              ⚠️ 手动填充
            </span>
          )}
        </div>
        <p className="text-xs text-[#a08060] mt-1">{formatDate(recognizedAt)}</p>
      </div>

      <div className="px-5 py-4 bg-[#fffdf7]">
        <textarea
          value={journal}
          onChange={(e) => onJournalChange(e.target.value)}
          rows={5}
          placeholder="记录这次偶遇的故事，或点击上方按钮让 AI 帮你生成..."
          className="w-full text-[#3d2b1a] text-sm leading-relaxed bg-transparent border-none outline-none resize-none placeholder-[#c4b49a]"
        />
      </div>

      <div
        className="grid grid-cols-2 gap-3 px-5 py-3 items-center"
        style={{ background: '#f5ede0', borderTop: '1px solid #e0d0b8' }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base">🐾</span>
          <input
            type="text"
            value={species}
            onChange={(e) => onSpeciesChange(e.target.value)}
            className="min-w-0 flex-1 text-sm font-medium text-[#3d2b1a] bg-transparent border-none outline-none"
            placeholder={isFailed ? 'AI识别失败，请输入物种' : '动物种类'}
          />
          <button
            type="button"
            onClick={onOpenSpeciesCorrection}
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-medium"
            style={{ background: 'rgba(122, 92, 58, 0.08)', color: '#7a5c3a' }}
          >
            修正
          </button>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base">📍</span>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="min-w-0 flex-1 text-sm text-[#5a4a3a] bg-transparent border-none outline-none"
            placeholder="地点"
          />
          <button
            type="button"
            onClick={onOpenLocationPicker}
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-medium"
            style={{ background: 'rgba(122, 92, 58, 0.08)', color: '#7a5c3a' }}
          >
            定位
          </button>
        </div>
      </div>

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
  )
}

export default EncounterResultCard
