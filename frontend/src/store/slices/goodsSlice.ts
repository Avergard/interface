import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Good {
  id: number;
  goods_code: string;
  name: string;
  count: number;
  description: string;
}

interface GoodsState {
  goodsInfo: Good | null;
  goodsList: Good[];
  loading: boolean;
  error: string | null;
}

const initialState: GoodsState = {
  goodsInfo: null,
  goodsList: [],
  loading: false,
  error: null,
};

export const getGoodsInfo = createAsyncThunk(
  'goods/getGoodsInfo',
  async (goodsCode: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      console.log('Отправка запроса с кодом товара:', goodsCode);
      const response = await axios.post('http://localhost:8082/income/goods/get_by_goods_code', 
        { goods_code: goodsCode },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Получен ответ:', response.data);

      // Проверяем структуру ответа
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Неверный формат ответа от сервера');
      }

      // Преобразуем данные в нужный формат
      const goodData: Good = {
        id: response.data.id || 0,
        goods_code: response.data.goods_code || goodsCode,
        name: response.data.name || '',
        count: response.data.count || 0,
        description: response.data.description || ''
      };

      return goodData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка запроса:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        throw new Error(error.response?.data?.error || 'Ошибка при получении информации о товаре');
      } else {
        console.error('Неизвестная ошибка:', error);
        throw error;
      }
    }
  }
);

export const getAllGoods = createAsyncThunk(
  'goods/getAllGoods',
  async (goodsCode?: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      const response = await axios.post(
        'http://localhost:8082/income/goods/get_all_goods',
        goodsCode ? { goods_code: goodsCode } : {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!Array.isArray(response.data)) {
        throw new Error('Неверный формат ответа от сервера');
      }

      return response.data as Good[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Ошибка при получении списка товаров');
      }
      throw error;
    }
  }
);

const goodsSlice = createSlice({
  name: 'goods',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearGoodsInfo: (state) => {
      state.goodsInfo = null;
      state.error = null;
    },
    clearGoodsList: (state) => {
      state.goodsList = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGoodsInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.goodsInfo = null;
      })
      .addCase(getGoodsInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.goodsInfo = action.payload;
        state.error = null;
      })
      .addCase(getGoodsInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка при загрузке данных';
        state.goodsInfo = null;
      })
      .addCase(getAllGoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGoods.fulfilled, (state, action) => {
        state.loading = false;
        state.goodsList = action.payload;
        state.error = null;
      })
      .addCase(getAllGoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка при загрузке списка товаров';
        state.goodsList = [];
      });
  },
});

export const { clearError, clearGoodsInfo, clearGoodsList } = goodsSlice.actions;
export default goodsSlice.reducer; 