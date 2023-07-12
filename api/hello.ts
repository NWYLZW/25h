import { defineJSONHandler } from '#svr/utils/defineHandler'

export default defineJSONHandler(function () {
  return { name: 'John Doe' }
})
