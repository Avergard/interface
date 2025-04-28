package service

import (
	"income_goods/pkg/models"
	"income_goods/pkg/repository"
)

type IncomeService struct {
	income repository.Income
}

func NewIncomeService(goods repository.Income) *IncomeService {
	return &IncomeService{income: goods}
}

func (r *IncomeService) GetGoodByGoodsCode(goodsCode string) (models.Good, error) {
	return r.income.GetGoodByGoodsCode(goodsCode)
}

func (r *IncomeService) Create(good models.Good) (models.Good, error) {
	return r.income.Create(good)
}

func (r *IncomeService) GetAllGoods(goodsCode string) ([]models.Good, error) {
	return r.income.GetAllGoods(goodsCode)
}
