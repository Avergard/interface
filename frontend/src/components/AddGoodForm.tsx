import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { AppDispatch } from '../store';
import axios from 'axios';

const AddGoodForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    goods_code: '',
    name: '',
    count: '',
    description: '',
    category: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [goodsCodeError, setGoodsCodeError] = useState<string | null>(null);

  const validateGoodsCode = async (code: string) => {
    // Проверка на наличие только цифр
    if (!/^\d+$/.test(code)) {
      setGoodsCodeError('Код товара должен содержать только цифры');
      return false;
    }

    // Проверка на уникальность кода
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      const response = await axios.post(
        'http://localhost:8082/income/goods/get_all_goods',
        { goods_code: code },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        setGoodsCodeError('Товар с таким кодом уже существует');
        return false;
      }
    } catch (err) {
      // Игнорируем ошибки при проверке уникальности
      console.error('Error checking goods code uniqueness:', err);
    }

    setGoodsCodeError(null);
    return true;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'goods_code') {
      await validateGoodsCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Проверяем валидность кода товара перед отправкой
    const isGoodsCodeValid = await validateGoodsCode(formData.goods_code);
    if (!isGoodsCodeValid) {
      return;
    }

    // Проверяем все обязательные поля
    if (!formData.name || !formData.count || !formData.description || !formData.category) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      const response = await axios.post(
        'http://localhost:8082/income/goods/create',
        {
          goods_code: formData.goods_code,
          name: formData.name,
          count: parseInt(formData.count),
          description: formData.description,
          category: formData.category
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.id) {
        setSuccess(true);
        setFormData({
          goods_code: '',
          name: '',
          count: '',
          description: '',
          category: ''
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Ошибка при создании товара');
      } else {
        setError('Произошла неизвестная ошибка');
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Добавить новый товар
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Код товара"
          name="goods_code"
          value={formData.goods_code}
          onChange={handleChange}
          required
          margin="normal"
          error={!!goodsCodeError}
          helperText={goodsCodeError}
        />
        <TextField
          fullWidth
          label="Название"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Количество"
          name="count"
          type="number"
          value={formData.count}
          onChange={handleChange}
          required
          margin="normal"
          inputProps={{ min: 1, max: 1000 }}
        />
        <TextField
          fullWidth
          select
          label="Категория"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          margin="normal"
          SelectProps={{ native: true }}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiInputLabel-root': {
              position: 'absolute',
              transform: 'translate(14px, -9px) scale(0.75)',
              backgroundColor: 'background.paper',
              padding: '0 4px'
            }
          }}
        >
          <option value="Электроника">Электроника</option>
          <option value="Бытовая техника">Бытовая техника</option>
          <option value="Одежда">Одежда</option>
          <option value="Продукты">Продукты</option>
          <option value="Канцтовары">Канцтовары</option>
          <option value="Мебель">Мебель</option>
          <option value="Строительные материалы">Строительные материалы</option>
          <option value="Автотовары">Автотовары</option>
          <option value="Косметика и гигиена">Косметика и гигиена</option>
          <option value="Детские товары">Детские товары</option>
          <option value="Спорт и отдых">Спорт и отдых</option>
          <option value="Зоотовары">Зоотовары</option>
          <option value="Книги и пресса">Книги и пресса</option>
          <option value="Медицинские товары">Медицинские товары</option>
          <option value="Сад и огород">Сад и огород</option>
          <option value="Инструменты">Инструменты</option>
          <option value="Товары для дома">Товары для дома</option>
          <option value="Товары для офиса">Товары для офиса</option>
          <option value="Обувь">Обувь</option>
          <option value="Аксессуары">Аксессуары</option>
          <option value="Другое">Другое</option>
        </TextField>
        <TextField
          fullWidth
          label="Описание"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          margin="normal"
          multiline
          rows={3}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Товар успешно добавлен!
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Добавить товар
        </Button>
      </Box>
    </Paper>
  );
};

export default AddGoodForm; 