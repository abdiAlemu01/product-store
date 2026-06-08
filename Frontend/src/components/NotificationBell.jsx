import { useEffect, useState } from "react";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import { LABELS } from "../constants/labels";

function NotificationBell() {
  const user = useAuthStore((state) => state.user);
  const { notifications, unreadCount, fetchNotifications, markRead, markAllRead } =
    useNotificationStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user, fetchNotifications]);

  if (!user) return null;

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) fetchNotifications();
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="btn btn-ghost btn-circle"
        onClick={handleOpen}
        aria-label="Notifications"
      >
        <BellIcon className="size-5" />
        {unreadCount > 0 && (
          <span className="badge badge-error badge-xs absolute -top-0.5 -right-0.5">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-base-100 rounded-box shadow-xl border border-base-300 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200">
              <span className="font-semibold text-sm">{LABELS.notifications}</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="btn btn-xs btn-ghost gap-1"
                  onClick={markAllRead}
                >
                  <CheckCheckIcon className="size-3" />
                  {LABELS.markAllRead}
                </button>
              )}
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-base-content/60">
                  {LABELS.noNotifications}
                </li>
              ) : (
                notifications.map((notification) => (
                  <li key={notification.id}>
                    <button
                      type="button"
                      className={`w-full text-left px-4 py-3 hover:bg-base-200 transition-colors border-b border-base-300/50 ${
                        !notification.read_at ? "bg-primary/5" : ""
                      }`}
                      onClick={() => {
                        if (!notification.read_at) markRead(notification.id);
                      }}
                    >
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-base-content/70 mt-0.5 line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="text-[10px] text-base-content/50 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBell;
