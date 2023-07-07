export function ymd(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function _notify(title: string, content?: string): void
function _notify(title: string, options?: NotificationOptions): void
function _notify(title: string, options?: NotificationOptions | string) {
  if (typeof options === 'string') {
    options = { body: options }
  }
  if (Notification.permission === 'granted') {
    new Notification(title, options)
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, options as NotificationOptions)
      }
    })
  }
}

export const notify = _notify
