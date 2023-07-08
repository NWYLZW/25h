import { useCallback, useEffect, useReducer, useSyncExternalStore } from 'react'

interface Store {
  [DateKey: string]: { content: string }[]
}

export let store: Store

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
    ls.forEach(l => l(store[dk]))
  }
}

try {
  store = JSON.parse(localStorage.getItem('store') ?? '{}')
} catch (e) {
  if (confirm('Failed to load store from localStorage, clear it?')) {
    localStorage.clear()
    store = {}
  } else {
    throw e
  }
}

export function setGridData(dateKey: string, data: { content: string }[]) {
  store[dateKey] = data
  localStorage.setItem('store', JSON.stringify(store))
  notifyStore(dateKey)
}

export function useDateData(date = new Date()) {
  const dk = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  const subscribeStoreWrap = useCallback((lis: Function) => subscribeStore(dk, lis), [dk])
  const dateData = useSyncExternalStore(subscribeStoreWrap, () => store[dk] ?? [])

  const [a, d] = useReducer((
    state: { content: string }[],
    action:
      | { type: 'set'; hour: number; data: { content: string } }
      | { type: 'upd'; data: { content: string }[] }
  ) => {
    const newState = [...state]
    switch (action.type) {
      case 'set':
        newState[action.hour] = action.data
        setGridData(dk, newState)
        return newState
      case 'upd':
        setGridData(dk, action.data)
        return action.data
    }
  }, dateData)
  useEffect(() => {
    d({ type: 'upd', data: dateData })
  }, [dateData])
  return [a, d] as const
}
