export interface User {
  id?: number;
  name: string;
  nickname: string;
  phone_number: string;
  email: string;
  password: string;
  age: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
} 