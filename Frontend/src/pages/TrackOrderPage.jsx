import {
  PackageSearchIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCommerceStore } from "../store/useCommerceStore";
import ProductCard from "../components/ProductCard";

function TrackOrderPage() {
  const { products, fetchProducts, loading } = useProductStore();
  const { user, registerCustomer, loginWithPhone, loading: authLoading } = useAuthStore();
  const { orders, fetchOrders, placeOrder, placingOrder, loadingOrders } = useCommerceStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (user?.role === "customer") {
      fetchOrders();
    }
  }, [fetchOrders, user]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openOrderForm = (product) => {
    setSelectedProduct(product);
  };

  const closeOrderForm = () => {
    setSelectedProduct(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerCustomer(registerForm);
    setRegisterForm({
      fullName: "",
      phoneNumber: "",
      password: "",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginWithPhone(loginPhone, loginPassword);
    setLoginPhone("");
    setLoginPassword("");
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    await placeOrder({
      productId: selectedProduct.id,
      quantity: 1,
    });
    closeOrderForm();
  };

  const isCustomer = user?.role === "customer";

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="card bg-base-100 shadow-lg border border-base-300/60">
          <div className="card-body p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                  <ShoppingBagIcon className="size-8 text-primary" />
                  Customer Order Area
                </h1>
                <p className="text-base-content/70 mt-2">
                  Register or sign in with your phone number, then place orders clearly.
                </p>
              </div>

              <div className="relative w-full lg:w-80">
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

        {!isCustomer && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-lg border border-base-300/60">
              <div className="card-body">
                <h2 className="card-title text-2xl">
                  <UserIcon className="size-6 text-primary" />
                  Register Customer
                </h2>
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Full name"
                    value={registerForm.fullName}
                    onChange={(e) =>
                      setRegisterForm((currentForm) => ({
                        ...currentForm,
                        fullName: e.target.value,
                      }))
                    }
                    required
                  />
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    placeholder="Phone number"
                    value={registerForm.phoneNumber}
                    onChange={(e) =>
                      setRegisterForm((currentForm) => ({
                        ...currentForm,
                        phoneNumber: e.target.value,
                      }))
                    }
                    required
                  />
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Password"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm((currentForm) => ({
                        ...currentForm,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                  <button type="submit" className="btn btn-primary w-full" disabled={authLoading}>
                    Register Customer
                  </button>
                </form>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300/60">
              <div className="card-body">
                <h2 className="card-title text-2xl">
                  <PackageSearchIcon className="size-6 text-secondary" />
                  Sign In With Phone
                </h2>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    placeholder="Phone number"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-secondary w-full" disabled={authLoading}>
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {isCustomer && (
          <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
            <div className="card bg-base-100 shadow-lg border border-base-300/60 h-fit">
              <div className="card-body">
                <h2 className="card-title text-2xl">Customer Profile</h2>
                <div className="space-y-3 mt-2">
                  <div className="rounded-2xl bg-base-200 px-4 py-3">
                    <p className="text-sm text-base-content/60">Full Name</p>
                    <p className="font-semibold">{user.full_name}</p>
                  </div>
                  <div className="rounded-2xl bg-base-200 px-4 py-3">
                    <p className="text-sm text-base-content/60">Phone Number</p>
                    <p className="font-semibold">{user.phone_number}</p>
                  </div>
                  <div className="rounded-2xl bg-base-200 px-4 py-3">
                    <p className="text-sm text-base-content/60">Role</p>
                    <p className="font-semibold capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300/60">
              <div className="card-body">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="card-title text-2xl">My Orders</h2>
                  <div className="badge badge-primary">{orders.length}</div>
                </div>

                {loadingOrders ? (
                  <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3 mt-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-base-300 bg-base-100 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{order.product_name}</p>
                            <p className="text-sm text-base-content/60">
                              Quantity: {order.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="badge badge-success">{order.status}</div>
                            <p className="text-sm text-base-content/70 mt-2">
                              ${Number(order.total_amount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base-content/60 mt-3">
                    You have not placed any orders yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16 bg-base-100 rounded-3xl shadow-lg border border-base-300/60">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                Ordering: <span className="font-semibold">{selectedProduct.name}</span>{" "}
                {!isCustomer && "(Sign in as customer first)"}
              </p>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={user?.full_name || ""}
                    readOnly
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    value={user?.phone_number || ""}
                    readOnly
                  />
                </div>

                <div className="modal-action">
                  <button type="button" className="btn btn-ghost" onClick={closeOrderForm}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isCustomer || placingOrder}
                  >
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
