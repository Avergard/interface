import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, Divider, TextField, InputAdornment, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllGoods, deleteGood } from '../store/slices/goodsSlice';
import { RootState, AppDispatch } from '../store';
import EditGoodForm from './EditGoodForm';

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGood, setSelectedGood] = useState<Good | null>(null);

  useEffect(() => {
    dispatch(getAllGoods());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCode(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchCode);
    dispatch(getAllGoods(searchCode));
  };

  const handleEditClick = (good: Good) => {
    setSelectedGood(good);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (good: Good) => {
    setSelectedGood(good);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedGood) {
      await dispatch(deleteGood(selectedGood.id));
      setDeleteDialogOpen(false);
      setSelectedGood(null);
    }
  };

  const filteredGoods = goodsList.filter(good =>
    good.goods_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    good.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : filteredGoods.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
            {searchQuery ? 'Товары не найдены' : 'Список товаров пуст'}
          </Typography>
        ) : (
          <List>
            {filteredGoods.map((good, index) => (
              <React.Fragment key={good.id}>
                <ListItem>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {good.name}
                      </Typography>
                      <Box>
                        <IconButton onClick={() => handleEditClick(good)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(good)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
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
                {index < filteredGoods.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {selectedGood && (
        <>
          <EditGoodForm
            good={selectedGood}
            open={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedGood(null);
            }}
          />
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Вы уверены, что хотите удалить товар "{selectedGood.name}"?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
              <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                Удалить
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default GoodsList; 