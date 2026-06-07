import { useEffect, useState } from "react";
import {
  GiftIcon,
  PhoneCallIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  Trash2Icon,
  UsersIcon,
  ImageOffIcon,
} from "lucide-react";
import { useCommerceStore } from "../store/useCommerceStore";
import { useNotificationStore } from "../store/useNotificationStore";
import OrderChat from "./OrderChat";
import OrderStatusBadge from "./OrderStatusBadge";
import { resolveImageUrl } from "../lib/imageUrl";

function AdminDashboard() {
  const [searchPhone, setSearchPhone] = useState("");
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [promotionForm, setPromotionForm] = useState({
    title: "",
    message: "",
    discountPercent: "",
  });

  const {
    adminOrders,
    customerLookup,
    allCustomers,
    fetchOrders,
    lookupCustomerByPhone,
    createPromotion,
    fetchAllCustomers,
    deleteOrder,
    updateOrderStatus,
    loadingOrders,
    loadingLookup,
    loadingCustomers,
    creatingPromotion,
    deletingOrder,
    updatingOrderStatus,
  } = useCommerceStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchOrders();
    fetchAllCustomers();
    fetchNotifications();
  }, [fetchOrders, fetchAllCustomers, fetchNotifications]);

  const handleSearchCustomer = async (e) => {
    e.preventDefault();

    if (!searchPhone.trim()) {
      return;
    }

    await lookupCustomerByPhone(searchPhone.trim());
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();

    await createPromotion({
      phoneNumber: customerLookup.customer.phone_number,
      title: promotionForm.title,
      message: promotionForm.message,
      discountPercent: promotionForm.discountPercent || 0,
    });

    setPromotionForm({
      title: "",
      message: "",
      discountPercent: "",
    });
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(orderId);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    await updateOrderStatus({ orderId, status: "Accepted" });
    fetchNotifications();
  };

  const handleRejectOrder = async (e) => {
    e.preventDefault();
    if (!rejectingOrder || !rejectionReason.trim()) return;
    await updateOrderStatus({
      orderId: rejectingOrder.id,
      status: "Rejected",
      rejectionReason: rejectionReason.trim(),
    });
    setRejectingOrder(null);
    setRejectionReason("");
    fetchNotifications();
  };

  const OrderImage = ({ image, name, isCustom }) => {
    const [hasError, setHasError] = useState(false);

    if (isCustom || !image || hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-base-content/30 px-1">
          <ImageOffIcon className="size-6 sm:size-8" />
          <span className="text-[10px] mt-1 text-center">
            {isCustom ? "Custom" : "No image"}
          </span>
        </div>
      );
    }

    return (
      <img
        src={resolveImageUrl(image)}
        alt={name}
        className="w-full h-full object-contain p-1.5 sm:p-2"
        onError={() => setHasError(true)}
      />
    );
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="card bg-base-100 shadow-lg border border-base-300/60">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UsersIcon className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">All Registered Customers</h2>
              <p className="text-base-content/60 text-sm">
                View all customers registered in the system.
              </p>
            </div>
          </div>

          {loadingCustomers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : allCustomers.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="rounded-2xl border border-base-300 bg-base-100 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{customer.full_name}</p>
                      <p className="text-sm text-base-content/70">{customer.phone_number}</p>
                    </div>
                    <div className="badge badge-secondary">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UsersIcon className="size-12 text-base-content/30 mb-3" />
              <p className="text-base-content/60">No customers registered yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg border border-base-300/60">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <UsersIcon className="size-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Customer Promotion Lookup</h2>
                <p className="text-base-content/60 text-sm">
                  Search customers by phone number and attach promotions.
                </p>
              </div>
            </div>

            <form onSubmit={handleSearchCustomer} className="flex flex-col md:flex-row gap-3">
              <input
                type="tel"
                className="input input-bordered flex-1"
                placeholder="Enter customer phone number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={loadingLookup}>
                <PhoneCallIcon className="size-4" />
                Search
              </button>
            </form>

            {customerLookup && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-base-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg">{customerLookup.customer.full_name}</h3>
                      <p className="text-sm text-base-content/70">
                        {customerLookup.customer.phone_number}
                      </p>
                    </div>
                    <div className="badge badge-secondary badge-lg">
                      {customerLookup.totalOrders} Orders
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreatePromotion} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="Promotion title"
                      value={promotionForm.title}
                      onChange={(e) =>
                        setPromotionForm((currentForm) => ({
                          ...currentForm,
                          title: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input input-bordered"
                      placeholder="Discount %"
                      value={promotionForm.discountPercent}
                      onChange={(e) =>
                        setPromotionForm((currentForm) => ({
                          ...currentForm,
                          discountPercent: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Promotion message"
                    value={promotionForm.message}
                    onChange={(e) =>
                      setPromotionForm((currentForm) => ({
                        ...currentForm,
                        message: e.target.value,
                      }))
                    }
                  />

                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={creatingPromotion || !promotionForm.title}
                  >
                    <GiftIcon className="size-4" />
                    Add Promotion
                  </button>
                </form>

                <div className="space-y-3">
                  <h4 className="font-semibold">Saved Promotions</h4>
                  {customerLookup.promotions.length > 0 ? (
                    customerLookup.promotions.map((promotion) => (
                      <div
                        key={promotion.id}
                        className="rounded-2xl border border-base-300 bg-base-100 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{promotion.title}</p>
                            <p className="text-sm text-base-content/70">{promotion.message}</p>
                          </div>
                          <div className="badge badge-accent">
                            {Number(promotion.discount_percent).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-base-content/60">
                      No promotions saved for this customer yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-300/60">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <ShieldCheckIcon className="size-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Recent Customer Orders</h2>
                <p className="text-base-content/60 text-sm">
                  Track the latest orders placed by customers.
                </p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : adminOrders.length > 0 ? (
              <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
                {adminOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-base-300 bg-base-100 p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="size-20 sm:size-24 shrink-0 rounded-xl overflow-hidden bg-base-200 border-2 border-base-300">
                        <OrderImage
                          image={order.product_image}
                          name={order.product_name}
                          isCustom={order.is_custom}
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-sm sm:text-base leading-tight line-clamp-2">
                            {order.product_name}
                          </p>
                          {order.is_custom && (
                            <span className="badge badge-outline badge-xs">Custom</span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-base-content/70 truncate">
                          {order.customer_name}
                        </p>
                        <p className="text-xs sm:text-sm text-base-content/60">
                          {order.customer_phone}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <OrderStatusBadge status={order.status} />
                          <span className="text-xs text-base-content/60">
                            Qty: {order.quantity}
                          </span>
                          <span className="text-xs text-base-content/50">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {order.status === "Rejected" && order.rejection_reason && (
                          <p className="text-xs text-error line-clamp-2">
                            {order.rejection_reason}
                          </p>
                        )}
                        {order.status === "Placed" && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            <button
                              type="button"
                              className="btn btn-xs btn-success"
                              disabled={updatingOrderStatus}
                              onClick={() => handleAcceptOrder(order.id)}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-error btn-outline"
                              disabled={updatingOrderStatus}
                              onClick={() => setRejectingOrder(order)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="btn btn-sm btn-error btn-ghost shrink-0"
                        disabled={deletingOrder}
                        aria-label={`Delete order for ${order.product_name}`}
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBagIcon className="size-12 text-base-content/30 mb-3" />
                <p className="text-base-content/60">No customer orders yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderChat />

      {rejectingOrder && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Reject Order</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Rejecting order for &quot;{rejectingOrder.product_name}&quot; from{" "}
              {rejectingOrder.customer_name}
            </p>
            <form onSubmit={handleRejectOrder} className="space-y-4">
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Reason for rejection (required)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                rows={3}
              />
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setRejectingOrder(null);
                    setRejectionReason("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-error"
                  disabled={!rejectionReason.trim() || updatingOrderStatus}
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close"
            onClick={() => {
              setRejectingOrder(null);
              setRejectionReason("");
            }}
          />
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
