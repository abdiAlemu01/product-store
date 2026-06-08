import { useEffect, useRef, useState } from "react";
import { MessageCircleIcon, RefreshCwIcon, SendIcon, UserIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LABELS } from "../constants/labels";

function AdminChatPanel({ focusCustomerId = null, focusOrderId = null }) {
  const user = useAuthStore((state) => state.user);
  const {
    conversations,
    messages,
    activeConversationId,
    activeCustomerId,
    loadingConversations,
    loadingMessages,
    sending,
    fetchConversations,
    openConversationForCustomer,
    selectConversation,
    fetchMessages,
    sendMessage,
    resetChat,
  } = useChatStore();
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    resetChat();
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!focusCustomerId || user?.role !== "admin") return;
    openConversationForCustomer(focusCustomerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusCustomerId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user || user.role !== "admin") return null;

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage({ body: text, orderId: focusOrderId });
    setText("");
    if (activeConversationId) fetchMessages(activeConversationId);
  };

  const handleSelectCustomer = (conversation) => {
    selectConversation(conversation.id, conversation.customer_id);
  };

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300/60">
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="card-title text-lg sm:text-xl gap-2">
            <MessageCircleIcon className="size-5 text-secondary" />
            {LABELS.adminChatTitle}
          </h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => fetchConversations()}
            disabled={loadingConversations}
            aria-label={LABELS.refresh}
          >
            <RefreshCwIcon className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-4">
          <div className="rounded-xl border border-base-300 bg-base-200/40 p-2 max-h-72 lg:max-h-80 overflow-y-auto space-y-1">
            <p className="text-xs font-semibold text-base-content/60 px-2 py-1">
              {LABELS.selectCustomer}
            </p>
            {loadingConversations ? (
              <div className="flex justify-center py-6">
                <span className="loading loading-spinner loading-sm" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-base-content/50 px-2 py-4 text-center">
                Maamiltoonni ergaa ergan hin jiru. Ajaja irraa &quot;{LABELS.chat}&quot; cuqaasi.
              </p>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  className={`w-full text-left rounded-lg px-3 py-2 transition-colors ${
                    activeConversationId === conversation.id
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-100"
                  }`}
                  onClick={() => handleSelectCustomer(conversation)}
                >
                  <p className="font-medium text-sm truncate">{conversation.customer_name}</p>
                  <p className="text-[10px] opacity-70 truncate">{conversation.customer_phone}</p>
                  {conversation.unread_count > 0 && (
                    <span className="badge badge-error badge-xs mt-1">
                      {conversation.unread_count}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="min-w-0">
            {activeConversation ? (
              <>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <UserIcon className="size-4 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">{activeConversation.customer_name}</p>
                    <p className="text-xs text-base-content/60">
                      {LABELS.chattingWith}: {activeConversation.customer_phone}
                    </p>
                  </div>
                </div>

                {focusOrderId && activeCustomerId === focusCustomerId && (
                  <div className="badge badge-outline badge-sm mb-2">
                    {LABELS.reOrder}{focusOrderId}
                  </div>
                )}

                <div className="rounded-xl border border-base-300 bg-base-200/50 p-3 h-52 sm:h-64 overflow-y-auto space-y-2">
                  {loadingMessages ? (
                    <div className="flex justify-center py-8">
                      <span className="loading loading-spinner loading-sm" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-base-content/50 text-center py-8">
                      {LABELS.noMessages}
                    </p>
                  ) : (
                    messages.map((message) => {
                      const isAdmin = message.sender_role === "admin";
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                              isAdmin
                                ? "bg-secondary text-secondary-content rounded-br-sm"
                                : "bg-base-100 border border-base-300 rounded-bl-sm"
                            }`}
                          >
                            {!isAdmin && (
                              <p className="text-[10px] font-semibold opacity-70 mb-0.5">
                                {message.sender_name} (Maamila)
                              </p>
                            )}
                            <p>{message.body}</p>
                            {message.order_id && (
                              <p className="text-[10px] opacity-60 mt-1">
                                {LABELS.reOrder}{message.order_id}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="flex gap-2 mt-3">
                  <input
                    type="text"
                    className="input input-bordered input-sm sm:input-md flex-1"
                    placeholder={LABELS.typeMessage}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={!activeConversationId || sending}
                  />
                  <button
                    type="submit"
                    className="btn btn-secondary btn-sm sm:btn-md"
                    disabled={!text.trim() || !activeConversationId || sending}
                  >
                    <SendIcon className="size-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-52 sm:h-64 text-center px-4 border border-dashed border-base-300 rounded-xl">
                <UserIcon className="size-10 text-base-content/30 mb-2" />
                <p className="text-sm text-base-content/60">
                  Maamilaa filadhu yookin ajaja irraa &quot;{LABELS.chat}&quot; cuqaasi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminChatPanel;
