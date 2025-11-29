import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-red-900 to-red-950 text-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Decorative divider */}
        <div className="border-t border-amber-500 border-opacity-30 mb-12"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-amber-300 font-serif font-bold mb-4 text-lg">Classes</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Dance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Music
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Art & Craft
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-300 font-serif font-bold mb-4 text-lg">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-300 font-serif font-bold mb-4 text-lg">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-300 font-serif font-bold mb-4 text-lg">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-100 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-500 border-opacity-30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-amber-200 text-sm">Preserving Culture Through Digital Learning</p>
            <div className="text-amber-400 text-2xl mt-4 md:mt-0">☸</div>
            <p className="text-amber-200 text-sm mt-4 md:mt-0">&copy; 2025 Gyanamrit. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
