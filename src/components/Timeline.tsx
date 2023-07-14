import './Timeline.scss'

import { useDebouncedState } from 'foxact/use-debounced-state'
import { useCallback, useEffect, useState } from 'react'

import { GridFor25H } from './GridFor25H.tsx'
import { Slider } from './Slider.tsx'

export function Timeline({
  offset: _offset,
  onOffsetChange
}: {
  offset?: number
  onOffsetChange?: (offset: number) => void
}) {
  const now = Date.now()
  const [len, setLen] = useDebouncedState(10, 100)
  const [offset, setOffset] = useState(_offset || 0)
  const changeOffset = useCallback((offset: number) => {
    setOffset(offset)
    onOffsetChange?.(offset)
  }, [onOffsetChange])
  const [index, setIndex] = useState(len - 1)
  useEffect(() => {
    setIndex(len - 1)
    changeOffset(0)
  }, [changeOffset, len])

  return <>
    <div className='timeline-operate'>
      <button onClick={() => {
        if (index > len / 2)
          setIndex(index - 1)
        changeOffset(offset - 1)
      }}>
        prev
      </button>
      {offset < 0 ? <button onClick={() => {
        if (-offset < Math.floor(len / 2))
          setIndex(index + 1)
        changeOffset(offset + 1)
      }}>
        next
      </button> : null}
    </div>
    <Slider className='timeline'
            min={2}
            max={30}
            step={2}
            value={len}
            onChange={setLen}
    />
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
          editable
          notNow={new Date(now + d * 24 * 60 * 60 * 1000)}
          className={i === index ? 'active' : ''}
        />
      })}
    </div>
  </>
}
