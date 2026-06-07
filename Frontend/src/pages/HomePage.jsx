// HomePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackageIcon,
  PlusCircleIcon,
  SearchIcon,
  TruckIcon,
  ShieldCheckIcon,
  TagIcon,
  FilterIcon,
  AlertCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import AdminDashboard from "../components/AdminDashboard";
import Footer from "../components/Footer";

function HomePage() {
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts, resetForm } = useProductStore();
  const user = useAuthStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProductClick = () => {
    resetForm();
    document.getElementById("add_product_modal").showModal();
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  const ProductSkeleton = () => (
    <div className="card bg-base-100 shadow-lg border border-base-300/50 overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-base-300" />
      <div className="card-body p-4 space-y-3">
        <div className="h-4 bg-base-300 rounded w-4/5" />
        <div className="h-4 bg-base-300 rounded w-2/5" />
        <div className="h-9 bg-base-300 rounded w-full mt-2" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 md:py-16">
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
              MANA GURGURTAA
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium opacity-90 text-balance max-w-2xl mx-auto">
              MEESHALEE MANA CHARU TESFAYE
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm md:text-base bg-primary-content/10 rounded-lg px-3 py-2 sm:bg-transparent sm:px-0 sm:py-0">
                <TruckIcon className="size-4 sm:size-5 shrink-0" />
                <span className="text-balance">Dhiyeesi safisan kenina</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm md:text-base bg-primary-content/10 rounded-lg px-3 py-2 sm:bg-transparent sm:px-0 sm:py-0">
                <ShieldCheckIcon className="size-4 sm:size-5 shrink-0" />
                <span className="text-balance">Itti gaafatamuummaan isaa kan mirkana&apos;ee</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm md:text-base bg-primary-content/10 rounded-lg px-3 py-2 sm:bg-transparent sm:px-0 sm:py-0">
                <TagIcon className="size-4 sm:size-5 shrink-0" />
                <span className="text-balance">Oomisha keenya gara weebsite, Tiktok, Telegram fi Message ni beeksisna</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {isAdmin && <AdminDashboard />}

        <div className="bg-base-100 rounded-box shadow-lg p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-base-content/50 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Meesha barbaaduf..."
                  className="input input-bordered w-full pl-9 sm:pl-10 text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search products"
                />
              </div>
            </div>

            <div className="flex gap-2 items-center w-full md:w-auto">
              <FilterIcon className="size-4 sm:size-5 text-base-content/70 shrink-0" aria-hidden="true" />
              <select
                className="select select-bordered w-full md:w-auto text-sm sm:text-base"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            {isAdmin && (
              <button className="btn btn-primary w-full md:w-auto" onClick={handleAddProductClick}>
                <PlusCircleIcon className="size-5" />
                <span className="ml-2">Add Product</span>
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="mt-3 text-sm text-base-content/70">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {isAdmin && <AddProductModal />}

        {error && (
          <div
            role="alert"
            className="alert alert-error shadow-md mb-6 sm:mb-8 flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <AlertCircleIcon className="size-5 sm:size-6 shrink-0" aria-hidden="true" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm sm:text-base">We couldn&apos;t load the products</p>
              <p className="text-sm opacity-90 mt-0.5">{error}</p>
              <p className="text-xs opacity-75 mt-1">Please check your internet connection and try again.</p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline gap-2 w-full sm:w-auto shrink-0"
              onClick={() => fetchProducts()}
              disabled={loading}
            >
              <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Try Again
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="flex flex-col justify-center items-center py-12 sm:py-20 space-y-4 sm:space-y-6 px-4">
            <div className="bg-base-100 rounded-full p-6 sm:p-8 shadow-lg">
              <PackageIcon className="size-12 sm:size-16 text-primary" />
            </div>
            <div className="text-center space-y-2 sm:space-y-3 max-w-md">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {searchTerm ? "No products found" : "No products yet"}
              </h3>
              <p className="text-base-content/70 text-sm sm:text-base md:text-lg">
                {searchTerm
                  ? `Try adjusting your search term "${searchTerm}"`
                  : isAdmin
                    ? "Add the first product as admin to start the store."
                    : "Products will appear here after admin adds them."}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="loading loading-spinner loading-md text-primary" />
              <p className="text-base-content/70 text-sm sm:text-base">Loading products...</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : (
          filteredProducts.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                  Our Products {products.length > 0 && `(${products.length})`}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={isAdmin}
                    priority={index < 4}
                    onOrderClick={() => navigate("/track-order")}
                  />
                ))}
              </div>
            </>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
