/// <reference types="vite/client" />

export declare global {
  const theme: 'light' | 'dark' | (string & {})
  function onThemeChange(fn: (t: typeof theme) => void)

  interface Window {
    theme: typeof theme
    onThemeChange: typeof onThemeChange
  }
}
