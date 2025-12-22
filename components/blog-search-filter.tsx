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
    <div className="mb-6 space-y-4">
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        />
        <select
          value={activeTag ?? ""}
          onChange={(e) => onTagClick(e.target.value || "")}
          className="w-full sm:w-auto sm:min-w-[180px] px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        >
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Tag Buttons */}
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap overflow-x-auto pb-2 scroll-smooth">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => onTagClick(t)}
              className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap flex-shrink-0 transition-all ${
                activeTag === t
                  ? "bg-accent text-white shadow-sm"
                  : "bg-accent/10 text-accent hover:bg-accent/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
