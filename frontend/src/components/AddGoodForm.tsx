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
    description: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      const response = await axios.post(
        'http://localhost:8082/income/goods/create',
        {
          ...formData,
          count: parseInt(formData.count)
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
          description: ''
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