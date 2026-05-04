export const SPECIES_CORRECTION_OPTIONS = {
  猫: ['橘猫', '奶牛猫', '狸花猫', '黑猫', '白猫', '三花猫', '玳瑁猫', '英短', '美短', '布偶猫', '波斯猫', '缅因猫', '暹罗猫', '折耳猫', '银渐层'],
  狗: ['泰迪/贵宾', '博美', '比熊', '马尔济斯', '约克夏', '腊肠', '巴哥', '雪纳瑞', '柴犬', '柯基', '法斗', '英斗', '秋田', '金毛', '拉布拉多', '萨摩耶', '阿拉斯加', '哈士奇', '边牧', '中华田园犬'],
  鸟: ['麻雀', '鸽子', '乌鸦', '喜鹊', '鹦鹉', '白鹭', '野鸭', '猫头鹰', '燕子', '翠鸟', '孔雀', '火烈鸟', '鸵鸟', '丹顶鹤'],
}

const CATEGORY_ORDER = ['猫', '狗', '鸟']

export function inferSuggestedCorrectionCategory({ category, speciesTag, species }) {
  const trimmedCategory = String(category || '').trim()
  if (CATEGORY_ORDER.includes(trimmedCategory)) {
    return trimmedCategory
  }

  const text = `${speciesTag || ''} ${species || ''}`
  if (/(猫|英短|美短|布偶|波斯|缅因|暹罗|折耳|银渐层)/.test(text)) return '猫'
  if (/(狗|犬|泰迪|博美|比熊|柴犬|柯基|金毛|拉布拉多|边牧|哈士奇)/.test(text)) return '狗'
  if (/(鸟|雀|鸽|鹦鹉|鸭|鹭|燕|翠鸟|孔雀|火烈鸟|鸵鸟|丹顶鹤)/.test(text)) return '鸟'

  return null
}

export function getCorrectionSections(suggestedCategory) {
  if (suggestedCategory && SPECIES_CORRECTION_OPTIONS[suggestedCategory]) {
    return [
      {
        category: suggestedCategory,
        options: [...SPECIES_CORRECTION_OPTIONS[suggestedCategory], '其他'],
      },
    ]
  }

  return CATEGORY_ORDER.map((category) => ({
    category,
    options: [...SPECIES_CORRECTION_OPTIONS[category], '其他'],
  }))
}
