function TabButton({ id, label, icon, active, onClick }) {
  const isActive = active === id
  return (
    <button
      onClick={() => onClick(id)}
      className="flex flex-col items-center gap-0.5 w-16"
      style={{ color: isActive ? '#7cb342' : '#a08060' }}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  )
}

function BottomTabBar({ active, onChange }) {
  const handleTabClick = (id) => {
    onChange(id)
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-around"
      style={{
        height: '64px',
        background: 'rgb(247, 243, 223)',
        borderTop: '1px solid #e0d0b8',
        boxShadow: '0 -2px 8px rgba(107, 92, 67, 0.15)',
      }}
    >
      <TabButton id="timeline" label="时间线" icon="🕐" active={active} onClick={handleTabClick} />
      <TabButton id="map" label="地图" icon="🗺️" active={active} onClick={handleTabClick} />

      <button
        onClick={() => handleTabClick('new')}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white -mt-5"
        style={{
          background: '#7cb342',
          boxShadow: '0 4px 12px rgba(124, 179, 66, 0.5)',
          border: '3px solid #fffdf7',
          fontSize: '28px',
          lineHeight: 1,
        }}
        aria-label="新建偶遇"
      >
        +
      </button>

      <TabButton id="collection" label="图鉴" icon="📖" active={active} onClick={handleTabClick} />
    </div>
  )
}

export default BottomTabBar
