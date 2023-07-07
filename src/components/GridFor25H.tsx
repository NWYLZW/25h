import './GridFor25H.scss'

import { useState } from 'react'

import Close from '../assets/close.svg'
import { useNowData } from '../store.ts'

export function GridFor25H() {
  const now = new Date()
  const hour = now.getHours()

  const [index, setIndex] = useState(-1)
  const [cards, dispatchNewCard] = useNowData()

  return <div className='grid-for-25h'>
    {[...Array(25)].map((_, i) => <div
      key={i}
      className={
        'hour-card'
        + (i === hour ? ' now' : '')
        + (i === index ? ' selected' : '')
        + (cards[i]?.content.trim() ? '' : ' empty')
      }
      onClick={() => {
        setIndex(i)
      }}
      onDoubleClick={() => setIndex(-1)}
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
  </div>
}
