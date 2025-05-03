import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { signUp } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import { User } from '@/types/auth';

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  age?: string;
}

const SignUpForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error: authError } = useSelector((state: RootState) => state.auth);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    password: '',
    age: 0,
    role: 'worker',
  });

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (formData.name.length < 1 || formData.name.length > 30) {
      errors.name = 'Имя должно быть от 1 до 30 символов';
    }
    if (formData.password.length < 8 || formData.password.length > 50) {
      errors.password = 'Пароль должен быть от 8 до 50 символов';
    }
    if (formData.age < 18 || formData.age > 70) {
      errors.age = 'Возраст должен быть от 18 до 70 лет';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      console.log('Отправка данных формы:', formData);
      const result = await dispatch(signUp(formData) as any);
      console.log('Результат регистрации:', result);
      
      if (result.error) {
        console.error('Ошибка при регистрации:', result.error);
        return;
      }
      
      navigate('/signin');
    } catch (err: any) {
      console.error('Ошибка при регистрации:', err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {authError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authError}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Имя"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
          
          <TextField
            fullWidth
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          />
          
          <TextField
            fullWidth
            label="Возраст"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            margin="normal"
            required
            error={!!validationErrors.age}
            helperText={validationErrors.age}
          />
          
          <TextField
            fullWidth
            select
            label="Роль"
            name="role"
            value={formData.role}
            onChange={handleSelectChange}
            margin="normal"
            required
            SelectProps={{
              native: true,
            }}
          >
            <option value="worker">Работник</option>
            <option value="admin">Администратор</option>
          </TextField>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpForm; 