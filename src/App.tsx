import './App.scss'

import { useState } from 'react'

import { GridFor25H } from './components/GridFor25H.tsx'
import { ThemeSwitcher } from './components/ThemeSwitcher.tsx'
import { useTagsFromStore } from './TagStore.ts'

// TODO Tag Component

function Tags() {
  const [tags, setTags] = useTagsFromStore()

  const [isEditing, setIsEditing] = useState(false)
  const [nk, setNK] = useState('')
  const [nca, setNCA] = useState<[string, string]>(['#333', '#888'])

  return <div className='tags'>
    {tags.map(tag => <span
      key={tag.content}
      className='tag'
      style={{
        // @ts-ignore
        '--l-color': (Array.isArray(tag.color) ? tag.color[0] : tag.color) || '#eee',
        '--d-color': (Array.isArray(tag.color) ? tag.color[1] : tag.color) || '#eee'
      }}
      draggable
      title={tag.content}
      onDragStart={e => {
        e.dataTransfer.setData('text', JSON.stringify({
          type: 'tag',
          color: tag.color,
          content: tag.content
        }))
      }}
    >
      {tag.content?.slice(0, 2)}
    </span>)}
    <span
      className={
        'tag add'
        + (isEditing ? ' editing' : '')
      }
      style={{
        // @ts-ignore
        '--l-color': '#eee',
        '--d-color': '#eee'
      }}
      onClick={() => setIsEditing(true)}
    >
      ➕
      <input
        type='text'
        value={nk}
        onBlur={() => setIsEditing(false)}
        onChange={e => setNK(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && nk.trim()) {
            setTags({
              type: 'upd',
              data: [...tags, {
                content: nk,
                color: nca
              }]
            })
            setIsEditing(false)
            setNK('')
            setNCA(['#333', '#888'])
            ;(e.target as HTMLInputElement).blur()
          }
        }}
      />
      {nca.map((c, i) => <input
        key={i}
        type='color'
        value={c}
        onChange={e => {
          nca[i] = e.target.value
          setNCA([...nca])
        }}
      />)}
    </span>
  </div>
}

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
