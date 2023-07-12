import { defineJSONHandler } from '#svr/utils/defineHandler.js'

export default defineJSONHandler(function () {
  return { name: 'John Doe' }
})
