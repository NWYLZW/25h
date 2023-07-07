import { useEffect, useReducer } from 'react'

interface Store {
  [DateKey: string]: { content: string }[]
}

export let store: Store

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
}

export function useDateData(date = new Date()) {
  const dk = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

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
  }, store[dk] ?? [])
  useEffect(() => {
    d({ type: 'upd', data: store[dk] ?? [] })
  }, [dk])
  return [a, d] as const
}
