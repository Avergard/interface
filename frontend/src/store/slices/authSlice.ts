import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, User, AuthRequest } from '@/types/auth';
import axios from 'axios';

// Настройка axios
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData: User, { rejectWithValue }) => {
    try {
      console.log('Отправка запроса на регистрацию:', userData);
      const response = await axios.post('/auth/sign-up', userData);
      console.log('Ответ сервера при регистрации:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Ошибка при регистрации:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue(error.response?.data?.error || 'Ошибка при регистрации');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (authData: AuthRequest, { rejectWithValue }) => {
    try {
      console.log('Отправка запроса на вход:', authData);
      const response = await axios.post('/auth/sign-in', authData);
      console.log('Ответ сервера при входе:', response.data);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Ошибка при входе:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue(error.response?.data?.error || 'Ошибка при входе');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
        // После успешной регистрации автоматически входим
        const { email, password } = state.user || {};
        if (email && password) {
          signIn({ email, password });
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 