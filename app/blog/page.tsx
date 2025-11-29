"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { TopContactBar } from "@/components/top-contact-bar"
import { Footer } from "@/components/footer"
import { BlogPostCard } from "@/components/blog-post-card"
import { BlogSearchFilter } from "@/components/blog-search-filter"
import { POSTS } from "@/lib/posts"

export default function BlogPage() {
  const [filtered, setFiltered] = useState(POSTS)

  return (
    <main className="min-h-screen bg-background">
      <TopContactBar />
      <Navbar />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Gyanamrit Blog</h1>
            <p className="text-foreground/70">Articles, learning guides and cultural insights</p>
          </div>

          <BlogSearchFilter posts={POSTS} onFiltered={(p) => setFiltered(p)} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
