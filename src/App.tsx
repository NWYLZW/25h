import './App.scss'

import { useState } from 'react'

import { GridFor25H } from './components/GridFor25H.tsx'
import { Tags } from './components/Tags.tsx'
import { ThemeSwitcher } from './components/ThemeSwitcher.tsx'
import { Timeline } from './components/Timeline.tsx'

export default function App() {
  const [offset, setOffset] = useState(0)

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
      editable
      notNow={offset === 0 ? undefined : new Date(Date.now() + offset * 24 * 60 * 60 * 1000)}
      style={{ marginTop: 50 }}
    />
    <Timeline
      offset={offset}
      onOffsetChange={setOffset}
    />
    <ThemeSwitcher />
  </>
}
