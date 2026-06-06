import { useEffect, useState } from "react";
import {
  GiftIcon,
  PhoneCallIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { useCommerceStore } from "../store/useCommerceStore";

function AdminDashboard() {
  const [searchPhone, setSearchPhone] = useState("");
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
    loadingOrders,
    loadingLookup,
    loadingCustomers,
    creatingPromotion,
    deletingOrder,
  } = useCommerceStore();

  useEffect(() => {
    fetchOrders();
    fetchAllCustomers();
  }, [fetchOrders, fetchAllCustomers]);

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

  return (
    <div className="space-y-6 mb-8">
      <div className="card bg-base-100 shadow-lg border border-base-300/60">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UsersIcon className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">All Registered Customers</h2>
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
                <h2 className="text-2xl font-bold">Customer Promotion Lookup</h2>
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
                <h2 className="text-2xl font-bold">Recent Customer Orders</h2>
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
              <div className="space-y-3">
                {adminOrders.slice(0, 6).map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-base-300 bg-base-100 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {order.product_image && (
                        <img
                          src={order.product_image}
                          alt={order.product_name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">{order.product_name}</p>
                        <p className="text-sm text-base-content/70">
                          {order.customer_name} - {order.customer_phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="badge badge-primary">{order.status}</div>
                        <p className="text-sm text-base-content/70 mt-2">
                          Qty {order.quantity} | ${Number(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="btn btn-sm btn-error btn-ghost"
                        disabled={deletingOrder}
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
    </div>
  );
}

export default AdminDashboard;
