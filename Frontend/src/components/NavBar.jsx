// NavBar.jsx
import { Link, useResolvedPath } from 'react-router-dom'
import { ShoppingBagIcon, MenuIcon } from 'lucide-react'
import ThemeSelector   from './ThemeSelector'
import { useProductStore } from '../store/useProductStore';


function NavBar() {
  const products = useProductStore(state => state.products);
  const {pathname}=useResolvedPath()
  const isHomePage=pathname==='/'

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Track Order', path: '/track-order' },
  ];

  return (
    <div className='bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto'>
            <div className='navbar px-4 min-h-[4rem]'>

              {/* LOGO */}
              <div className="flex-none">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-3">
                    {/* Your Logo Image */}
                    <img 
                      src="/aa.jpg" 
                      alt="Company Logo" 
                      className="size-12 rounded-full object-cover shadow-md" 
                    />
                    <span className="font-semibold font-mono tracking-wide text-sm md:text-base lg:text-lg dark:text-purple-400 bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-green-300 whitespace-pre-line leading-tight">
                      {"MANA GURGURTAA\nMEESHALE MANA CHARE"}
                    </span>
                  </div>
                </Link>
              </div>

              {/* NAVIGATION LINKS - Desktop */}
              <div className="flex-1 hidden lg:flex justify-center">
                <ul className="menu menu-horizontal px-1 gap-1">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link 
                        to={link.path}
                        className={`font-medium transition-colors hover:text-primary ${
                          pathname === link.path ? 'text-primary' : ''
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* MOBILE MENU BUTTON */}
              <div className="flex-1 lg:hidden flex justify-end">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost">
                    <MenuIcon className="size-6" />
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-4 border border-base-300">
                    {navLinks.map((link) => (
                      <li key={link.path}>
                        <Link 
                          to={link.path}
                          className={`font-medium ${
                            pathname === link.path ? 'text-primary' : ''
                          }`}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="flex-none flex items-center gap-2 md:gap-4">
                <ThemeSelector />
                {isHomePage && (
                  <div className="indicator">
                    <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
                      <ShoppingBagIcon className="size-5" />
                      <span className="badge badge-sm badge-primary indicator-item">
                        {products?.length} 
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
        </div>
    </div>
  )
}

export default NavBar