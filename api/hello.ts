import { defineJSONHandler } from './utils/_defineHandler'

export default defineJSONHandler(function () {
  return { name: 'John Doe' }
})
