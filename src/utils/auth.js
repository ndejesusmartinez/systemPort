export function getStoredAuth() {
  const rawAuth = localStorage.getItem("auth")

  if (!rawAuth) {
    return null
  }

  try {
    return JSON.parse(rawAuth)
  } catch {
    return null
  }
}

export function getStoredToken() {
  const explicitToken = localStorage.getItem("token")
  const auth = getStoredAuth()
  const token = explicitToken || auth?.token || auth?.access_token || null

  if (!token) {
    return null
  }

  if (isTokenExpired(token)) {
    clearAuthSession()
    return null
  }

  return token
}

export function isAuthenticated() {
  return Boolean(getStoredToken())
}

export function saveAuthSession(data) {
  localStorage.setItem("auth", JSON.stringify(data))

  const token = data?.token || data?.access_token

  if (token) {
    localStorage.setItem("token", token)
  }
}

export function clearAuthSession() {
  localStorage.removeItem("auth")
  localStorage.removeItem("token")
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") {
    return null
  }

  const parts = token.split(".")

  if (parts.length < 2) {
    return null
  }

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const normalized = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=")
    const decoded = atob(normalized)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token)
  const exp = payload?.exp

  if (typeof exp !== "number") {
    return false
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  return currentTimeInSeconds >= exp
}

export function getUserDisplayName() {
  const auth = getStoredAuth()

  const authCandidates = [
    auth?.user?.name,
    auth?.user?.fullName,
    auth?.user?.username,
    auth?.user?.email,
    auth?.name,
    auth?.fullName,
    auth?.username,
    auth?.email
  ]

  const authName = authCandidates.find((value) => typeof value === "string" && value.trim())

  if (authName) {
    return authName
  }

  const payload = decodeJwtPayload(getStoredToken())

  const tokenCandidates = [
    payload?.name,
    payload?.preferred_username,
    payload?.email,
    payload?.sub
  ]

  const tokenName = tokenCandidates.find((value) => typeof value === "string" && value.trim())

  return tokenName || "User"
}
