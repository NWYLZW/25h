import './Tags.scss'

import { useMemo, useState } from 'react'

import type { Tag as ITag } from '../TagStore.ts'
import { useTagsFromStore } from '../TagStore.ts'

function Tag({
  data: tag
}: {
  data: ITag
}) {
  const [tags, setTags] = useTagsFromStore()

  const [isEditing, setIsEditing] = useState(false)
  const [nk, setNK] = useState(tag.content ?? '')
  const [nca, setNCA] = useState<[string, string]>(
    Array.isArray(tag.color)
      ? [tag.color[0] ?? '#555555', tag.color[1] ?? '#888888']
      : [tag.color ?? '#555555', '#888888']
  )

  const lc = useMemo(() => (Array.isArray(tag.color) ? tag.color[0] : tag.color) || '#eee', [tag.color])
  const dc = useMemo(() => (Array.isArray(tag.color) ? tag.color[1] : tag.color) || '#eee', [tag.color])
  return <div className='tag-wrap'>
    <div
      className={
        'tag'
        + (isEditing ? ' editing' : '')
      }
      style={{
        // @ts-ignore
        '--l-color': lc,
        '--d-color': dc
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
      onDoubleClick={() => setIsEditing(true)}
    >
      {tag.content?.slice(0, 2)}
    </div>
    <div
      className={
        'tag cover'
        + (isEditing ? ' editing' : '')
      }
      style={{
        // @ts-ignore
        '--l-color': nca[0] || '#eeeeee',
        '--d-color': nca[1] || '#eeeeee',
        '--l-f-color': parseInt((nca[0] || '#eeeeee').slice(1), 16) < 0x888888 ? '#ffffff' : '#000000',
        '--d-f-color': parseInt((nca[1] || '#eeeeee').slice(1), 16) < 0x888888 ? '#ffffff' : '#000000'
      }}
    >
      <span className='trash' onDoubleClick={() => {
        const i = tags.findIndex(t => t.content === tag.content)
        tags.splice(i, 1)
        setTags({ type: 'upd', data: [...tags] })
      }}>🗑️</span>
      <input
        type='text'
        value={nk}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        onChange={e => setNK(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && nk.trim()) {
            const i = tags.findIndex(t => t.content === tag.content)
            tags[i] = { content: nk, color: nca }
            setTags({ type: 'upd', data: [...tags] })
            setIsEditing(false)
            ;(e.target as HTMLInputElement).blur()
          }
          if (e.key === 'Escape') {
            setIsEditing(false)
            setNK(tag.content ?? '')
            setNCA(
              Array.isArray(tag.color)
                ? [tag.color[0] ?? '#333', tag.color[1] ?? '#888']
                : [tag.color ?? '#333', '#888']
            )
            ;(e.target as HTMLInputElement).blur()
          }
        }}
      />
      {nca.map((c, i) => <input
        key={i}
        type='color'
        value={c}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          setIsEditing(false)
          const i = tags.findIndex(t => t.content === tag.content)
          tags[i] = { content: nk, color: nca }
          setTags({ type: 'upd', data: [...tags] })
          setIsEditing(false)
        }}
        onChange={e => {
          nca[i] = e.target.value
          setNCA([...nca])
        }}
      />)}
    </div>
  </div>
}

export function Tags() {
  const [tags, setTags] = useTagsFromStore()

  const [isEditing, setIsEditing] = useState(false)
  const [nk, setNK] = useState('')
  const [nca, setNCA] = useState<[string, string]>(['#555555', '#888888'])

  return <div className='tags' data-scoped='Component'>
    {tags.map(tag => <Tag key={tag.content} data={tag} />)}
    <div
      className={
        'tag add'
        + (isEditing ? ' editing' : '')
      }
      style={{
        // @ts-ignore
        '--l-color': nca[0],
        '--d-color': nca[1]
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
    </div>
  </div>
}
