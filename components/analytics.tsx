"use client"

import { useEffect } from "react"

export default function Analytics(): null {
  useEffect(() => {
    // Lightweight local analytics stub.
    // Replace this with your preferred analytics provider (e.g., Plausible, GA, PostHog)
    // without changing UI or app behavior.
    if (typeof window !== "undefined") {
      // Log pageview in dev for visibility
      // In production you can wire this to a real provider.
      // eslint-disable-next-line no-console
      console.debug("Analytics stub: pageview", window.location?.pathname)
    }
  }, [])

  return null
}
