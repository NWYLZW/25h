import './App.scss'

import { useState } from 'react'

import { GridFor25H } from './components/GridFor25H.tsx'
import { Tags } from './components/Tags.tsx'
import { ThemeSwitcher } from './components/ThemeSwitcher.tsx'

export default function App() {
  const now = Date.now()
  const len = 7

  const [offset, setOffset] = useState(0)
  const [index, setIndex] = useState(len - 1)

  return <>
    <h1>
      <a href='https://github.com/nwylzw/25h' target='_blank' rel='noreferrer'>
        25H
        <img src='https://github.githubassets.com/favicons/favicon.svg'
             alt='GitHub 25H Repsitory'
             width='28'
             height='28'
        />
      </a>
    </h1>
    <Tags />
    <GridFor25H
      notNow={offset === 0 ? undefined : new Date(Date.now() + offset * 24 * 60 * 60 * 1000)}
      style={{ marginTop: 50 }}
    />
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem'
    }}>
      <button onClick={() => {
        if (index > len / 2)
          setIndex(index - 1)
        setOffset(offset - 1)
      }}>
        prev
      </button>
      {offset < 0 ? <button onClick={() => {
        if (index > len / 2)
          setIndex(index + 1)
        setOffset(offset + 1)
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
          notNow={new Date(now + d * 24 * 60 * 60 * 1000)}
          className={i === index ? 'active' : ''}
        />
      })}
    </div>
    <ThemeSwitcher />
  </>
}
