import { Popover } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from './Button'
import { Container } from './Container'
import { Logo } from './Logo'
import { NavLinks } from './NavLinks'
import { Link } from 'react-router-dom'
import useLogout from '../hooks/useLogout'
import useAuth from '../hooks/useAuth'
import { UserAvatar } from './UserAvatar'

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MobileNavLink({ children, ...props }) {
  return (
    <Popover.Button
      className="block text-base leading-7 tracking-tight text-gray-700"
      {...props}
    >
      {children}
    </Popover.Button>
  )
}

export function Header() {
  const logout = useLogout()
  const { auth } = useAuth()

  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-16">
            <Link to="/" aria-label="Home">
              <Logo className="w-auto h-10" />
            </Link>
            <div className="hidden lg:flex lg:gap-10">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <Popover.Button
                    className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }) =>
                      open ? (
                        <ChevronUpIcon className="w-6 h-6" />
                      ) : (
                        <MenuIcon className="w-6 h-6" />
                      )
                    }
                  </Popover.Button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <Popover.Overlay
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                        />
                        <Popover.Panel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 px-6 pt-32 pb-6 origin-top shadow-2xl rounded-b-2xl bg-gray-50 shadow-gray-900/20"
                        >
                          <div className="space-y-4">
                            <MobileNavLink href="/">Home</MobileNavLink>
                            <MobileNavLink href="/profile">
                              Profile
                            </MobileNavLink>
                            <MobileNavLink href="#reviews">Match</MobileNavLink>
                            <MobileNavLink href="#pricing">
                              Learning History
                            </MobileNavLink>
                            <MobileNavLink href="#faqs">
                              Question Bank
                            </MobileNavLink>
                          </div>
                          <div className="flex flex-col gap-4 mt-8">
                            {auth.isLoggedIn ? (
                              <Button variant="outline" onClick={logout}>
                                Logout
                              </Button>
                            ) : (
                              <>
                                <Button href="/login" variant="outline">
                                  Log in
                                </Button>
                                <Button href="/signup">Sign up</Button>
                              </>
                            )}
                          </div>
                        </Popover.Panel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
            {auth.isLoggedIn ? (
              <>
                <div className="hidden lg:block">
                  <UserAvatar username={auth.username} />
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="hidden lg:block"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  href="/login"
                  variant="outline"
                  className="hidden lg:block"
                >
                  Log in
                </Button>

                <Button href="/signup" className="hidden lg:block">
                  Sign up
                </Button>
              </>
            )}
          </div>
        </Container>
      </nav>
    </header>
  )
}
