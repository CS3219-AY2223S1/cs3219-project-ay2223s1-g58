import { Container } from './Container'
import { NavLinks } from './NavLinks'

export function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col items-start justify-between pt-16 pb-6 gap-y-12 lg:flex-row lg:items-center lg:py-16">
          <div>
            <div className="flex items-center text-gray-900 dark:text-gray-300">
              <div className="ml-4">
                <p className="text-base font-semibold">LeetWithFriend</p>
                <p className="mt-1 text-sm">
                  An interview preparation platform and peer matching system,
                  <br></br>
                  where students can find peers to practice whiteboard-style
                  interview questions together.
                </p>
              </div>
            </div>
            <nav className="hidden gap-8 mt-11 sm:flex">
              <NavLinks />
            </nav>
          </div>
        </div>
        <div className="flex flex-col items-center pt-8 pb-12 border-t border-gray-200 md:flex-row-reverse md:justify-between md:pt-6">
          <p className="mt-6 text-sm text-gray-500 md:mt-0">
            &copy; Copyright {new Date().getFullYear()} CS3219 Group 58. All
            rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
