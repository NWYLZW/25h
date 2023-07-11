import { defineJSONHandler } from '../svr/utils/defineHandler.ts'

export default defineJSONHandler(function () {
  return { name: 'John Doe' }
})
