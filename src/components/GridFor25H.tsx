import './GridFor25H.scss'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'

import Close from '../assets/close.svg'
import { useDateData } from '../store.ts'
import { notify, ymd } from '../utils.ts'

const messages = [
  '时间不知不觉又过去了，你干了啥？别忘了记下来。',
  '点我，记得记录。',
  '时间需要被记忆。',
  '别忘了这个周期。'
]

export function GridFor25H({
  notNow,
  size = 'large',
  style
}: {
  notNow?: Date
  size?: 'small' | 'large'
  style?: CSSProperties
}) {
  const [now, setNow] = useState(notNow ? notNow : new Date())
  const hour = useMemo(() => now.getHours(), [now])

  const [index, setIndex] = useState(-1)
  const [cards, dispatchNewCard] = useDateData(now)

  useEffect(() => {
    setNow(notNow ? notNow : new Date())
  }, [notNow])
  useEffect(() => {
    if (notNow) return

    let i = setTimeout(function re() {
      const now = new Date()
      if (now.getHours() !== hour) {
        notify('25H', messages[Math.floor(Math.random() * messages.length)])
        setNow(now)
      }
      i = setTimeout(re, 1000 * (60 - new Date().getSeconds()))
    }, 1000 * (60 - new Date().getSeconds()))
    return () => clearTimeout(i)
  }, [hour, notNow])

  return <div className={`grid-for-25h ${size}`} style={style}>
    {[...Array(25)].map((_, i) => <div
      key={i}
      className={
        'hour-card'
        + (i === hour && !notNow ? ' now' : '')
        + (i === index ? ' selected' : '')
        + (cards[i]?.content.trim() ? '' : ' empty')
      }
      onClick={() => size === 'large' && setIndex(i)}
      onDoubleClick={() => size === 'large' && setIndex(-1)}
    >
      <img src={Close}
           alt='Close'
           className='close icon'
           onClick={e => (
             setIndex(-1),
             e.stopPropagation()
           )}
      />
      {index === i
        ? <textarea
          className='content'
          autoFocus
          value={cards[i]?.content}
          onChange={e => dispatchNewCard({
            type: 'set',
            hour: i,
            data: { content: e.target.value }
          })}
          onDoubleClick={e => e.stopPropagation()}
        />
        : <pre className='content'>
          {cards[i]?.content}
        </pre>}
      <div className='hour'>{i + 1}H</div>
    </div>)}
    <div className='title'>
      {ymd(now)}
    </div>
  </div>
}
