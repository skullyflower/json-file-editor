// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createBlankLike = (sample: any): any => {
  if (Array.isArray(sample)) return []
  if (sample === null || sample === undefined) return ''
  switch (typeof sample) {
    case 'string':
      return ''
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'object':
      return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, createBlankLike(v)]))
    default:
      return ''
  }
}
