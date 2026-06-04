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
    </div>
  )
}

export default HomePage
