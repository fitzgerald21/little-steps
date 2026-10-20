import { useCallback, useEffect, useState } from 'react'
import type { AppState, Child } from './types'

const KEY = 'little-steps:v1'

const EMPTY: AppState = { version: 1, children: [], activeChildId: null }

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as AppState
    if (parsed?.version !== 1 || !Array.isArray(parsed.children)) return EMPTY
    return parsed
  } catch {
    return EMPTY
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked (private mode). The app keeps working in memory.
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => saveState(state), [state])

  // Ask the browser not to evict our data under storage pressure.
  useEffect(() => {
    navigator.storage?.persist?.().catch(() => {})
  }, [])

  const activeChild = state.children.find((c) => c.id === state.activeChildId) ?? state.children[0] ?? null

  const updateChild = useCallback((id: string, fn: (c: Child) => Child) => {
    setState((s) => ({ ...s, children: s.children.map((c) => (c.id === id ? fn(c) : c)) }))
  }, [])

  const addChild = useCallback((child: Child) => {
    setState((s) => ({ ...s, children: [...s.children, child], activeChildId: child.id }))
  }, [])

  const removeChild = useCallback((id: string) => {
    setState((s) => {
      const children = s.children.filter((c) => c.id !== id)
      return { ...s, children, activeChildId: children[0]?.id ?? null }
    })
  }, [])

  const setActive = useCallback((id: string) => setState((s) => ({ ...s, activeChildId: id })), [])

  const replaceAll = useCallback((next: AppState) => setState(next), [])

  return { state, activeChild, updateChild, addChild, removeChild, setActive, replaceAll }
}

export function isValidState(x: unknown): x is AppState {
  const s = x as AppState
  return !!s && s.version === 1 && Array.isArray(s.children) && s.children.every((c) => c.id && c.birthday && c.name)
}
