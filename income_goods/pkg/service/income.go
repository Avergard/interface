package service

import (
	"income_goods/pkg/models"
	"income_goods/pkg/repository"
)

type IncomeService struct {
	income repository.Income
}

func NewIncomeService(income repository.Income) *IncomeService {
	return &IncomeService{income: income}
}

func (s *IncomeService) GetGoodByGoodsCode(goodsCode string) (models.Good, error) {
	return s.income.GetGoodByGoodsCode(goodsCode)
}

func (s *IncomeService) Create(good models.Good) (models.Good, error) {
	return s.income.Create(good)
}

func (s *IncomeService) GetAllGoods(goodsCode string) ([]models.Good, error) {
	return s.income.GetAllGoods(goodsCode)
}

func (s *IncomeService) UpdateGood(good models.Good) (models.Good, error) {
	return s.income.UpdateGood(good)
}

func (s *IncomeService) DeleteGood(id int64) error {
	return s.income.DeleteGood(id)
}
