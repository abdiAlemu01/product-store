import { PackageSearchIcon, TruckIcon, ShoppingBagIcon, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

function TrackOrderPage() {
  const [trackingResult, setTrackingResult] = useState(null);
  const { products, fetchProducts, loading } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    fullName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openOrderForm = (product) => {
    setSelectedProduct(product);
    setCustomerForm({
      fullName: "",
      phoneNumber: "",
    });
  };

  const closeOrderForm = () => {
    setSelectedProduct(null);
    setCustomerForm({
      fullName: "",
      phoneNumber: "",
    });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!customerForm.fullName.trim() || !customerForm.phoneNumber.trim()) {
      toast.error("Please enter full name and phone number.");
      return;
    }

    toast.success(
      `Order placed for ${selectedProduct.name}. Customer: ${customerForm.fullName}`
    );
    closeOrderForm();
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-8 items-start">
          {/* Left Column: Tracking */}
          

          {/* Right Column: Order New Products */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-lg border border-base-300/60">
              <div className="card-body p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                      <ShoppingBagIcon className="size-8 text-secondary" />
                      Order Any Product
                    </h2>
                    <p className="text-base-content/70">
                      Browse available products and place a new order quickly.
                    </p>
                  </div>

                  <div className="relative w-full md:w-72">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="input input-bordered w-full pl-9"
                    value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16 bg-base-100 rounded-3xl shadow-lg border border-base-300/60">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={false}
                    onOrderClick={openOrderForm}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-base-100 rounded-box border-2 border-dashed border-base-300">
                <p className="text-base-content/50">No products found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-12 text-sm text-base-content/60">
          <p>
            Need help? Contact our{" "}
            <a href="/contact" className="link link-primary">
              customer support
            </a>
          </p>
        </div>

        {selectedProduct && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-2xl mb-2">Complete Your Order</h3>
              <p className="text-sm text-base-content/70 mb-6">
                Ordering: <span className="font-semibold">{selectedProduct.name}</span>
              </p>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Enter customer full name"
                    value={customerForm.fullName}
                    onChange={(e) =>
                      setCustomerForm((currentForm) => ({
                        ...currentForm,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    placeholder="Enter phone number"
                    value={customerForm.phoneNumber}
                    onChange={(e) =>
                      setCustomerForm((currentForm) => ({
                        ...currentForm,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="modal-action">
                  <button type="button" className="btn btn-ghost" onClick={closeOrderForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirm Order
                  </button>
                </div>
              </form>
            </div>
            <button
              className="modal-backdrop"
              type="button"
              aria-label="Close order form"
              onClick={closeOrderForm}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrderPage;
