"use client"

import { useMemo, useState } from "react"
import type { Post } from "@/lib/posts"

export function BlogSearchFilter({ posts, onFiltered }: { posts: Post[]; onFiltered: (p: Post[]) => void }) {
  const [query, setQuery] = useState("")
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const tags = useMemo(() => {
    const s = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => s.add(t)))
    return Array.from(s)
  }, [posts])

  const runFilter = (q: string, tag: string | null) => {
    const qlc = q.trim().toLowerCase()
    let filtered = posts
    if (qlc) filtered = filtered.filter((p) => p.title.toLowerCase().includes(qlc) || p.excerpt.toLowerCase().includes(qlc))
    if (tag) filtered = filtered.filter((p) => p.tags.includes(tag))
    onFiltered(filtered)
  }

  const onQueryChange = (v: string) => {
    setQuery(v)
    runFilter(v, activeTag)
  }

  const onTagClick = (t: string) => {
    const next = activeTag === t ? null : t
    setActiveTag(next)
    runFilter(query, next)
  }

  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <select
          value={activeTag ?? ""}
          onChange={(e) => onTagClick(e.target.value || "")}
          className="px-3 py-2 border border-border rounded-lg bg-white"
        >
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => onTagClick(t)}
            className={`px-3 py-1 text-sm rounded ${activeTag === t ? "bg-accent text-white" : "bg-accent/10 text-accent"}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
