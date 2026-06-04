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
    <div className='bg-base-100/95 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-50 shadow-sm'>
        <div className='max-w-7xl mx-auto'>
            <div className='navbar px-4 py-3 min-h-[5rem]'>

              {/* LOGO */}
              <div className="flex-none">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/aa.jpg" 
                      alt="Company Logo" 
                      className="size-14 rounded-full object-cover shadow-md ring-2 ring-primary/20" 
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-lg md:text-xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        MANA GURGURTAA
                      </span>
                      <span className="text-xs md:text-sm text-base-content/70 font-medium">
                        MEESHALE MANA CHARE
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

              {/* MOBILE MENU BUTTON */}
              <div className="flex-1 lg:hidden flex justify-end">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-square">
                    <MenuIcon className="size-6" />
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-3 shadow-xl bg-base-100 rounded-box w-64 mt-4 border border-base-300">
                    {navLinks.map((link) => (
                      <li key={link.path}>
                        <Link 
                          to={link.path}
                          className={`text-base font-semibold py-3 rounded-lg ${
                            pathname === link.path ? 'bg-primary text-primary-content' : ''
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
              <div className="flex-none flex items-center gap-3">
                <ThemeSelector />
                {isHomePage && (
                  <Link to="/" className="indicator">
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
    </div>
  )
}

export default NavBar
