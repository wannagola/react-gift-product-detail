export type User = {
  email: string;
  name: string;
  authToken: string;
};

export type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
};
