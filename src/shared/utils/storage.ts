export function setStorage(key: string, value: string) {
  return localStorage.setItem(key, value)
}

export function getStorage(key: string) {
  return localStorage.getItem(key)
}

export function removeStorage(key: string) {
  localStorage.removeItem(key)
}

export function clearStorage() {
  localStorage.clear()
}

export function setSessionStorage(key: string, value: string) {
  sessionStorage.setItem(key, value)
}

export function getSessionStorage(key: string) {
  return sessionStorage.getItem(key)
}

export function removeSessionStorage(key: string) {
  sessionStorage.removeItem(key)
}

export function clearSessionStorage() {
  sessionStorage.clear()
}
