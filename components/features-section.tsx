import { Card } from "@/components/ui/card"
import { Trophy, Zap, Star } from "lucide-react"

const features = [
  {
    title: "Learn with Gamification",
    description: "Turn learning into an adventure with points, levels, and achievements",
    icon: Trophy,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "AI-Personalized Learning",
    description: "Get a customized learning path based on your progress and learning style",
    icon: Zap,
    color: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    title: "Earn Rewards & Badges",
    description: "Unlock achievements and special rewards as you progress through your journey",
    icon: Star,
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
