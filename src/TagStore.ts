import { useEffect, useReducer, useSyncExternalStore } from 'react'

export interface Tag {
  content?: string
  color?: string | [lightColor: string, darkColor: string]
}

const STORE_KEY = 'tag'

let store: Tag[]

const listeners: Function[] = []

function subscribeStore(listener: Function) {
  listeners.push(listener)
  return () => {
    const idx = listeners.indexOf(listener)
    if (idx !== -1) {
      listeners.splice(idx, 1)
    } else {
      console.warn('listener not found')
    }
  }
}

function notifyStore() {
  listeners.forEach(l => l())
}

try {
  store = JSON.parse(localStorage.getItem(STORE_KEY) ?? JSON.stringify([
    { content: '😴 睡觉', color: ['#8b72fc', '#4f3bd4'] },
    { content: '🍚 吃饭', color: ['#98e7ff', '#00b0ff'] },
    { content: '⌨️ 打工', color: ['#ffa459', '#ff6f00'] },
    { content: '🎮 电动', color: ['#595b59', '#1b1c1b'] }
  ]))
} catch (e) {
  if (confirm('Failed to load store from localStorage, clear it?')) {
    localStorage.removeItem(STORE_KEY)
    store = []
  } else {
    throw e
  }
}

function setTagData(data: Tag[]) {
  store = data
  localStorage.setItem(STORE_KEY, JSON.stringify(store))
  notifyStore()
}

const EMPTY = [] as unknown[]

export function useTagsFromStore() {
  const tags = useSyncExternalStore(subscribeStore, () => store ?? EMPTY)

  const [a, d] = useReducer((
    state: Tag[],
    action:
      | { type: 'set'; index: number; data: Tag }
      | { type: 'upd'; data: Tag[] }
  ) => {
    const newState = [...state]
    switch (action.type) {
      case 'set':
        newState[action.index] = action.data
        setTagData(newState)
        return newState
      case 'upd':
        setTagData(action.data)
        return action.data
    }
  }, tags)
  useEffect(() => {
    d({ type: 'upd', data: tags })
  }, [tags])
  return [a, d] as const
}
