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
           <div className="space-y-4 text-center">
 <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-white">
  MANA GURGURTAA
  <br />
  <span className="text-white/80 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
    MEESHALEE MANA CHARU TESFAYE
  </span>
</h1>

  <div className="flex items-center justify-center gap-3">
    <div className="h-px w-10 sm:w-16 bg-primary/40"></div>

    
    <div className="h-px w-10 sm:w-16 bg-primary/40"></div>
    </div>
    </div>




          

          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4 pt-6">

  <div className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
    <div className="flex items-center justify-center size-10 rounded-full bg-white/10">
      <TruckIcon className="size-5 text-white" />
    </div>
    <span className="font-medium text-sm md:text-base text-white">
      Dhiyeessa Safisan kenina
    </span>
  </div>

  <div className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
    <div className="flex items-center justify-center size-10 rounded-full bg-white/10">
      <ShieldCheckIcon className="size-5 text-white" />
    </div>
    <span className="font-medium text-sm md:text-base text-white">
      Amanamummaan kan Mirkanaa'e
    </span>
  </div>

  <div className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
    <div className="flex items-center justify-center size-10 rounded-full bg-white/10">
      <TagIcon className="size-5 text-white" />
    </div>
    <span className="font-medium text-sm md:text-base text-white">
      Meehhalee keenya Website, TikTok fi Telegram irrati isin beeksisna
    </span>
  </div>

</div>




            
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {isAdmin && <AdminDashboard />}

        <div className="bg-base-100 rounded-box shadow-lg p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center">

            {isAdmin && (
              <button className="btn btn-primary w-full md:w-auto" onClick={handleAddProductClick}>
                <PlusCircleIcon className="size-5" />
                <span className="ml-2">meeshalee it dabali</span>
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="mt-3 text-sm text-base-content/70">
              meeshalee {filteredProducts.length} ergaman{filteredProducts.length !== 1 ? "s" : ""}
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
              <p className="font-semibold text-sm sm:text-base">Meeshaleen isiniif mul'achuu yoo didan</p>
              <p className="text-sm opacity-90 mt-0.5">{error}</p>
              <p className="text-xs opacity-75 mt-1">netwoorki keessan mirkaaneefadhati irra deebi'a yaala.</p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline gap-2 w-full sm:w-auto shrink-0"
              onClick={() => fetchProducts()}
              disabled={loading}
            >
              <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
              irra deebi'a yaala
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
              <p className="text-base-content/70 text-sm sm:text-base">meeshan mul'achuuuf jira...</p>
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
              {/* <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                  Meeshalee keenya mana daldala charu keessati argatan {products.length > 0 && `(${products.length})`}
                </h2>
              </div> */}

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
