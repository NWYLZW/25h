import './App.css'

import { GridFor25H } from './components/GridFor25H.tsx'
import { ThemeSwitcher } from './components/ThemeSwitcher.tsx'

export default function App() {
  return <>
    <h1>25H</h1>
    <GridFor25H />
    <ThemeSwitcher />
  </>
}
