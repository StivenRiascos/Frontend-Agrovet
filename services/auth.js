// services/auth.js
export async function loginUser(username, password) {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Error al iniciar sesión')
  }

  return response.json() // { access_token: '...' }
}
