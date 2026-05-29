const BASE_URL = "https://st9cmskim5.execute-api.us-east-1.amazonaws.com/dev"
import { getStoredToken } from "../utils/auth"

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

  const res = await fetch(
    `${BASE_URL}/containers?${query.toString()}`,
    {
      headers: buildHeaders()
    }
  )

  return await res.json()
}

export async function createContainer(payload) {
  const res = await fetch(`${BASE_URL}/containers`, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(payload)
  })

  const data = await res.json()
  return data
}


// ==========================
// UPLOAD PHOTO
// ==========================
export async function uploadPhoto(file, containerId) {

  const base64 = await toBase64(file)

  const res = await fetch(`${BASE_URL}/containers/uploadPhotos`, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify({
      file: base64.split(",")[1],
      fileName: file.name,
      containerId
    })
  })

  return await res.json()
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
  const res = await fetch(`${BASE_URL}/containers/damage-catalog`, {
    headers: buildHeaders()
  })
  const data = await res.json()
  return data
}

export async function login(email, password) {

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  return await res.json()
}