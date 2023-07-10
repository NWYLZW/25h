import './App.scss'

import { useState } from 'react'

import { GridFor25H } from './components/GridFor25H.tsx'
import { Tags } from './components/Tags.tsx'
import { ThemeSwitcher } from './components/ThemeSwitcher.tsx'

export default function App() {
  const [index, setIndex] = useState(0)

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
      notNow={index === 0 ? undefined : new Date(Date.now() + index * 24 * 60 * 60 * 1000)}
      style={{ marginTop: 50 }}
    />
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem'
    }}>
      <button onClick={() => setIndex(index - 1)}>
        prev
      </button>
      {index < 0 ? <button onClick={() => setIndex(index + 1)}>
        next
      </button> : null}
    </div>
    <div style={{
      display: 'flex',
      gap: 33.33,
      marginTop: '1rem'
    }}>
      {[...Array(4)].map((_, i) => <GridFor25H
        key={i}
        notNow={new Date(Date.now() + (index + (i - 3)) * 24 * 60 * 60 * 1000)}
        size='small'
      />)}
    </div>
    <ThemeSwitcher />
  </>
}
