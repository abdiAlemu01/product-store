import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getAuthHeaders } from "../lib/session";

const BASE_URL = import.meta.env.VITE_API_URL;

const initialState = {
  conversations: [],
  messages: [],
  activeConversationId: null,
  activeCustomerId: null,
  loadingConversations: false,
  loadingMessages: false,
  sending: false,
};

export const useChatStore = create((set, get) => ({
  ...initialState,

  resetChat: () => set({ ...initialState }),

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/chat/conversations`, {
        headers: getAuthHeaders(),
      });
      const conversations = response.data.data;
      set({ conversations });

      const { activeConversationId } = get();
      const isCustomerView = conversations.length === 1;

      if (isCustomerView && !activeConversationId) {
        await get().selectConversation(conversations[0].id);
      }
    } catch {
      // silent
    } finally {
      set({ loadingConversations: false });
    }
  },

  openConversationForCustomer: async (customerId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/chat/conversations/open`,
        { customerId },
        { headers: getAuthHeaders() }
      );

      const conversation = response.data.data;
      await get().fetchConversations();
      await get().selectConversation(conversation.id, customerId);
      return conversation;
    } catch (error) {
      const message = error.response?.data?.message || "Haasaa banuu hin dandeenye";
      toast.error(message);
      throw error;
    }
  },

  selectConversation: async (conversationId, customerId = null) => {
    set({
      activeConversationId: conversationId,
      activeCustomerId: customerId,
      messages: [],
    });
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

      const { activeConversationId } = get();
      if (activeConversationId === conversationId) {
        set({ messages: response.data.data });
      }
    } catch {
      toast.error("Ergaa fe'uu hin dandeenye");
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
      const message = error.response?.data?.message || "Ergaa erguu hin dandeenye";
      toast.error(message);
      throw error;
    } finally {
      set({ sending: false });
    }
  },
}));
