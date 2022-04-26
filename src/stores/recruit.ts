import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ComputedRef, Ref } from 'vue'
import recruitDataURL from '../../game_data/organized/recruit.json?url'
import type { ICharacter, ICombination, IMatchResult, IRecruitData, ITag } from '~/types'
import { combinationsAll, toCombination } from '~/composables'

export const useRecruitStore = defineStore('recruit', () => {
  const data: Ref<IRecruitData> = ref({
    allTags: [],
    characters: [],
  })
  const isFetching = ref(true)

  // 双向绑定的当前用户输入
  const query = ref('')
  const queryNormalized = computed(() => query.value.replaceAll(' ', '').toLowerCase())

  // 用户已经选择的标签名称列表
  const selectedTags: Ref<string[]> = ref([])

  // 根据当前用户输入可提供的搜索建议
  const hits: ComputedRef<ITag[]> = computed(() => {
    // inspired by npm module `match-sorter`，但实现方式不同
    const tagsWithPrecedence: [ITag[], ITag[]] = [[], []]

    for (const tag of data.value.allTags) {
      // 优先度0：以搜索关键词开头
      if (tag.name.startsWith(queryNormalized.value) || tag.pinyin.some(pinyin => pinyin.startsWith(queryNormalized.value))) {
        tagsWithPrecedence[0].push(tag)
        continue
      }

      // 优先度1：包含搜索关键词
      if (tag.name.includes(queryNormalized.value) || tag.pinyin.some(pinyin => pinyin.includes(queryNormalized.value)))
        tagsWithPrecedence[1].push(tag)
    }

    return tagsWithPrecedence.flat()
  })

  // 会出现二三星的组合，多次查询间可缓存
  const mediocreCombinations = ref(new Set<ICombination>())

  // 查询结果
  const matches: ComputedRef<IMatchResult> = computed(() => {
    const result = new Map<ICombination, ICharacter[]>()

    for (const character of data.value.characters) {
      const possibleTagCombinations = combinationsAll(character.tags)
      for (const tags of possibleTagCombinations) {
        const combination = toCombination(tags)
        // 如果当前干员为二星或三星，则该角色的标签的所有可能组合均应标记为低价值
        if (character.rarity === 1 || character.rarity === 2) {
          mediocreCombinations.value.add(combination)
          continue
        }
        // 干员为其他高价值星级

        // 该标签组合已被标记会出现二三星角色，跳过
        if (mediocreCombinations.value.has(combination))
          continue

        // 用户已选择的标签能够满足该标签组合的需要，并且如果是六星则必须包含“高级资深干员”标签
        if (
          tags.every(tag => selectedTags.value.includes(tag))
          && (character.rarity <= 4 || selectedTags.value.includes('高级资深干员'))
        ) {
          result.set(combination,
            [
              ...(result.get(combination) ?? []),
              character,
            ],
          )
        }
      }
    }

    return result
  })

  async function fetchData() {
    const res = await fetch(recruitDataURL)
    data.value = await res.json()
    isFetching.value = false
  }

  return {
    data,
    isFetching,
    query,
    queryNormalized,
    selectedTags,
    hits,
    mediocreCombinations,
    matches,
    fetchData,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useRecruitStore, import.meta.hot))
