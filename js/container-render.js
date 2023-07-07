const now = new Date()
const nowDate = `${now.getFullYear()}-${formatNum(now.getMonth() + 1)}-${formatNum(now.getDate())}`

/** @type {{
  [DateStr in string]: { content: string }[]
}} */
let markStorage

try {
  markStorage = JSON.parse(localStorage.getItem('mark') ?? '{}')
} catch (e) {
  if (confirm('数据初始化失败，是否清除数据？')) {
    localStorage.removeItem('mark')
    location.reload()
  } else {
    throw e
  }
}

function setHourData(hour, { content }) {
  const curDayData = markStorage[nowDate] = markStorage[nowDate] ?? []
  curDayData[hour] = { content }
  localStorage.setItem('mark', JSON.stringify(markStorage))
}

function getHourData(hour) {
  const curDayData = markStorage[nowDate] = markStorage[nowDate] ?? []
  return curDayData[hour]
}

function formatNum(num) {
  return `${num < 10 ? '0' : ''}${num}`
}

const container = document.querySelector('#container')

container.innerHTML = [...Array(5 * 5).keys()].map(i => `<div class='hour-card' data-value='${i}'>
  <span class='container'>${getHourData(i)?.content ?? ''}</span>
  <span class='bg-num'>${formatNum(i + 1)}H</span>
</div>`).join('')

/** @typedef {{ content: string }} Describe */

let [resolve, reject] = /** @type {[null | ((d: Describe) => void), null | Function]} */ [null, null]

/** @type {HTMLDialogElement} */
const describe = document.querySelector('#describe')
/** @type {HTMLTextAreaElement} */
const contentEle = document.querySelector('#content')

describe.querySelector('.cancel')
  .addEventListener('click', () => describe.close())
describe.querySelector('.confirm')
  .addEventListener('click', () => {
    describe.close()
    const content = contentEle.value
    contentEle.value = ''
    resolve?.({ content })
  })

/**
 * @param {number} hour
 * @return {Promise<Describe>}
 */
function setDescribe(hour) {
  describe.showModal()
  describe.querySelector('.title')
    .innerText = `正在配置${formatNum(hour + 1)}H`
  contentEle.value = getHourData(hour)?.content ?? ''
  return new Promise((res, rej) => [resolve, reject] = [res, rej])
}

/** @type {HTMLDivElement[]} */
const hourCards = document.querySelectorAll('.hour-card') ?? []
hourCards.forEach(card => {
  card.addEventListener('dblclick', async () => {
    const v = await setDescribe(Number(
      card.dataset.value
    ))
    setHourData(Number(card.dataset.value), v)
    card.querySelector('.container')
      .innerText = v.content
  })
})
