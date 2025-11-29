type DecodedToken<T> = T & {
  exp?: number
  iat?: number
}

// JWT uses URL-safe base64, need to convert to standard base64
const decodeBase64 = (segment: string) => {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/')
  if (typeof window === 'undefined') {
    return Buffer.from(normalized, 'base64').toString('utf8')
  }

  const decoded = atob(normalized)
  // Handle UTF-8 encoding properly in browser
  return decodeURIComponent(
    decoded
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0).toString(16).padStart(2, '0')
        return `%${code}`
      })
      .join(''),
  )
}

export function decodeJwt<T>(token: string): DecodedToken<T> | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const payload = decodeBase64(parts[1])
    return JSON.parse(payload)
  } catch {
    return null
  }
}

