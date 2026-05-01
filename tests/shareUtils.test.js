import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildShareFilename,
  generateShareText,
} from '../src/utils/shareUtils.js'

test('buildShareFilename sanitizes unsupported characters', () => {
  const filename = buildShareFilename({
    species: '黑/白:猫*?<>|',
    createdAt: '2026-05-01T10:00:00.000Z',
  })

  assert.equal(filename, '黑-白-猫------2026-05-01.png')
})

test('generateShareText falls back to defaults when fields are empty', () => {
  const text = generateShareText({
    species: '',
    location: '',
    createdAt: '2026-05-01T10:00:00.000Z',
    journal: '',
  })

  assert.match(text, /未命名动物/)
  assert.match(text, /城市某处/)
  assert.match(text, /2026年05月01日/)
  assert.match(text, /今天也遇见了新的动物朋友。/)
})
