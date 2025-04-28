import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, Divider, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAllGoods } from '../store/slices/goodsSlice';
import { RootState, AppDispatch } from '../store';

interface Good {
  id: number;
  goods_code: string;
  name: string;
  count: number;
  description: string;
}

const GoodsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { goodsList, loading, error } = useSelector((state: RootState) => state.goods);
  const [searchCode, setSearchCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getAllGoods(searchQuery));
  }, [dispatch, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCode(event.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchCode);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Список товаров
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Введите код товара"
            value={searchCode}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            sx={{ minWidth: '120px' }}
          >
            Найти
          </Button>
        </Box>
        {goodsList.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
            {searchQuery ? 'Товары не найдены' : 'Список товаров пуст'}
          </Typography>
        ) : (
          <List>
            {goodsList.map((good, index) => (
              <React.Fragment key={good.id}>
                <ListItem>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {good.name}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Код товара: {good.goods_code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Количество: {good.count}
                    </Typography>
                    {good.description && (
                      <Typography variant="body2" color="text.secondary">
                        Описание: {good.description}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
                {index < goodsList.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default GoodsList; 