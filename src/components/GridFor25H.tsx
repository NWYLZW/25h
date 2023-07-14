import './GridFor25H.scss'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'

import Close from '../assets/close.svg'
import { useDateDataFromStore } from '../DateStore.ts'
import { notify, ymd } from '../utils.ts'

const messages = [
  '时间不知不觉又过去了，你干了啥？别忘了记下来。',
  '点我，记得记录。',
  '时间需要被记忆。',
  '别忘了这个周期。',
  '忆往昔。'
]

export function GridFor25H({
  notNow,
  editable = false,
  className,
  style
}: {
  notNow?: Date
  editable?: boolean
  className?: string
  style?: CSSProperties
}) {
  const [now, setNow] = useState(notNow ? notNow : new Date())
  const hour = useMemo(() => now.getHours(), [now])

  const [index, setIndex] = useState(-1)
  const [cards, dispatchNewCard] = useDateDataFromStore(now)

  useEffect(() => {
    setIndex(-1)
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

  return <div className={`grid-for-25h ${className}`} style={style}>
    {[...Array(25)].map((_, i) => <div
      key={i}
      className={
        'hour-card'
        + (i === hour && !notNow ? ' now' : '')
        + (cards[i]?.content?.trim() ? '' : ' empty')
      }
      onClick={() => editable && setIndex(i)}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        if (!editable) return

        const data = JSON.parse(e.dataTransfer.getData('text'))
        if (data.type === 'tag') {
          dispatchNewCard({
            type: 'set', hour: i,
            data: {
              ...cards[i],
              tags: [...(cards[i]?.tags ?? []), {
                color: data.color,
                content: data.content
              }]
            }
          })
        }
      }}
    >
      <pre className='content'>
        {cards[i]?.content}
      </pre>
      <div className='tags'>
        {cards[i]?.tags?.map(tag => <div
          key={tag.content}
          className='tag'
        >
          {tag.content?.slice(0, 2)}
        </div>)}
      </div>
      <div className='hour'>{i + 1}H</div>
    </div>)}
    <div
      key={index}
      style={{
        // @ts-ignore
        '--start-top': Math.floor(index / 5) * 20 + '%',
        '--start-left': (index % 5) * 20 + '%'
      }}
      className={
        'hour-card overlay'
        + (index !== -1 ? ' selected' : '')
        + (index === hour && !notNow ? ' now' : '')
        + (index !== -1 && !cards[index]?.content?.trim() ? ' empty' : '')
      }
      onDoubleClick={() => editable && setIndex(-1)}
    >
      <img src={Close}
           alt='Close'
           className='close icon'
           onClick={e => (setIndex(-1), e.stopPropagation())}
      />
      <textarea
        className='content'
        autoFocus
        value={cards[index]?.content}
        onChange={e => dispatchNewCard({
          type: 'set',
          hour: index,
          data: { ...cards[index], content: e.target.value }
        })}
        onDoubleClick={e => e.stopPropagation()}
        onKeyUp={e => {
          // esc
          if (e.keyCode === 27) { setIndex(-1) }
        }}
      />
      <div className='tags'>
        {cards[index]?.tags?.map(tag => <div
          key={tag.content}
          className='tag'
          style={{
            // @ts-ignore
            '--l-color': (Array.isArray(tag.color) ? tag.color[0] : tag.color) || '#eee',
            '--d-color': (Array.isArray(tag.color) ? tag.color[1] : tag.color) || '#eee'
          }}
        >
          {tag.content}&nbsp;<span className='trash' onClick={() => {
            dispatchNewCard({
              type: 'set', hour: index,
              data: {
                ...cards[index],
                tags: cards[index]?.tags?.filter(t => t !== tag)
              }
            })
          }}>🗑️</span>
        </div>)}
      </div>
      <div className='hour'>{index + 1}H</div>
    </div>
    <div className='title'>
      {ymd(now)}
    </div>
  </div>
}
