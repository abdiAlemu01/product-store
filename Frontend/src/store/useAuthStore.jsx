import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "../lib/session";
import { useChatStore } from "./useChatStore";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  loading: false,

  registerCustomer: async ({ fullName, phoneNumber, password }) => {
    set({ loading: true });

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register-customer`, {
        fullName,
        phoneNumber,
        password,
      });

      const user = response.data.data;
      useChatStore.getState().resetChat();
      setStoredUser(user);
      set({ user });
      toast.success("Akkaawuntii maamilaa milkaa'inaan uumame");
      return user;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to register customer";
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  loginWithPhone: async (phoneNumber, password) => {
    set({ loading: true });

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        phoneNumber,
        password,
      });

      const user = response.data.data;
      useChatStore.getState().resetChat();
      setStoredUser(user);
      set({ user });
      toast.success(`Baga nagaan dhufte, ${user.full_name}`);
      return user;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to sign in";
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    clearStoredUser();
    useChatStore.getState().resetChat();
    set({ user: null });
    toast.success("Milkaa'inaan ba'ame");
  },
}));
