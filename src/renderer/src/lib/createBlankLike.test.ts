import { describe, it, expect } from 'vitest'
import { createBlankLike } from './createBlankLike'

describe('createBlankLike', () => {
  it('returns an empty array for an array sample', () => {
    expect(createBlankLike([1, 2, 3])).toEqual([])
  })

  it('returns an empty string for null or undefined', () => {
    expect(createBlankLike(null)).toBe('')
    expect(createBlankLike(undefined)).toBe('')
  })

  it('returns an empty string for a string sample', () => {
    expect(createBlankLike('hello')).toBe('')
  })

  it('returns 0 for a number sample', () => {
    expect(createBlankLike(42)).toBe(0)
  })

  it('returns false for a boolean sample', () => {
    expect(createBlankLike(true)).toBe(false)
    expect(createBlankLike(false)).toBe(false)
  })

  it('recursively blanks each value of a flat object', () => {
    expect(createBlankLike({ a: 'x', b: 1, c: true })).toEqual({ a: '', b: 0, c: false })
  })

  it('recursively blanks nested objects', () => {
    expect(
      createBlankLike({
        name: 'x',
        address: { city: 'y', zip: 12345 },
        active: true
      })
    ).toEqual({
      name: '',
      address: { city: '', zip: 0 },
      active: false
    })
  })

  it('recursively blanks arrays nested inside objects', () => {
    expect(createBlankLike({ tags: ['a', 'b'] })).toEqual({ tags: [] })
  })

  it('handles deeply nested objects', () => {
    expect(
      createBlankLike({
        a: { b: { c: { d: 'deep' } } }
      })
    ).toEqual({
      a: { b: { c: { d: '' } } }
    })
  })
})
