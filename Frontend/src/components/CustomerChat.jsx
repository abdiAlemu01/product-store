import { useEffect, useRef, useState } from "react";
import { MessageCircleIcon, RefreshCwIcon, SendIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LABELS } from "../constants/labels";

function CustomerChat({ orderId = null }) {
  const user = useAuthStore((state) => state.user);
  const {
    messages,
    activeConversationId,
    loadingConversations,
    loadingMessages,
    sending,
    fetchConversations,
    fetchMessages,
    sendMessage,
    resetChat,
  } = useChatStore();
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== "customer") return;
    resetChat();
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user || user.role !== "customer") return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage({ body: text, orderId });
    setText("");
    if (activeConversationId) fetchMessages(activeConversationId);
  };

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300/60 h-fit">
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="card-title text-lg sm:text-xl gap-2">
            <MessageCircleIcon className="size-5 text-primary" />
            {LABELS.chatWithAdmin}
          </h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => activeConversationId && fetchMessages(activeConversationId)}
            disabled={loadingMessages || loadingConversations}
            aria-label={LABELS.refresh}
          >
            <RefreshCwIcon className="size-4" />
          </button>
        </div>

        <p className="text-xs text-base-content/60 -mt-1">
          Bulchiinsa keenya waliin ajaja kee irratti haasaa godhi.
        </p>

        {orderId && (
          <div className="badge badge-outline badge-sm mt-2 w-fit">
            {LABELS.reOrder}{orderId}
          </div>
        )}

        <div className="mt-3 rounded-xl border border-base-300 bg-base-200/50 p-3 h-56 sm:h-64 overflow-y-auto space-y-2">
          {loadingConversations || loadingMessages ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-sm text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-base-content/50 text-center py-8">{LABELS.noMessages}</p>
          ) : (
            messages.map((message) => {
              const isMine = message.sender_id === user.id;
              return (
                <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      isMine
                        ? "bg-primary text-primary-content rounded-br-sm"
                        : "bg-base-100 border border-base-300 rounded-bl-sm"
                    }`}
                  >
                    {!isMine && (
                      <p className="text-[10px] font-semibold opacity-70 mb-0.5">
                        {message.sender_name} (Bulchiinsa)
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
            className="btn btn-primary btn-sm sm:btn-md"
            disabled={!text.trim() || !activeConversationId || sending}
          >
            <SendIcon className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomerChat;
