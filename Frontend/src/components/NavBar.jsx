// NavBar.jsx
import { useEffect, useState } from 'react'
import { Link, useResolvedPath } from 'react-router-dom'
import { ShoppingBagIcon, MenuIcon, XIcon, LogInIcon, LogOutIcon, ShieldCheckIcon } from 'lucide-react'
import ThemeSelector from './ThemeSelector'
import { useProductStore } from '../store/useProductStore';
import { useAuthStore } from '../store/useAuthStore';
import AuthModal from './AuthModal';
import NotificationBell from './NotificationBell';

function NavBar() {
  const products = useProductStore(state => state.products);
  const { user, logout } = useAuthStore();
  const { pathname } = useResolvedPath()
  const isHomePage = pathname === '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Mana', path: '/' },
    { name: "Waay'ee keenya", path: '/about' },
    { name: 'Tajaajiloota', path: '/services' },
    { name: 'Nu Qunamuuf', path: '/contact' },
    { name: 'Meesha ajajachuuf', path: '/track-order' },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className='bg-base-100/95 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-50 shadow-sm'>
        <div className='max-w-7xl mx-auto'>
            <div className='navbar px-3 sm:px-4 py-2 sm:py-3 min-h-[4rem] sm:min-h-[5rem]'>

              {/* LOGO */}
              <div className="flex-none">
                <Link to="/" className="hover:opacity-80 transition-opacity" onClick={handleNavLinkClick}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img 
                      src="/aa.jpg" 
                      alt="Company Logo" 
                      className="size-10 sm:size-12 md:size-14 rounded-full object-cover shadow-md ring-2 ring-primary/20" 
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm sm:text-lg md:text-xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary truncate">
                        MANA GURGURTAA
                      </span>
                      <span className="hidden sm:block text-xs md:text-sm text-base-content/70 font-medium truncate">
                        MEESHALE MANA CHARU TESFAYE
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* NAVIGATION LINKS - Desktop */}
              <div className="flex-1 hidden lg:flex justify-center">
                <ul className="menu menu-horizontal px-1 gap-2">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link 
                        to={link.path}
                        className={`text-base font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                          pathname === link.path 
                            ? 'bg-primary text-primary-content shadow-md' 
                            : 'hover:bg-primary/10 hover:text-primary'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* MOBILE MENU */}
              <div className="flex-1 lg:hidden flex justify-end relative">
                <button
                  type="button"
                  className="btn btn-ghost btn-square"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
                </button>

                {mobileMenuOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                      aria-label="Close menu"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <ul className="absolute right-0 top-full z-50 menu p-3 shadow-xl bg-base-100 rounded-box w-64 mt-2 border border-base-300">
                      {navLinks.map((link) => (
                        <li key={link.path}>
                          <Link 
                            to={link.path}
                            onClick={handleNavLinkClick}
                            className={`text-base font-semibold py-3 rounded-lg ${
                              pathname === link.path ? 'bg-primary text-primary-content' : ''
                            }`}
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* RIGHT SECTION */}
              <div className="flex-none flex items-center gap-1.5 sm:gap-3">
                <NotificationBell />
                <ThemeSelector />
                {user ? (
                  <div className="flex items-center gap-2 rounded-full border border-base-300 px-3 py-2 bg-base-100">
                    <ShieldCheckIcon className="size-4 text-primary" />
                    <div className="text-sm leading-tight hidden sm:block">
                      <div className="font-semibold">{user.full_name}</div>
                      <div className="text-base-content/60 capitalize">{user.role}</div>
                    </div>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={logout}>
                      <LogOutIcon className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm px-2 sm:px-3"
                    onClick={() => document.getElementById("auth_modal")?.showModal()}
                  >
                    <LogInIcon className="size-4" />
                    <span className="hidden sm:inline">SEENA</span>
                  </button>
                )}
                {isHomePage && (
                  <Link to="/" className="indicator" onClick={handleNavLinkClick}>
                    <div className="btn btn-ghost btn-circle hover:bg-primary/10">
                      <ShoppingBagIcon className="size-6" />
                      <span className="badge badge-sm badge-primary indicator-item font-bold">
                        {products?.length} 
                      </span>
                    </div>
                  </Link>
                )}
              </div>

            </div>
        </div>
        <AuthModal />
    </div>
  )
}

export default NavBar
