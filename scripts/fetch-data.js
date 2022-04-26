const fs = require('node:fs')
const path = require('node:path')
const undici = require('undici')

const dataList = [
  'https://cdn.jsdelivr.net/gh/Kengxxiao/ArknightsGameData/zh_CN/gamedata/excel/character_table.json',
  'https://cdn.jsdelivr.net/gh/Kengxxiao/ArknightsGameData/zh_CN/gamedata/excel/gacha_table.json',
]

async function fetchData(url) {
  const response = await undici.request(url)
  return response.body.json()
}

function getFileNameFromURL(url) {
  return new URL(url).pathname.split('/').pop()
}

(async() => {
  for (const dataURL of dataList) {
    const result = await fetchData(dataURL)
    fs.writeFileSync(
      path.resolve(__dirname, '..', 'game_data', 'raw', getFileNameFromURL(dataURL)),
      JSON.stringify(result, null, 2),
    )
  }
})()
