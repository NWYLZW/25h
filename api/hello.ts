import { defineJSONHandler } from './utils/_defineHandler.js'

export default defineJSONHandler(function () {
  return { name: 'John Doe' }
})
