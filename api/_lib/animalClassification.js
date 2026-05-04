const SPECIES_TAG_DEFINITIONS = {
  猫: ['橘猫', '奶牛猫', '狸花猫', '黑猫', '白猫', '三花猫', '玳瑁猫', '英短', '美短', '布偶猫', '波斯猫', '缅因猫', '暹罗猫', '折耳猫', '银渐层', '其他猫类'],
  狗: ['泰迪/贵宾', '博美', '比熊', '马尔济斯', '约克夏', '腊肠', '巴哥', '雪纳瑞', '柴犬', '柯基', '法斗', '英斗', '秋田', '金毛', '拉布拉多', '萨摩耶', '阿拉斯加', '哈士奇', '边牧', '中华田园犬', '其他犬种'],
  鸟: ['麻雀', '鸽子', '乌鸦', '喜鹊', '鹦鹉', '白鹭', '野鸭', '猫头鹰', '燕子', '翠鸟', '孔雀', '火烈鸟', '鸵鸟', '丹顶鹤', '其他鸟类'],
  哺乳动物: ['松鼠', '兔子', '刺猬', '浣熊', '仓鼠', '花栗鼠', '羊驼', '小熊猫', '水獭', '龙猫/栗鼠', '雪貂', '狐狸', '梅花鹿', '土拨鼠', '宠物猪'],
  大型野生: ['大熊猫', '长颈鹿', '斑马', '亚洲象', '非洲象', '狮子', '老虎', '猎豹', '雪豹', '北极熊', '棕熊', '河马', '犀牛'],
  灵长类: ['猕猴', '金丝猴', '黑猩猩', '猩猩', '大猩猩', '长臂猿'],
  爬行水生: ['乌龟', '青蛙', '蜥蜴', '壁虎', '蛇', '鳄鱼', '企鹅', '海豚', '海豹', '海狮'],
}

const SPECIES_TO_CATEGORY = new Map(
  Object.entries(SPECIES_TAG_DEFINITIONS).flatMap(([category, tags]) => (
    tags.map((tag) => [tag, category])
  ))
)

const HEURISTIC_MATCHERS = [
  { category: '猫', speciesTag: '暹罗猫', pattern: /暹罗/ },
  { category: '猫', speciesTag: '布偶猫', pattern: /布偶/ },
  { category: '猫', speciesTag: '英短', pattern: /(英短|英国短毛)/ },
  { category: '猫', speciesTag: '美短', pattern: /(美短|美国短毛)/ },
  { category: '猫', speciesTag: '折耳猫', pattern: /(折耳|苏格兰折耳)/ },
  { category: '猫', speciesTag: '银渐层', pattern: /银渐层/ },
  { category: '猫', speciesTag: '缅因猫', pattern: /缅因/ },
  { category: '猫', speciesTag: '波斯猫', pattern: /波斯/ },
  { category: '猫', speciesTag: '橘猫', pattern: /(橘猫|橘色.*猫|姜猫)/ },
  { category: '猫', speciesTag: '奶牛猫', pattern: /(奶牛猫|黑白.*猫)/ },
  { category: '猫', speciesTag: '狸花猫', pattern: /(狸花|虎斑猫)/ },
  { category: '猫', speciesTag: '三花猫', pattern: /三花/ },
  { category: '猫', speciesTag: '玳瑁猫', pattern: /玳瑁/ },
  { category: '猫', speciesTag: '黑猫', pattern: /黑猫/ },
  { category: '猫', speciesTag: '白猫', pattern: /白猫/ },
  { category: '猫', speciesTag: '其他猫类', pattern: /猫/ },
  { category: '狗', speciesTag: '中华田园犬', pattern: /(狗|犬)/ },
  { category: '鸟', speciesTag: '其他鸟类', pattern: /(鸟|雀|鸽|鹦鹉|鹰|鸭|鹅|鹭)/ },
  { category: '哺乳动物', speciesTag: '松鼠', pattern: /松鼠/ },
  { category: '哺乳动物', speciesTag: '兔子', pattern: /(兔|兔子)/ },
  { category: '哺乳动物', speciesTag: '刺猬', pattern: /刺猬/ },
  { category: '爬行水生', speciesTag: '乌龟', pattern: /(龟|乌龟)/ },
  { category: '爬行水生', speciesTag: '青蛙', pattern: /(蛙|青蛙)/ },
]

export const ALL_SPECIES_TAGS = Object.values(SPECIES_TAG_DEFINITIONS).flat().join('、')

export function normalizeAnimalClassification(species, providedCategory = '', providedSpeciesTag = '') {
  const normalizedSpecies = String(species || '').trim()
  let category = String(providedCategory || '').trim()
  let speciesTag = String(providedSpeciesTag || '').trim()

  if (SPECIES_TO_CATEGORY.has(speciesTag)) {
    category = SPECIES_TO_CATEGORY.get(speciesTag)
  }

  if ((!category || category === '其他') && normalizedSpecies) {
    if (SPECIES_TO_CATEGORY.has(normalizedSpecies)) {
      speciesTag = normalizedSpecies
      category = SPECIES_TO_CATEGORY.get(normalizedSpecies)
    } else {
      const matcher = HEURISTIC_MATCHERS.find(({ pattern }) => pattern.test(normalizedSpecies))
      if (matcher) {
        category = matcher.category
        speciesTag = matcher.speciesTag
      }
    }
  }

  if (!category) {
    category = '其他'
  }

  if (!speciesTag) {
    speciesTag = category === '猫'
      ? '其他猫类'
      : category === '狗'
      ? '其他犬种'
      : category === '鸟'
        ? '其他鸟类'
        : 'other-animal'
  }

  return { category, speciesTag }
}
