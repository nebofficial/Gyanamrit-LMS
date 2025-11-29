"use client"

import { useEffect } from "react"

export default function Analytics(): null {
  useEffect(() => {
    // Replace with your analytics provider (Plausible, GA, PostHog, etc.)
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.debug("Analytics stub: pageview", window.location?.pathname)
    }
  }, [])

  return null
}
