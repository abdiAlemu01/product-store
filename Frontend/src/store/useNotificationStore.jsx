import { create } from "zustand";
import axios from "axios";
import { getAuthHeaders } from "../lib/session";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/notifications`, {
        headers: getAuthHeaders(),
      });
      set({
        notifications: response.data.data,
        unreadCount: response.data.unreadCount,
      });
    } catch {
      // silent when not logged in
    } finally {
      set({ loading: false });
    }
  },

  markRead: async (id) => {
    try {
      await axios.patch(`${BASE_URL}/api/notifications/${id}/read`, null, {
        headers: getAuthHeaders(),
      });
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // ignore
    }
  },

  markAllRead: async () => {
    try {
      await axios.patch(`${BASE_URL}/api/notifications/read-all`, null, {
        headers: getAuthHeaders(),
      });
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          read_at: n.read_at || new Date().toISOString(),
        })),
        unreadCount: 0,
      }));
    } catch {
      // ignore
    }
  },
}));
