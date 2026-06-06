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

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center space-y-4">
            <h1 className="text-12xl md:text-6xl font-bold">MANA GURGURTAA</h1>
            <p className="text-8xl md:text-6xl font-bold">MEESHALEE MANA CHARU TESFAYE</p>
            
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <div className="flex items-center gap-2 text-size-29">
                <TruckIcon className="size-20" />
                <span>Dhiyeesi safisan kenina</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="size-20" />
                <span>Itti gaafatamuummaan isaa kan mirkana'ee</span>
              </div>
              <div className="flex items-center gap-2 ">
                <TagIcon className="size-20" />
                <span>Oomisha keenya gara weebsite, Tiktok, Telegram fi Message ni beeksisna</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin && <AdminDashboard />}

        <div className="bg-base-100 rounded-box shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="reative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Meesha barbaaduf..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

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

            {isAdmin && (
              <button className="btn btn-primary" onClick={handleAddProductClick}>
                <PlusCircleIcon className="size-5" />
                <span className="hidden md:inline ml-2">Add Product</span>
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
          <div className="alert alert-error mb-8">
            <span>{error}</span>
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="flex flex-col justify-center items-center py-20 space-y-6">
            <div className="bg-base-100 rounded-full p-8 shadow-lg">
              <PackageIcon className="size-16 text-primary" />
            </div>
            <div className="text-center space-y-3 max-w-md">
              <h3 className="text-3xl font-bold">
                {searchTerm ? "No products found" : "No products yet"}
              </h3>
              <p className="text-base-content/70 text-lg">
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
          <div className="flex justify-center items-center py-20">
            <div className="text-center space-y-4">
              <div className="loading loading-spinner loading-lg text-primary" />
              <p className="text-base-content/70">Loading products...</p>
            </div>
          </div>
        ) : (
          filteredProducts.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Our Products {products.length > 0 && `(${products.length})`}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={isAdmin}
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
