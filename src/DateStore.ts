import { useCallback, useEffect, useReducer, useSyncExternalStore } from 'react'

import type { Tag } from './TagStore.ts'

interface DateData {
  tags?: Tag[]
  content?: string
}

const STORE_KEY = 'store'

interface DateStore {
  [DateKey: string]: DateData[]
}

let store: DateStore

const listeners: Map<string, Function[]> = new Map()

function subscribeStore(dk: string, listener: Function) {
  if (!listeners.has(dk)) {
    listeners.set(dk, [])
  }
  const ls = listeners.get(dk)!
  ls.push(listener)
  return () => {
    const idx = ls.indexOf(listener)
    if (idx !== -1) {
      ls.splice(idx, 1)
    } else {
      console.warn('listener not found')
    }
  }
}

function notifyStore(dk: string) {
  const ls = listeners.get(dk)
  if (ls) {
    ls.forEach(l => l())
  }
}

try {
  store = JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}')
} catch (e) {
  if (confirm('Failed to load store from localStorage, clear it?')) {
    localStorage.removeItem(STORE_KEY)
    store = {}
  } else {
    throw e
  }
}

function setDateData(dateKey: string, data: DateData[]) {
  store[dateKey] = data
  localStorage.setItem(STORE_KEY, JSON.stringify(store))
  notifyStore(dateKey)
}

const EMPTY = [] as unknown[]

export function useDateDataFromStore(date = new Date()) {
  const dk = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  const subscribeStoreWrap = useCallback((lis: Function) => subscribeStore(dk, lis), [dk])
  const dateData = useSyncExternalStore(subscribeStoreWrap, () => store[dk] ?? EMPTY)

  const [a, d] = useReducer((
    state: DateData[],
    action:
      | { type: 'set'; hour: number; data: DateData }
      | { type: 'upd'; data: DateData[] }
  ) => {
    const newState = [...state]
    switch (action.type) {
      case 'set':
        newState[action.hour] = action.data
        setDateData(dk, newState)
        return newState
      case 'upd':
        setDateData(dk, action.data)
        return action.data
    }
  }, dateData)
  useEffect(() => {
    d({ type: 'upd', data: dateData })
  }, [dateData])
  return [a, d] as const
}
