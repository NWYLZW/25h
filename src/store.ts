import { useReducer } from 'react'

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

export function getNowData() {
  const now = new Date()
  const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  return store[dateKey] ?? []
}

export function useNowData() {
  return useReducer((state: { content: string }[], action: { type: 'set'; hour: number; data: { content: string } }) => {
    const { hour, data } = action
    const newState = [...state]
    newState[hour] = data
    setGridData(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`, newState)
    return newState
  }, getNowData())
}
