import { defineJSONHandler } from './utils/defineHandler.ts'

export default defineJSONHandler(function () {
  return { name: 'John Doe' }
})
