import { useMemo, useState } from 'react'
import {
  getCorrectionSections,
  inferSuggestedCorrectionCategory,
} from '../constants/animalClassificationOptions'

function correctionHint(category) {
  if (!category) return '选一个更接近的类型，或者用“其他”写下你自己的名字。'
  return `我们猜你遇到的是${category}，选一个更接近的类型。`
}

function SpeciesCorrectionSheet({
  isOpen,
  onClose,
  value,
  category,
  speciesTag,
  onApply,
}) {
  const suggestedCategory = useMemo(
    () => inferSuggestedCorrectionCategory({ category, speciesTag, species: value }),
    [category, speciesTag, value]
  )
  const sections = useMemo(
    () => getCorrectionSections(suggestedCategory),
    [suggestedCategory]
  )
  const defaultCategory = suggestedCategory || sections[0]?.category || '猫'
  const [customCategory, setCustomCategory] = useState(defaultCategory)
  const [customValue, setCustomValue] = useState('')
  const [isCustomOpen, setIsCustomOpen] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setCustomCategory(defaultCategory)
    setCustomValue('')
    setIsCustomOpen(false)
    onClose()
  }

  const handleSelectOption = (selectedCategory, selectedOption) => {
    if (selectedOption === '其他') {
      setCustomCategory(selectedCategory)
      setCustomValue(value || '')
      setIsCustomOpen(true)
      return
    }

    onApply({
      species: selectedOption,
      category: selectedCategory,
      speciesTag: selectedOption,
    })
    handleClose()
  }

  const handleConfirmCustom = () => {
    if (!customValue.trim()) return

    const fallbackSpeciesTag = customCategory === '猫'
      ? '其他猫类'
      : customCategory === '狗'
        ? '其他犬种'
        : customCategory === '鸟'
          ? '其他鸟类'
          : 'other-animal'

    onApply({
      species: customValue.trim(),
      category: customCategory,
      speciesTag: fallbackSpeciesTag,
    })
    handleClose()
  }

  return (
    <div
      className="fixed inset-0 z-[130] flex items-end"
      style={{ background: 'rgba(0, 0, 0, 0.35)', animation: 'fade-in 0.25s ease' }}
      onClick={handleClose}
    >
      <div
        className="w-full rounded-t-[28px] bg-[#fffdf7] px-5 pt-5"
        style={{
          boxShadow: '0 -12px 32px rgba(61, 52, 40, 0.18)',
          animation: 'zoom-in 0.3s ease',
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[#9f927d]">🐾 修正分类</p>
            <h2 className="m-0 text-lg font-bold text-[#5a4a3a]">换一个更准确的分类</h2>
            <p className="mt-2 text-sm leading-6 text-[#7a5c3a]">{correctionHint(suggestedCategory)}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="h-9 w-9 rounded-full bg-[#f4ebdc] text-xl text-[#7a5c3a]"
            aria-label="关闭修正面板"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.category} className="rounded-[22px] bg-[#f7f0e4] px-4 py-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#5a4a3a]">{section.category}</p>
                {suggestedCategory === section.category && (
                  <span className="rounded-full bg-[#fffaf1] px-2 py-1 text-[11px] font-semibold text-[#9f927d]">
                    AI 猜测
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {section.options.map((option) => {
                  const isSelected = value === option
                  return (
                    <button
                      key={`${section.category}-${option}`}
                      type="button"
                      onClick={() => handleSelectOption(section.category, option)}
                      className="rounded-full px-3 py-2 text-sm font-medium transition-all"
                      style={{
                        background: isSelected ? '#6fba2c' : '#fffdf7',
                        color: isSelected ? '#fffdf7' : '#6b5842',
                        boxShadow: isSelected
                          ? '0 3px 0 #5a9e1e'
                          : '0 2px 0 rgba(189, 174, 160, 0.75)',
                      }}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {isCustomOpen && (
            <div className="rounded-[22px] border border-[#ead8bc] bg-[#fffaf1] px-4 py-4">
              <p className="text-sm font-bold text-[#5a4a3a]">写一个你觉得更贴切的名字</p>
              <input
                type="text"
                value={customValue}
                onChange={(event) => setCustomValue(event.target.value)}
                placeholder="比如：重点色长毛猫"
                className="mt-3 w-full rounded-[18px] border border-[#e0d0b8] bg-[#fffdf7] px-4 py-3 text-sm text-[#5a4a3a] focus:outline-none"
              />
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomOpen(false)}
                  className="flex-1 btn btn-md btn-default"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCustom}
                  disabled={!customValue.trim()}
                  className="flex-1 btn btn-md btn-primary"
                >
                  保存这个名字
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpeciesCorrectionSheet
