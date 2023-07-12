import { defineJSONHandler } from './utils/_defineHandler.ts'

export default defineJSONHandler(function () {
  return { name: 'John Doe' }
})
