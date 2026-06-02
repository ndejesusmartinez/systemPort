const BASE_URL = "https://st9cmskim5.execute-api.us-east-1.amazonaws.com/dev"
import { toast } from "sonner"
import { clearAuthSession, getStoredToken } from "../utils/auth"

let isHandlingUnauthorized = false

function handleUnauthorizedSession() {
  if (isHandlingUnauthorized) {
    return
  }

  isHandlingUnauthorized = true
  clearAuthSession()
  toast.error("Session expired. Please sign in again.")
  redirectToLogin()
}

function redirectToLogin() {
  if (typeof window === "undefined") {
    return
  }

  if (window.location.pathname !== "/login") {
    window.location.replace("/login")
  }
}

async function parseJsonSafely(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function fetchJson(endpoint, options = {}, { redirectOnUnauthorized = true } = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, options)

  if (redirectOnUnauthorized && response.status === 401) {
    handleUnauthorizedSession()
  }

  return await parseJsonSafely(response)
}

function buildHeaders(withJson = false) {

  const token = getStoredToken()

  const headers = {}

  if (withJson) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

// export async function getContainers() {
//   const res = await fetch(`${BASE_URL}/containers`)
//   const data = await res.json()
//   return data
// }

export async function getContainers(filters = {}) {

  const query = new URLSearchParams()

  if (filters.status) {
    query.append("status", filters.status)
  }

  if (filters.type) {
    query.append("type", filters.type)
  }

  if (filters.move) {
    query.append("type_move", filters.move)
  }

  if (filters.dateFrom) {
    query.append("date_from", filters.dateFrom)
  }

  if (filters.dateTo) {
    query.append("date_to", filters.dateTo)
  }

  const queryString = query.toString()
  const endpoint = queryString ? `/containers?${queryString}` : "/containers"

  return await fetchJson(endpoint, {
    headers: buildHeaders()
  })
}

export async function createContainer(payload) {
  return await fetchJson("/containers", {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(payload)
  })
}


// ==========================
// UPLOAD PHOTO
// ==========================
export async function uploadPhoto(file, containerId) {

  const base64 = await toBase64(file)

  return await fetchJson("/containers/uploadPhotos", {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify({
      file: base64.split(",")[1],
      fileName: file.name,
      containerId
    })
  })
}

// ==========================
// BASE64 HELPER
// ==========================
function toBase64(file) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = reject
  })
}


export async function getDamages() {
  return await fetchJson("/containers/damage-catalog", {
    headers: buildHeaders()
  })
}

export async function login(email, password) {

  return await fetchJson("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  }, { redirectOnUnauthorized: false })
}