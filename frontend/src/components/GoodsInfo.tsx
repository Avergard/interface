import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { getGoodsInfo, clearGoodsInfo } from '../store/slices/goodsSlice';
import { RootState, AppDispatch } from '../store';

interface GoodsInfoProps {
  goodsCode: string;
}

interface Good {
  id: number;
  goods_code: string;
  name: string;
  count: number;
  description: string;
}

const GoodsInfo: React.FC<GoodsInfoProps> = ({ goodsCode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { goodsInfo, loading, error } = useSelector((state: RootState) => state.goods);

  useEffect(() => {
    console.log('GoodsInfo: получен код товара:', goodsCode);
    if (goodsCode) {
      dispatch(getGoodsInfo(goodsCode));
    }

    // Очищаем данные при размонтировании компонента
    return () => {
      dispatch(clearGoodsInfo());
    };
  }, [dispatch, goodsCode]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Загрузка информации о товаре...</Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Alert severity="error">
            <Typography variant="body1" gutterBottom>
              {error}
            </Typography>
            <Typography variant="body2">
              Пожалуйста, проверьте код товара и попробуйте снова.
            </Typography>
          </Alert>
        </Paper>
      </Box>
    );
  }

  if (!goodsInfo) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Alert severity="info">
            <Typography>Товар не найден</Typography>
            <Typography variant="body2">
              Пожалуйста, проверьте код товара и попробуйте снова.
            </Typography>
          </Alert>
        </Paper>
      </Box>
    );
  }

  const good = goodsInfo as Good;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Информация о товаре
        </Typography>
        <Typography><strong>Название:</strong> {good.name}</Typography>
        <Typography><strong>Код товара:</strong> {good.goods_code}</Typography>
        <Typography><strong>Количество:</strong> {good.count}</Typography>
        <Typography><strong>Описание:</strong> {good.description}</Typography>
      </Paper>
    </Box>
  );
};

export default GoodsInfo; 