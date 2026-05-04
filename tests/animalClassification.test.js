import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeAnimalClassification } from '../api/_lib/animalClassification.js'

test('normalizeAnimalClassification keeps explicit known species tags', () => {
  assert.deepEqual(
    normalizeAnimalClassification('暹罗猫', '其他', '暹罗猫'),
    { category: '猫', speciesTag: '暹罗猫' }
  )
})

test('normalizeAnimalClassification infers siamese cat from final species text', () => {
  assert.deepEqual(
    normalizeAnimalClassification('暹罗猫', '其他', 'other-animal'),
    { category: '猫', speciesTag: '暹罗猫' }
  )
})

test('normalizeAnimalClassification falls back to broad dog and bird buckets', () => {
  assert.deepEqual(
    normalizeAnimalClassification('小黄狗', '', ''),
    { category: '狗', speciesTag: '中华田园犬' }
  )

  assert.deepEqual(
    normalizeAnimalClassification('路边小鸟', '', ''),
    { category: '鸟', speciesTag: '其他鸟类' }
  )
})
