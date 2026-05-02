export async function fetchWithAuth(url: string): Promise<Response> {
  let response = await fetch(url)

  if (response.status === 401) {
    // try to refresh token
    const refreshRes = await fetch('/api/auth/refresh')
    if (refreshRes.ok) {
      // retry original request
      response = await fetch(url)
    } else {
      // refresh failed, redirect to login
      window.location.href = '/'
    }
  }

  return response
}
