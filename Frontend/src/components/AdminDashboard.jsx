import { useEffect, useState } from "react";
import {
  GiftIcon,
  PhoneCallIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  Trash2Icon,
  UsersIcon,
  ImageOffIcon,
  MessageCircleIcon,
} from "lucide-react";
import { useCommerceStore } from "../store/useCommerceStore";
import { useNotificationStore } from "../store/useNotificationStore";
import AdminChatPanel from "./AdminChatPanel";
import OrderStatusBadge from "./OrderStatusBadge";
import { LABELS } from "../constants/labels";
import { resolveImageUrl } from "../lib/imageUrl";

function AdminDashboard() {
  const [searchPhone, setSearchPhone] = useState("");
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [chatFocus, setChatFocus] = useState({ customerId: null, orderId: null });
  const [promotionForm, setPromotionForm] = useState({
    title: "",
    message: "",
    discountPercent: "",
  });

  const {
    adminOrders,
    customerLookup,
    allCustomers,
    contactMessages,
    fetchOrders,
    lookupCustomerByPhone,
    createPromotion,
    fetchAllCustomers,
    fetchContactMessages,
    deleteOrder,
    updateOrderStatus,
    deleteContactMessage,
    loadingOrders,
    loadingLookup,
    loadingCustomers,
    loadingMessages,
    creatingPromotion,
    deletingOrder,
    updatingOrderStatus,
  } = useCommerceStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchOrders();
    fetchAllCustomers();
    fetchContactMessages();
    fetchNotifications();
  }, [fetchOrders, fetchAllCustomers, fetchContactMessages, fetchNotifications]);

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
                <h2 className="text-xl sm:text-2xl font-bold">Ajaaja maamiltootaa dhihoo</h2>
                <p className="text-base-content/60 text-sm">
                  Ajaaja maamiltoonni ergan hunda ilaali, fudhadhu yookin didi.
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
                            <span className="badge badge-outline badge-xs">{LABELS.customOrder}</span>
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
                            {LABELS.quantity}: {order.quantity}
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
                              {LABELS.accept}
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-error btn-outline"
                              disabled={updatingOrderStatus}
                              onClick={() => setRejectingOrder(order)}
                            >
                              {LABELS.reject}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setChatFocus({
                              customerId: order.customer_id,
                              orderId: order.id,
                            })
                          }
                          className="btn btn-sm btn-info btn-ghost"
                          aria-label={`${LABELS.chat} ${order.customer_name}`}
                        >
                          <MessageCircleIcon className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="btn btn-sm btn-error btn-ghost"
                          disabled={deletingOrder}
                          aria-label={`Delete order for ${order.product_name}`}
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBagIcon className="size-12 text-base-content/30 mb-3" />
                <p className="text-base-content/60">Ajaajni maamiltootaa hin jiru.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminChatPanel
        focusCustomerId={chatFocus.customerId}
        focusOrderId={chatFocus.orderId}
      />

      {rejectingOrder && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">{LABELS.rejectTitle}</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Ajaja &quot;{rejectingOrder.product_name}&quot; kan{" "}
              {rejectingOrder.customer_name} diduuf jirta.
            </p>
            <form onSubmit={handleRejectOrder} className="space-y-4">
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder={`${LABELS.rejectReason} (barbaachisa)...`}
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
                  {LABELS.cancel}
                </button>
                <button
                  type="submit"
                  className="btn btn-error"
                  disabled={!rejectionReason.trim() || updatingOrderStatus}
                >
                  {LABELS.reject} {LABELS.confirm}
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

      {/* Customer Messages Section */}
      <div className="card bg-base-100 shadow-lg border border-base-300/60">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MessageCircleIcon className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Erga Maamiltootaa</h2>
              <p className="text-base-content/60 text-sm">
                Erga maamiltoonni ergan hunda ilaali.
              </p>
            </div>
          </div>

          {loadingMessages ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : contactMessages.length > 0 ? (
            <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-2xl border border-base-300 bg-base-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-base">{msg.name}</p>
                        <span className="badge badge-sm badge-outline">{msg.phone}</span>
                      </div>
                      <p className="text-xs text-base-content/60">
                        {new Date(msg.created_at).toLocaleString('am-ET', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("Eergan kun balleessuu barbaadda?")) {
                          deleteContactMessage(msg.id);
                        }
                      }}
                      className="btn btn-sm btn-ghost btn-error"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                  <div className="bg-base-200 rounded-xl p-3 mt-2">
                    <p className="text-sm text-base-content">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircleIcon className="size-12 text-base-content/30 mb-3" />
              <p className="text-base-content/60">Erga maamiltootaa hin jiru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
