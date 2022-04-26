import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface ITag {
  name: string
  pinyin: string[]
}

export interface ICharacter {
  name: string
  recruitOnly: boolean
  rarity: 0 | 1 | 2 | 3 | 4 | 5
  tags: string[]
}

export interface IRecruitData {
  allTags: ITag[]
  characters: ICharacter[]
}

/**
 * Tags are separated by "|".
*/
export type ICombination = string

// 此次招募可出角色对应的标签
export type IMatchResult = Map<ICombination, ICharacter[]>
