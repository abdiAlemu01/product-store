import { useEffect, useRef, useState } from "react";
import { MessageCircleIcon, RefreshCwIcon, SendIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function OrderChat({ orderId = null, compact = false }) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  const {
    conversations,
    messages,
    activeConversationId,
    loadingConversations,
    loadingMessages,
    sending,
    fetchConversations,
    selectConversation,
    fetchMessages,
    sendMessage,
  } = useChatStore();
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [user, fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage({ body: text, orderId });
    setText("");
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  };

  const handleRefresh = () => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    } else {
      fetchConversations();
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className={`card bg-base-100 shadow-lg border border-base-300/60 ${compact ? "" : "h-fit"}`}>
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="card-title text-lg sm:text-xl gap-2">
            <MessageCircleIcon className="size-5 text-primary" />
            {isAdmin ? "Customer Chat" : "Chat with Admin"}
          </h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle"
            onClick={handleRefresh}
            disabled={loadingMessages || loadingConversations}
            aria-label="Refresh messages"
          >
            <RefreshCwIcon className="size-4" />
          </button>
        </div>

        {isAdmin && conversations.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mt-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`btn btn-sm shrink-0 ${
                  activeConversationId === conversation.id ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => selectConversation(conversation.id)}
              >
                {conversation.customer_name}
                {conversation.unread_count > 0 && (
                  <span className="badge badge-error badge-xs ml-1">
                    {conversation.unread_count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {loadingConversations ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : (
          <>
            {isAdmin && activeConversation && (
              <p className="text-xs text-base-content/60 -mt-1">
                {activeConversation.customer_phone}
              </p>
            )}

            <div className="mt-3 rounded-xl border border-base-300 bg-base-200/50 p-3 h-56 sm:h-64 overflow-y-auto space-y-2">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-sm" />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-sm text-base-content/50 text-center py-8">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((message) => {
                  const isMine = message.sender_id === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          isMine
                            ? "bg-primary text-primary-content rounded-br-sm"
                            : "bg-base-100 border border-base-300 rounded-bl-sm"
                        }`}
                      >
                        {!isMine && (
                          <p className="text-[10px] font-semibold opacity-70 mb-0.5">
                            {message.sender_name}
                          </p>
                        )}
                        <p>{message.body}</p>
                        {message.order_id && (
                          <p className="text-[10px] opacity-60 mt-1">Re: Order #{message.order_id}</p>
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
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!activeConversationId || sending}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm sm:btn-md"
                disabled={!text.trim() || !activeConversationId || sending}
              >
                <SendIcon className="size-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderChat;
