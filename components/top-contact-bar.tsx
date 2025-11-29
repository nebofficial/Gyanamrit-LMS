import { Phone, Mail, MapPin } from "lucide-react"

export function TopContactBar() {
  return (
    <div className="bg-red-950 text-amber-100 text-xs sm:text-sm hidden xs:block">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-4">
          <div className="flex flex-col gap-1 xs:flex-row xs:gap-4">
            <div className="flex items-center gap-1">
              <Phone className="w-3 xs:w-4 h-3 xs:h-4" />
              <span className="truncate">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-3 xs:w-4 h-3 xs:h-4" />
              <span className="truncate">contact@gyanamrit.com</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 xs:w-4 h-3 xs:h-4" />
            <span>Available Worldwide</span>
          </div>
        </div>
      </div>
    </div>
  )
}
