import { useEffect, useMemo, useState } from 'react'
import { generateReport } from '../services/reportService'

const timeRangeOptions = [
  { id: 'recent3months', label: '最近三个月' },
  { id: 'naturalYear', label: '今年' },
]

function formatGeneratedTime(value) {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

function periodLabel(timeRange) {
  return timeRange === 'naturalYear' ? '今年' : '最近三个月'
}

function getGrowingHint(report) {
  if (!report) return ''
  if (report.status === 'sparse') {
    return '再多记录几次偶遇，这里会慢慢长出你的城市小结。'
  }
  if (report.status === 'growing') {
    return '数据还在积累中，先看看你目前的偶遇轮廓。'
  }
  return ''
}

function StatCard({ emoji, title, children }) {
  return (
    <section
      className="rounded-[20px] p-4 sm:p-5"
      style={{
        background: 'rgb(247, 243, 223)',
        boxShadow: '0 4px 10px rgba(107, 92, 67, 0.18)',
        border: '2px solid rgba(121, 79, 39, 0.08)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{emoji}</span>
        <h2 className="text-base font-bold text-[#794f27] m-0">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function RankedList({ items, nameKey }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item[nameKey]}-${index}`}
          className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 bg-[#fffaf0]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: '#efe2c7', color: '#7a5c3a' }}
            >
              {index + 1}
            </span>
            <span className="text-sm text-[#5a4a3a] truncate">{item[nameKey]}</span>
          </div>
          <span className="text-sm font-bold text-[#3d2b1a] shrink-0">
            {item.count} {nameKey === 'species' ? '只' : '次'}
          </span>
        </div>
      ))}
    </div>
  )
}

function ReportPage() {
  const [timeRange, setTimeRange] = useState('recent3months')
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadReport() {
      setIsLoading(true)
      setError(null)

      try {
        const nextReport = await generateReport(timeRange)
        if (!cancelled) {
          setReport(nextReport)
        }
      } catch {
        if (!cancelled) {
          setError('读取报告失败，请稍后再试')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadReport()

    return () => {
      cancelled = true
    }
  }, [timeRange])

  const heroText = useMemo(() => {
    if (!report) return ''
    return `你${periodLabel(timeRange)}遇见了 ${report.total} 只动物`
  }, [report, timeRange])

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 bg-[#fffdf7]">
      <div className="max-w-3xl mx-auto space-y-5">
        <header className="relative overflow-hidden rounded-[28px] px-5 py-6 sm:px-6">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #f8edd0 0%, #f0e2be 54%, #e8f5eb 100%)',
            }}
          />
          <div className="absolute -top-8 -right-6 w-28 h-28 rounded-full bg-white/35" />
          <div className="absolute -bottom-10 -left-4 w-24 h-24 rounded-full bg-[#d7f0db]/70" />
          <div className="relative">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-[#9f927d] mb-1">📊 偶遇报告</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#5a432f] m-0">城市偶遇小结</h1>
                </div>
              </div>

            <div className="grid grid-cols-2 gap-3 rounded-[22px] p-2 bg-white/55 backdrop-blur-sm">
              {timeRangeOptions.map((option) => {
                const isActive = option.id === timeRange
                return (
                  <button
                    key={option.id}
                    onClick={() => setTimeRange(option.id)}
                    className="rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200"
                    style={{
                      background: isActive ? '#6fba2c' : 'rgba(255,255,255,0.75)',
                      color: isActive ? '#fffdf7' : '#7a5c3a',
                      boxShadow: isActive ? '0 4px 0 #5a9e1e' : '0 3px 0 rgba(189, 174, 160, 0.7)',
                      transform: isActive ? 'translateY(-1px)' : 'none',
                    }}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        {isLoading ? (
          <div
            className="rounded-[24px] px-5 py-10 text-center"
            style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.18)' }}
          >
            <div className="w-10 h-10 mx-auto mb-4 rounded-full border-4 border-[#e8d8c0] border-t-[#6fba2c] animate-spin" />
            <p className="text-sm text-[#9f927d]">正在整理你的偶遇脚印...</p>
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : report?.status === 'empty' ? (
          <div
            className="rounded-[24px] px-5 py-10 text-center"
            style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.18)' }}
          >
            <div className="text-5xl mb-4">🐾</div>
            <p className="text-lg font-bold text-[#5a4a3a] mb-2">还没有偶遇呢</p>
            <p className="text-sm leading-6 text-[#9f927d]">去记录你的第一次发现吧 🐾</p>
          </div>
        ) : report?.status === 'sparse' ? (
          <div
            className="rounded-[24px] px-5 py-10 text-center"
            style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.18)' }}
          >
            <div className="text-5xl mb-4">🌱</div>
            <p className="text-lg font-bold text-[#5a4a3a] mb-2">偶遇正在冒头</p>
            <p className="text-sm leading-6 text-[#9f927d]">{getGrowingHint(report)}</p>
          </div>
        ) : report ? (
          <>
            {report.status === 'growing' && (
              <div
                className="rounded-[22px] px-4 py-3 flex items-center gap-3"
                style={{ background: '#f7f0de', boxShadow: '0 3px 10px rgba(107, 92, 67, 0.12)' }}
              >
                <span className="text-xl">🌿</span>
                <p className="text-sm text-[#7a5c3a]">{getGrowingHint(report)}</p>
              </div>
            )}

            <section
              className="relative overflow-hidden rounded-[28px] px-5 py-6 sm:px-6"
              style={{
                background: 'linear-gradient(150deg, #fff9ef 0%, #f5ead3 58%, #e6f4ea 100%)',
                boxShadow: '0 6px 16px rgba(107, 92, 67, 0.18)',
              }}
            >
              <div className="absolute top-4 right-4 text-5xl opacity-15">🗺️</div>
              <p className="text-sm text-[#9f927d] mb-2">{periodLabel(timeRange)}总览</p>
              <p className="text-3xl sm:text-4xl font-black leading-tight text-[#3d2b1a] max-w-xs sm:max-w-md">
                {heroText}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {report.topSpecies.slice(0, 3).map((item) => (
                  <span
                    key={item.species}
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: 'rgba(255,255,255,0.85)', color: '#7a5c3a' }}
                  >
                    {item.species} {item.count} 只
                  </span>
                ))}
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard emoji="🐱" title="最常遇见的动物">
                <RankedList items={report.topSpecies} nameKey="species" />
              </StatCard>

              <StatCard emoji="📍" title="最常去的地点">
                <RankedList items={report.topLocations} nameKey="location" />
              </StatCard>
            </div>

            {timeRange === 'naturalYear' && report.mostActiveMonth && (
              <StatCard emoji="📅" title="最活跃的月份">
                <div className="rounded-[20px] bg-[#fffaf0] px-4 py-4">
                  <p className="text-base font-bold text-[#3d2b1a] mb-1">
                    {report.mostActiveMonth.month} 最热闹
                  </p>
                  <p className="text-sm text-[#7a5c3a]">
                    那个月你遇见了 {report.mostActiveMonth.count} 只动物。
                  </p>
                </div>
              </StatCard>
            )}

            <p className="pb-2 text-center text-xs text-[#b0a090]">
              数据更新于 {formatGeneratedTime(report.generatedAt)}
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default ReportPage
