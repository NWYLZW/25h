import './GridFor25H.scss'

import type { CSSProperties } from 'react'
import { useState } from 'react'

import Close from '../assets/close.svg'
import { useDateData } from '../store.ts'
import { ymd } from '../utils.ts'

export function GridFor25H({
  notNow,
  size = 'large',
  style
}: {
  notNow?: Date
  size?: 'small' | 'large'
  style?: CSSProperties
}) {
  const now = notNow ? notNow : new Date()
  const hour = now.getHours()

  const [index, setIndex] = useState(-1)
  const [cards, dispatchNewCard] = useDateData(now)

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
        />
        : <div
          className='content'
        >
          {cards[i]?.content}
        </div>}
      <div className='hour'>{i + 1}H</div>
    </div>)}
    <div className='title'>
      {ymd(now)}
    </div>
  </div>
}
