export interface LoginResponse {
  user: {
    email: string;
  };
  token: string;
}

export interface User {
  email: string;
}