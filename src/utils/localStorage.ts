const STORAGE_KEY = 'user';

export type StoredUser = {
  email: string;
  name: string;
  authToken: string;
};

export const getUserFromStorage = (): StoredUser | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as StoredUser) : null;
};

export const setUserToStorage = (user: StoredUser): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const clearUserStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
