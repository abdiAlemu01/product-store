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
  loadingOrders: false,
  loadingLookup: false,
  loadingCustomers: false,
  creatingPromotion: false,
  placingOrder: false,

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

  placeOrder: async ({ productId, quantity }) => {
    set({ placingOrder: true });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/orders`,
        { productId, quantity },
        { headers: getAuthHeaders() }
      );

      set((state) => ({
        orders: [response.data.data, ...state.orders],
      }));

      toast.success("Order placed successfully");
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to place order";
      toast.error(message);
      throw error;
    } finally {
      set({ placingOrder: false });
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
}));
