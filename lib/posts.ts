export type Post = {
  id: string
  title: string
  slug: string
  date: string
  image: string
  excerpt: string
  tags: string[]
  views: number
}

  
export const POSTS: Post[] = [
  {
    id: "1",
    title: "Introduction to Sanskrit: A Beginner's Guide",
    slug: "introduction-to-sanskrit",
    date: "2025-06-12",
    image: "https://img.jagranjosh.com/images/2023/August/3182023/sanskrit-diwas-2023.webp",
    excerpt: "Start your journey into Sanskrit with this approachable introduction covering script, pronunciation and basics.",
    tags: ["Sanskrit", "Beginner"],
    views: 1240,
  },
  {
    id: "2",
    title: "Traditional Indian Music: Foundations and Practice",
    slug: "traditional-indian-music",
    date: "2025-08-01",
    image:   "https://www.tnpscthervupettagam.com/assets/home/media/general/original_image/26-850.jpg",

    excerpt: "Learn the basic scales, rhythm cycles, and practice tips to begin your musical training.",
    tags: ["Music", "Practice"],
    views: 830,
  },
  {
    id: "3",
    title: "The Beauty of Devanagari: Script and Calligraphy",
    slug: "devanagari-script-calligraphy",
    date: "2025-09-20",
    image:   "https://www.oliveboard.in/blog/wp-content/uploads/2024/01/World-Sanskrit-Day-2024-19th-August-Theme-History.webp",

    excerpt: "A short guide to reading and writing Devanagari with tips to practice calligraphic forms.",
    tags: ["Sanskrit", "Script", "Art"],
    views: 452,
  },
]
