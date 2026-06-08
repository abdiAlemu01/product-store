import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getAuthHeaders } from "../lib/session";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useCommerceStore = create((set) => ({
  orders: [],
  adminOrders: [],
  customerLookup: null,
  allCustomers: [],
  contactMessages: [],
  loadingOrders: false,
  loadingLookup: false,
  loadingCustomers: false,
  loadingMessages: false,
  creatingPromotion: false,
  placingOrder: false,
  deletingOrder: false,
  updatingOrderStatus: false,

  fetchOrders: async () => {
    set({ loadingOrders: true });

    try {
      const response = await axios.get(`${BASE_URL}/api/orders`, {
        headers: getAuthHeaders(),
      });

      set({ orders: response.data.data, adminOrders: response.data.data });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to fetch orders";
      toast.error(message);
    } finally {
      set({ loadingOrders: false });
    }
  },

  placeOrder: async ({ productId, customProductName, quantity = 1 }) => {
    set({ placingOrder: true });

    try {
      const payload = productId
        ? { productId, quantity }
        : { customProductName, quantity };

      const response = await axios.post(`${BASE_URL}/api/orders`, payload, {
        headers: getAuthHeaders(),
      });

      set((state) => ({
        orders: [response.data.data, ...state.orders],
        adminOrders: [response.data.data, ...state.adminOrders],
      }));

      toast.success("Ajajni kee milkaa'inaan ergameera");
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to place order";
      toast.error(message);
      throw error;
    } finally {
      set({ placingOrder: false });
    }
  },

  updateOrderStatus: async ({ orderId, status, rejectionReason }) => {
    set({ updatingOrderStatus: true });

    try {
      const response = await axios.patch(
        `${BASE_URL}/api/orders/${orderId}/status`,
        { status, rejectionReason },
        { headers: getAuthHeaders() }
      );

      const updateOrder = (order) =>
        order.id === orderId ? { ...order, ...response.data.data } : order;

      set((state) => ({
        orders: state.orders.map(updateOrder),
        adminOrders: state.adminOrders.map(updateOrder),
      }));

      toast.success(
        status === "Accepted" ? "Ajajni fudhatameera" : "Ajajni didameera"
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to update order";
      toast.error(message);
      throw error;
    } finally {
      set({ updatingOrderStatus: false });
    }
  },

  lookupCustomerByPhone: async (phoneNumber) => {
    set({ loadingLookup: true });

    try {
      const response = await axios.get(`${BASE_URL}/api/customers/search`, {
        params: { phoneNumber },
        headers: getAuthHeaders(),
      });

      set({ customerLookup: response.data.data });
      return response.data.data;
    } catch (error) {
      set({ customerLookup: null });
      const message = error.response?.data?.message || "Unable to find customer";
      toast.error(message);
      throw error;
    } finally {
      set({ loadingLookup: false });
    }
  },

  createPromotion: async ({ phoneNumber, title, message, discountPercent }) => {
    set({ creatingPromotion: true });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/customers/promotions`,
        {
          phoneNumber,
          title,
          message,
          discountPercent,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      set((state) => ({
        customerLookup: state.customerLookup
          ? {
              ...state.customerLookup,
              promotions: [response.data.data, ...state.customerLookup.promotions],
            }
          : state.customerLookup,
      }));

      toast.success("Promotion added successfully");
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to create promotion";
      toast.error(message);
      throw error;
    } finally {
      set({ creatingPromotion: false });
    }
  },

  clearCustomerLookup: () => set({ customerLookup: null }),

  fetchAllCustomers: async () => {
    set({ loadingCustomers: true });

    try {
      const response = await axios.get(`${BASE_URL}/api/customers/all`, {
        headers: getAuthHeaders(),
      });

      set({ allCustomers: response.data.data });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to fetch customers";
      toast.error(message);
      throw error;
    } finally {
      set({ loadingCustomers: false });
    }
  },

  deleteOrder: async (orderId) => {
    set({ deletingOrder: true });

    try {
      const response = await axios.delete(`${BASE_URL}/api/orders/${orderId}`, {
        headers: getAuthHeaders(),
      });

      set((state) => ({
        orders: state.orders.filter((order) => order.id !== orderId),
        adminOrders: state.adminOrders.filter((order) => order.id !== orderId),
      }));

      toast.success("Ajajni baleeffameera");
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to delete order";
      toast.error(message);
      throw error;
    } finally {
      set({ deletingOrder: false });
    }
  },

  fetchContactMessages: async () => {
    set({ loadingMessages: true });

    try {
      const response = await axios.get(`${BASE_URL}/api/messages`, {
        headers: getAuthHeaders(),
      });

      set({ contactMessages: response.data.data });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to fetch messages";
      toast.error(message);
      throw error;
    } finally {
      set({ loadingMessages: false });
    }
  },

  deleteContactMessage: async (messageId) => {
    try {
      await axios.delete(`${BASE_URL}/api/messages/${messageId}`, {
        headers: getAuthHeaders(),
      });

      set((state) => ({
        contactMessages: state.contactMessages.filter((msg) => msg.id !== messageId),
      }));

      toast.success("Message deleted successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Unable to delete message";
      toast.error(message);
      throw error;
    }
  },
}));
