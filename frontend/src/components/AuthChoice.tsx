import React from 'react';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AuthChoice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Добро пожаловать
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Выберите действие:
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
              onClick={() => navigate('/signin')}
            >
              <Typography variant="h6" gutterBottom>
                Вход
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Войдите в свой аккаунт
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
              onClick={() => navigate('/signup')}
            >
              <Typography variant="h6" gutterBottom>
                Регистрация
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Создайте новый аккаунт
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AuthChoice; 