package service

import (
	"income_goods/pkg/models"
	"income_goods/pkg/repository"
)

type Income interface {
	GetGoodByGoodsCode(goodsCode string) (models.Good, error)
	Create(good models.Good) (models.Good, error)
	GetAllGoods(goodsCode string) ([]models.Good, error)
	UpdateGood(good models.Good) (models.Good, error)
	DeleteGood(id int64) error
}

type Parser interface {
	ParseToken(accessToken string) (uint, string, string, error)
}

type Service struct {
	Income
	Parser
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		Income: NewIncomeService(repos.Income),
		Parser: NewParseTokenService(),
	}
}
