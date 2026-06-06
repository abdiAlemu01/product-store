export const USER_STORAGE_KEY = "mana-shop-user";

export const getStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (_error) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(USER_STORAGE_KEY);
};

export const getAuthHeaders = () => {
  const user = getStoredUser();

  if (!user?.id) {
    return {};
  }

  return {
    "x-user-id": String(user.id),
  };
};
