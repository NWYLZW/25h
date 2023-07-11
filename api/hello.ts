import { defineJSONHandler } from './utils/defineHandler'

export default defineJSONHandler(function () {
  return { name: 'John Doe' }
})
