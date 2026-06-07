import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getAuthHeaders } from "../lib/session";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useChatStore = create((set, get) => ({
  conversations: [],
  messages: [],
  activeConversationId: null,
  loadingConversations: false,
  loadingMessages: false,
  sending: false,

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/chat/conversations`, {
        headers: getAuthHeaders(),
      });
      const conversations = response.data.data;
      set({ conversations });

      if (conversations.length === 1 && !get().activeConversationId) {
        set({ activeConversationId: conversations[0].id });
        get().fetchMessages(conversations[0].id);
      }
    } catch {
      // silent
    } finally {
      set({ loadingConversations: false });
    }
  },

  selectConversation: async (conversationId) => {
    set({ activeConversationId: conversationId });
    await get().fetchMessages(conversationId);
  },

  fetchMessages: async (conversationId) => {
    if (!conversationId) return;
    set({ loadingMessages: true });
    try {
      const response = await axios.get(
        `${BASE_URL}/api/chat/conversations/${conversationId}/messages`,
        { headers: getAuthHeaders() }
      );
      set({ messages: response.data.data });
    } catch {
      toast.error("Unable to load messages");
    } finally {
      set({ loadingMessages: false });
    }
  },

  sendMessage: async ({ body, orderId }) => {
    const conversationId = get().activeConversationId;
    if (!conversationId || !body?.trim()) return;

    set({ sending: true });
    try {
      const response = await axios.post(
        `${BASE_URL}/api/chat/conversations/${conversationId}/messages`,
        { body: body.trim(), orderId },
        { headers: getAuthHeaders() }
      );
      set((state) => ({
        messages: [...state.messages, response.data.data],
      }));
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to send message";
      toast.error(message);
      throw error;
    } finally {
      set({ sending: false });
    }
  },
}));
