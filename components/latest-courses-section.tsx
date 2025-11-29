import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const courses = [
  {
    id: 1,
    title: "Sanskrit Basics",
    description: "Learn the fundamentals of Sanskrit language and script",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Classical Dance",
    description: "Master traditional Bharatanatyam dance techniques",
    level: "All Levels",
  },
  {
    id: 3,
    title: "Vedic Chanting",
    description: "Explore the sacred art of Vedic recitation",
    level: "Intermediate",
  },
  {
    id: 4,
    title: "Indian Instruments",
    description: "Learn to play traditional Indian musical instruments",
    level: "Beginner",
  },
]

export function LatestCoursesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-bold text-red-900 mb-2 sm:mb-4 text-balance">
            Latest Courses
          </h2>
          <p className="text-sm xs:text-base sm:text-lg text-gray-700 max-w-2xl mx-auto text-balance">
            Discover our newest and most popular courses designed to help you master cultural arts
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100"
            >
              <div className="relative overflow-hidden h-32 xs:h-36 sm:h-40 lg:h-48 bg-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
                  <div className="text-2xl xs:text-3xl sm:text-4xl opacity-50">📚</div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                  <Play className="w-6 xs:w-8 sm:w-10 lg:w-12 h-6 xs:h-8 sm:h-10 lg:h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-red-900 text-sm xs:text-base sm:text-lg">{course.title}</h3>
                </div>
                <p className="text-gray-600 text-xs xs:text-sm mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                    {course.level}
                  </span>
                  <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white text-xs h-7 xs:h-8 px-2 xs:px-3">
                    Enroll
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
