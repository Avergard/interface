export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role?: 'worker' | 'admin';
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