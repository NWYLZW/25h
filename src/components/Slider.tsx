import './Slider.scss'

import type { CSSProperties } from 'react'
import { useState } from 'react'

export interface SliderProps {
  min?: number
  max?: number
  step?: number
  value?: number
  onChange?: (value: number) => void
  className?: string
  style?: CSSProperties
}

export function Slider(props: SliderProps) {
  const { min = 0, max = 100, step = 1, value = 0, onChange } = props
  const [v, setV] = useState(value)

  return <input
    type='range'
    className={`slider ${props.className}`}
    style={props.style}
    min={min}
    max={max}
    step={step}
    value={v}
    onChange={e => {
      const v = Number(e.target.value)
      setV(v)
      onChange?.(v)
    }}
  />
}
