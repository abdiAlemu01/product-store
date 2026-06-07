import {
  PackageSearchIcon,
  SearchIcon,
  ShoppingBagIcon,
  Trash2Icon,
  UserIcon,
  ImageOffIcon,
  PlusCircleIcon,
  MessageCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCommerceStore } from "../store/useCommerceStore";
import { useNotificationStore } from "../store/useNotificationStore";
import ProductCard from "../components/ProductCard";
import OrderChat from "../components/OrderChat";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { resolveImageUrl } from "../lib/imageUrl";

function OrderThumbnail({ image, name, isCustom }) {
  const [hasError, setHasError] = useState(false);

  if (isCustom || !image || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-base-content/30 px-1">
        <ImageOffIcon className="size-6" />
        {isCustom && <span className="text-[9px] mt-1 text-center">Custom</span>}
      </div>
    );
  }

  return (
    <img
      src={resolveImageUrl(image)}
      alt={name}
      className="w-full h-full object-contain p-1"
      onError={() => setHasError(true)}
    />
  );
}

function TrackOrderPage() {
  const { products, fetchProducts, loading } = useProductStore();
  const { user, registerCustomer, loginWithPhone, loading: authLoading } = useAuthStore();
  const {
    orders,
    fetchOrders,
    placeOrder,
    placingOrder,
    loadingOrders,
    deleteOrder,
    deletingOrder,
  } = useCommerceStore();
  const { fetchNotifications } = useNotificationStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [chatOrderId, setChatOrderId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [customOrder, setCustomOrder] = useState({
    productName: "",
    quantity: 1,
  });
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
      fetchNotifications();
    }
  }, [fetchOrders, fetchNotifications, user]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openOrderForm = (product) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
  };

  const closeOrderForm = () => {
    setSelectedProduct(null);
    setOrderQuantity(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerCustomer(registerForm);
    setRegisterForm({ fullName: "", phoneNumber: "", password: "" });
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
      quantity: Number(orderQuantity) || 1,
    });
    closeOrderForm();
    fetchNotifications();
  };

  const handleCustomOrder = async (e) => {
    e.preventDefault();
    if (!customOrder.productName.trim()) return;
    await placeOrder({
      customProductName: customOrder.productName.trim(),
      quantity: Number(customOrder.quantity) || 1,
    });
    setCustomOrder({ productName: "", quantity: 1 });
    fetchNotifications();
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(orderId);
    }
  };

  const openChatForOrder = (orderId) => {
    setChatOrderId(orderId);
    setShowChat(true);
  };

  const isCustomer = user?.role === "customer";

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="card bg-base-100 shadow-lg border border-base-300/60">
          <div className="card-body p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3">
                  <ShoppingBagIcon className="size-7 sm:size-8 text-primary shrink-0" />
                  Kara maamiltootni meesha ittin ajajatan
                </h1>
                <p className="text-base-content/70 mt-2 text-sm sm:text-base">
                  Galma&apos;a yookin Seena bilbila fi password keessan fayyadamuun, sana booda waanta barbaadan ajajadha
                </p>
              </div>

              <div className="relative w-full lg:w-80">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Meesha barbaduuf...."
                  className="input input-bordered w-full pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {isCustomer && (
          <div className="card bg-base-100 shadow-lg border-2 border-primary/20">
            <div className="card-body p-4 sm:p-6">
              <h2 className="card-title text-lg sm:text-xl gap-2">
                <PlusCircleIcon className="size-5 text-primary" />
                Order a product not on the website
              </h2>
              <p className="text-sm text-base-content/70 -mt-1">
                If the product you want is not listed below, describe it here and we will handle your request.
              </p>

              <form onSubmit={handleCustomOrder} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">Full Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full bg-base-200"
                      value={user.full_name}
                      readOnly
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered w-full bg-base-200"
                      value={user.phone_number}
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-4">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">Product Name</span>
                      <span className="label-text-alt text-error">Required</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Describe the product you want..."
                      value={customOrder.productName}
                      onChange={(e) =>
                        setCustomOrder((prev) => ({ ...prev, productName: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">Quantity</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input input-bordered w-full"
                      value={customOrder.quantity}
                      onChange={(e) =>
                        setCustomOrder((prev) => ({ ...prev, quantity: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full sm:w-auto"
                  disabled={placingOrder || !customOrder.productName.trim()}
                >
                  {placingOrder ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Submit Custom Order"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {!isCustomer && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-lg border border-base-300/60">
              <div className="card-body">
                <h2 className="card-title text-xl sm:text-2xl">
                  <UserIcon className="size-6 text-primary" />
                  Galmee Maamiltoota
                </h2>
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Maqaa keessan...."
                    value={registerForm.fullName}
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, fullName: e.target.value }))
                    }
                    required
                  />
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    placeholder="Lakkoofsa bilbila galcha...."
                    value={registerForm.phoneNumber}
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, phoneNumber: e.target.value }))
                    }
                    required
                  />
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Password galcha...."
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, password: e.target.value }))
                    }
                    required
                  />
                  <button type="submit" className="btn btn-primary w-full" disabled={authLoading}>
                    Galma&apos;a
                  </button>
                </form>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300/60">
              <div className="card-body">
                <h2 className="card-title text-xl sm:text-2xl">
                  <PackageSearchIcon className="size-6 text-secondary" />
                  Seena Lakk.bilbila fi password
                </h2>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    placeholder="Lakkoofsa bilbila...."
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Password...."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-secondary w-full" disabled={authLoading}>
                    Seena
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {isCustomer && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6">
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-lg border border-base-300/60">
                <div className="card-body p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="card-title text-xl sm:text-2xl">My Orders</h2>
                    <div className="badge badge-primary">{orders.length}</div>
                  </div>

                  {loadingOrders ? (
                    <div className="flex justify-center py-10">
                      <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-2xl border border-base-300 bg-base-100 p-3 sm:p-4"
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="size-16 sm:size-20 shrink-0 rounded-xl overflow-hidden bg-base-200 border border-base-300">
                              <OrderThumbnail
                                image={order.product_image}
                                name={order.product_name}
                                isCustom={order.is_custom}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-sm sm:text-base line-clamp-2">
                                  {order.product_name}
                                </p>
                                {order.is_custom && (
                                  <span className="badge badge-outline badge-xs">Custom</span>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
                                Quantity: {order.quantity}
                              </p>
                              <div className="mt-2">
                                <OrderStatusBadge status={order.status} />
                              </div>
                              {order.status === "Rejected" && order.rejection_reason && (
                                <p className="text-xs text-error mt-1 line-clamp-2">
                                  Reason: {order.rejection_reason}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => openChatForOrder(order.id)}
                                className="btn btn-sm btn-ghost"
                                aria-label="Chat about order"
                              >
                                <MessageCircleIcon className="size-4" />
                              </button>
                              {order.status === "Placed" && (
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="btn btn-sm btn-error btn-ghost"
                                  disabled={deletingOrder}
                                  aria-label="Delete order"
                                >
                                  <Trash2Icon className="size-4" />
                                </button>
                              )}
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

              <div className="card bg-base-100 shadow-lg border border-base-300/60 h-fit">
                <div className="card-body p-4 sm:p-6">
                  <h2 className="card-title text-xl sm:text-2xl">Profile</h2>
                  <div className="space-y-3 mt-2">
                    <div className="rounded-2xl bg-base-200 px-4 py-3">
                      <p className="text-sm text-base-content/60">Full Name</p>
                      <p className="font-semibold">{user.full_name}</p>
                    </div>
                    <div className="rounded-2xl bg-base-200 px-4 py-3">
                      <p className="text-sm text-base-content/60">Phone</p>
                      <p className="font-semibold">{user.phone_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={showChat ? "block" : "hidden xl:block"}>
              <OrderChat orderId={chatOrderId} />
            </div>
          </div>
        )}

        {isCustomer && !showChat && (
          <button
            type="button"
            className="btn btn-primary btn-circle fixed bottom-6 right-6 z-40 shadow-xl xl:hidden"
            onClick={() => setShowChat(true)}
            aria-label="Open chat"
          >
            <MessageCircleIcon className="size-6" />
          </button>
        )}

        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-4">Products on our website</h2>
          {loading ? (
            <div className="flex justify-center py-16 bg-base-100 rounded-3xl shadow-lg border border-base-300/60">
              <span className="loading loading-spinner loading-lg text-primary" />
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
        </div>

        {selectedProduct && (
          <div className="modal modal-open">
            <div className="modal-box max-w-lg">
              <h3 className="font-bold text-xl sm:text-2xl mb-2">Complete Your Order</h3>

              <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl mb-6">
                <div className="size-20 sm:size-24 shrink-0 rounded-xl overflow-hidden bg-base-100 border border-base-300 flex items-center justify-center">
                  {selectedProduct.image ? (
                    <img
                      src={resolveImageUrl(selectedProduct.image)}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <ImageOffIcon className="size-8 text-base-content/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-base-content/60 uppercase tracking-wide">Product</p>
                  <p className="font-bold text-base sm:text-lg line-clamp-2">{selectedProduct.name}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Product Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-200"
                    value={selectedProduct.name}
                    readOnly
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-200"
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
                    className="input input-bordered w-full bg-base-200"
                    value={user?.phone_number || ""}
                    readOnly
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Quantity</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered w-full"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    required
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
