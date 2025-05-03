import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Paper, Typography, TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AppDispatch } from '../store';
import { updateGood } from '../store/slices/goodsSlice';
import { Good } from '../types/goods';

interface EditGoodFormProps {
  good: Good;
  open: boolean;
  onClose: () => void;
}

const EditGoodForm: React.FC<EditGoodFormProps> = ({ good, open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Good>(good);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFormData(good);
  }, [good]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'count' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const result = await dispatch(updateGood(formData) as any);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('Произошла ошибка при обновлении товара');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать товар</DialogTitle>
      <DialogContent>
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
              Товар успешно обновлен!
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGoodForm; 