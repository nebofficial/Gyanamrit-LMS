import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lightbulb, BookOpen, PenTool, Zap, Trophy } from "lucide-react"

const games = [
  {
    title: "Grammar Quest",
    icon: BookOpen,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Vocab Challenge",
    icon: Lightbulb,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Story Builder",
    icon: PenTool,
    color: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    title: "Speed Round",
    icon: Zap,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Achievement Hub",
    icon: Trophy,
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
]

export function GamesSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Explore Our Learning Games</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Dive into interactive games designed to make learning engaging and fun for all age groups
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {games.map((game, index) => {
            const Icon = game.icon
            return (
              <Card
                key={index}
                className="flex flex-col items-center justify-center p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className={`w-24 h-24 ${game.color} rounded-full flex items-center justify-center mb-4`}>
                  <Icon className={`w-10 h-10 ${game.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-4">{game.title}</h3>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full">Play</Button>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
