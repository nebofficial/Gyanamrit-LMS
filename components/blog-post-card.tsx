"use client"

import Link from "next/link"
import { Share2, Eye } from "lucide-react"
import type { Post } from "@/lib/posts"

export function BlogPostCard({ post }: { post: Post }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url: `${location.origin}/blog/${post.slug}` })
      } catch (e) {
        // User cancelled or share failed, that's okay
      }
    } else {
      // Share API not available, so copy link to clipboard instead
      try {
        await navigator.clipboard.writeText(`${location.origin}/blog/${post.slug}`)
        // eslint-disable-next-line no-console
        console.debug("Link copied to clipboard")
      } catch (e) {
        // Clipboard access failed, that's okay
      }
    }
  }

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden border border-border">
      <Link href={`/blog/${post.slug}`} className="block">
        <img src={post.image} alt={post.title} className="w-full h-44 object-cover" />
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <time className="text-xs text-foreground/70">{new Date(post.date).toLocaleDateString()}</time>
          <div className="flex items-center gap-3 text-foreground/70 text-sm">
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {post.views}</span>
            <button onClick={handleShare} title="Share" className="p-1 rounded hover:bg-foreground/5">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-sm text-foreground/70 mb-4">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.map((t) => (
              <span key={t} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                {t}
              </span>
            ))}
          </div>
          <Link href={`/blog/${post.slug}`} className="text-accent hover:underline text-sm">
            More Learn
          </Link>
        </div>
      </div>
    </article>
  )
}
