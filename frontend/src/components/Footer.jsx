import { Link } from 'react-router-dom'
import { Container } from './Container'
import { Logo } from './Logo'
import { NavLinks } from './NavLinks'

export function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col items-start justify-between pt-16 pb-6 gap-y-12 lg:flex-row lg:items-center lg:py-16">
          <div>
            <div className="flex items-center text-gray-900">
              <div className="ml-4">
                <p className="text-base font-semibold">PeerPrep</p>
                <p className="mt-1 text-sm">Prepare with your peers</p>
              </div>
            </div>
            <nav className="flex gap-8 mt-11">
              <NavLinks />
            </nav>
          </div>
          <div className="relative flex items-center self-stretch p-4 -mx-4 transition-colors group hover:bg-gray-100 sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
            <div className="relative flex items-center justify-center flex-none w-24 h-24">
              <Logo className="flex-none w-10 h-20 fill-cyan-500" />
            </div>
            <div className="ml-8 lg:w-64">
              <p className="text-base font-semibold text-gray-900">
                <Link to="#">
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  Login now
                </Link>
              </p>
              <p className="mt-1 text-sm text-gray-700">
                This is the best way to prepare for interviews
              </p>
            </div>
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
