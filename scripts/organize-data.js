const fs = require('node:fs')
const path = require('node:path')
const pinyin = require('pinyin')
const characterTable = require('../game_data/raw/character_table.json')
const gachaTable = require('../game_data/raw/gacha_table.json')

// 用于将gacha_table.json的recruitDetail字段字符串切分成按照星级排列的多条信息
const recruitableRegex = /(★+)\\n(.+?)(\n|$)/g

// TODO: 可以换成tagId，以适用于其他国际服

// 在游戏中已废弃不会出现在公开招募中的tag
const excludedTags = ['男性干员', '女性干员']

// 稀有度标签，“新手”已包含在干员tagList内
const rarityMapping = { 0: '支援机械', 4: '资深干员', 5: '高级资深干员' }

// 近战远程标签
const positionMapping = { MELEE: '近战位', RANGED: '远程位' }

// 职业标签
const professionMapping = {
  WARRIOR: '近卫干员',
  SNIPER: '狙击干员',
  TANK: '重装干员',
  MEDIC: '医疗干员',
  SUPPORT: '辅助干员',
  CASTER: '术师干员',
  SPECIAL: '特种干员',
  PIONEER: '先锋干员',
}

function cleanCharacterName(str) {
  const recruitOnly = str.startsWith('<@rc.eml>') && str.endsWith('</>')

  return {
    name: recruitOnly ? str.slice(9, -3) : str, // strip <@rc.eml> and </>
    recruitOnly,
  }
}

function getCharacterByName(characterName) {
  return Object.values(characterTable)
    .find(character => character.name === characterName)
}

function getTagList(characterName) {
  const character = getCharacterByName(characterName)

  const tags = [
    ...character.tagList,
    rarityMapping[character.rarity],
    positionMapping[character.position],
    professionMapping[character.profession],
  ].filter(Boolean) // remove `undefined`

  return [...new Set(tags)] // remove duplicates
}

function getRecruitableCharacters() {
  const recruitableCharacters = []

  for (const match of gachaTable.recruitDetail.matchAll(recruitableRegex)) {
    const [, stars, charactersStr] = match

    // 稀有度等于星级减1
    const rarity = stars.length - 1

    const characters = charactersStr
      .split(' / ')
      .map(str => cleanCharacterName(str))
      .map(character => ({
        ...character,
        rarity,
        tags: getTagList(character.name),
      }))

    recruitableCharacters.push(characters)
  }

  return recruitableCharacters.flat()
}

function getAllRecruitTags() {
  return gachaTable.gachaTags
    .map(tag => tag.tagName)
    .filter(tag => !excludedTags.includes(tag))
    .map((tag) => {
      const pinyinArr = pinyin.default(tag, {
        segment: true,
        style: 'normal',
        compact: true,
      })

      return {
        name: tag,
        pinyin: [
          ...pinyinArr.map(arr => arr.join('')), // 每个字的拼音挨在一起，没有空格，例如shuchu（输出）
          ...pinyinArr.map(arr => arr.map(pinyin => pinyin[0]).join('')), // 拼音首字母缩写，例如sc（输出）
        ],
      }
    })
}

function organizeData() {
  return {
    allTags: getAllRecruitTags(),
    characters: getRecruitableCharacters(),
  }
}

fs.writeFileSync(
  path.resolve(__dirname, '..', 'game_data', 'organized', 'recruit.json'),
  JSON.stringify(organizeData(), null, 2),
)
