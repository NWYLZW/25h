import './Timeline.scss'

import { useState } from 'react'

import { GridFor25H } from './GridFor25H.tsx'

export function Timeline(props: {
  offset?: number
  onOffsetChange?: (offset: number) => void
}) {
  const now = Date.now()
  const len = 7
  const [offset, setOffset] = useState(props.offset || 0)
  const changeOffset = (offset: number) => {
    setOffset(offset)
    props.onOffsetChange?.(offset)
  }
  const [index, setIndex] = useState(len - 1)

  return <>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem'
    }}>
      <button onClick={() => {
        if (index > len / 2)
          setIndex(index - 1)
        changeOffset(offset - 1)
      }}>
        prev
      </button>
      {offset < 0 ? <button onClick={() => {
        if (index > len / 2)
          setIndex(index + 1)
        changeOffset(offset + 1)
      }}>
        next
      </button> : null}
    </div>
    <div
      className='timeline'
      style={{
        // @ts-ignore
        '--card-size': `${100 / len}px`
      }}
      >
      {[...Array(len)].map((_, i) => {
        const d = offset + (i - index)
        return d > 0 ? null : <GridFor25H
          key={i}
          disabled
          notNow={new Date(now + d * 24 * 60 * 60 * 1000)}
          className={i === index ? 'active' : ''}
        />
      })}
    </div>
  </>
}
