import type { ICombination } from '~/types'

export const TAG_SEPARATOR = '|'

export const toCombination = (tags: string[]): ICombination => {
  return tags.join(TAG_SEPARATOR)
}

export const toTags = (combination: ICombination): string[] => {
  return combination.split(TAG_SEPARATOR)
}
