package service

import (
	"income_goods/pkg/models"
	"income_goods/pkg/repository"
)

type Income interface {
	GetGoodByGoodsCode(goodsCode string) (models.Good, error)
	Create(good models.Good) (models.Good, error)
	GetAllGoods(goodsCode string) ([]models.Good, error)
}

type Parser interface {
	ParseToken(accessToken string) (uint, error)
}

type Service struct {
	Income
	Parser
}

func NewService(repo *repository.Repository) *Service {
	return &Service{Income: NewIncomeService(repo.Income), Parser: NewParseTokenService()}
}
