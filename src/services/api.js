const BASE_URL = "https://st9cmskim5.execute-api.us-east-1.amazonaws.com/dev"

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

  const res = await fetch(
    `${BASE_URL}/containers?${query.toString()}`
  )

  return await res.json()
}

export async function createContainer(payload) {
  const res = await fetch(`${BASE_URL}/containers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
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
    headers: {
      "Content-Type": "application/json"
    },
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
  const res = await fetch(`${BASE_URL}/containers/damage-catalog`)
  const data = await res.json()
  return data
}