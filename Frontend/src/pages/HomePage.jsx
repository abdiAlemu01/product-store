// HomePage.jsx
import { useEffect, useState } from 'react'
import { useProductStore } from '../store/useProductStore'
import { 
  PackageIcon, 
  PlusCircleIcon, 
  SearchIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  TagIcon,
  FilterIcon 
} from "lucide-react";
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';

function HomePage() {
  const {products, loading, error, fetchProducts, resetForm} = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
  // Function to open modal with fresh form
  const handleAddProductClick = () => {
    resetForm(); // Clear previous form data
    document.getElementById("add_product_modal").showModal();
  };
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-low': return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high': return parseFloat(b.price) - parseFloat(a.price);
        case 'name': return a.name.localeCompare(b.name);
        case 'newest':
        default: return new Date(b.created_at) - new Date(a.created_at);
      }
    });
  
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              MANA GURGURTAA
            </h1>
            <p className="text-4xl md:text-6xl font-bold">
              MEESHALE MANA CHARE
            </p>
            <p className="text-lg max-w-2xl mx-auto opacity-80">
              Your trusted online shopping destination - Quality products at competitive prices
            </p>
            
            {/* Quick Features */}
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <TruckIcon className="size-5" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="size-5" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <TagIcon className="size-5" />
                <span>Best Prices</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {/* Search and Filter Bar */}
        <div className="bg-base-100 rounded-box shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Sort */}
            <div className="flex gap-2 items-center w-full md:w-auto">
              <FilterIcon className="size-5 text-base-content/70" />
              <select 
                className="select select-bordered w-full md:w-auto"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
            
            {/* Admin Add Button */}
            <button 
              className='btn btn-primary'
              onClick={handleAddProductClick}
            >
              <PlusCircleIcon className="size-5" />
              <span className="hidden md:inline ml-2">Add Product</span>
            </button>
          </div>
          
          {/* Results Count */}
          {searchTerm && (
            <div className="mt-3 text-sm text-base-content/70">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <AddProductModal/>

        {error && (
          <div className="alert alert-error mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="flex flex-col justify-center items-center py-20 space-y-6">
            <div className="bg-base-100 rounded-full p-8 shadow-lg">
              <PackageIcon className="size-16 text-primary" />
            </div>
            <div className="text-center space-y-3 max-w-md">
              <h3 className="text-3xl font-bold">
                {searchTerm ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-base-content/70 text-lg">
                {searchTerm 
                  ? `Try adjusting your search term "${searchTerm}"`
                  : 'Get started by adding your first product to the store'
                }
              </p>
              {searchTerm && (
                <button 
                  className="btn btn-outline"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center space-y-4">
              <div className="loading loading-spinner loading-lg text-primary" />
              <p className="text-base-content/70">Loading products...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            {filteredProducts.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    Our Products {products.length > 0 && `(${products.length})`}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Call to Action Section */}
        {products.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-box p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need Help Finding Something?</h3>
            <p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Contact our customer support team 
              or check out our services for bulk orders and special requests.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="btn btn-primary">
                Contact Us
              </a>
              <a href="/services" className="btn btn-outline">
                View Services
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Professional Business Footer */}
      <footer className="bg-gradient-to-br from-base-300 to-base-200 border-t-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-full p-3">
                  <PackageIcon className="size-6 text-primary-content" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">MANA GURGURTAA</h3>
                  <p className="text-sm font-semibold">MEESHALE MANA CHARE</p>
                </div>
              </div>
              <p className="text-sm text-base-content/70 leading-relaxed">
                Your trusted online shopping destination for quality household products, 
                electronics, and daily essentials at competitive prices.
              </p>
              <div className="flex gap-3">
                {/* TikTok */}
                <a 
                  href="https://www.tiktok.com/@manashoppingguide" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-sm btn-outline hover:btn-primary"
                  title="Follow us on TikTok"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                {/* Telegram */}
                <a 
                  href="https://t.me/manashoppingguide" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-sm btn-outline hover:btn-primary"
                  title="Join us on Telegram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <span className="text-primary">●</span>
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-xs">▸</span> Home
                  </a>
                </li>
                <li>
                  <a href="/shop" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-xs">▸</span> Shop
                  </a>
                </li>
                <li>
                  <a href="/categories" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-xs">▸</span> Categories
                  </a>
                </li>
                <li>
                  <a href="/deals" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-xs">▸</span> Deals
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-xs">▸</span> About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <span className="text-primary">●</span>
                Our Services
              </h4>
              <ul className="space-y-2">
                <li className="text-base-content/70 flex items-center gap-2">
                  <TruckIcon className="size-4 text-primary" />
                  Home Delivery
                </li>
                <li className="text-base-content/70 flex items-center gap-2">
                  <ShieldCheckIcon className="size-4 text-primary" />
                  Order Tracking
                </li>
                <li className="text-base-content/70 flex items-center gap-2">
                  <TagIcon className="size-4 text-primary" />
                  Bulk Orders
                </li>
                <li>
                  <a href="/services" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-xs">▸</span> View All Services
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <span className="text-primary">●</span>
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <p className="text-base-content/70 text-sm">09 11 22 33 44 55</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-sm">Location</p>
                    <p className="text-base-content/70 text-sm leading-relaxed">
                      Leman, Great Street Road<br/>
                      Around Agilgilot/Gomista Tagene
                    </p>
                  </div>
                </li>
                <li>
                  <a href="/contact" className="btn btn-primary btn-sm w-full">
                    Send Message
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-base-content/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-base-content/60 text-center md:text-left">
                © {new Date().getFullYear()} MANA GURGURTAA / MEESHALE MANA CHARE. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="/track-order" className="text-base-content/60 hover:text-primary transition-colors">
                  Track Order
                </a>
                <a href="/services" className="text-base-content/60 hover:text-primary transition-colors">
                  Services
                </a>
                <a href="/contact" className="text-base-content/60 hover:text-primary transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
