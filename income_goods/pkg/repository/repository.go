package repository

import (
	"income_goods/pkg/models"

	"github.com/jmoiron/sqlx"
)

type Income interface {
	GetGoodByGoodsCode(goodsCode string) (models.Good, error)
	Create(good models.Good) (models.Good, error)
	GetAllGoods(goodsCode string) ([]models.Good, error)
}

type Repository struct {
	Income
}

func NewRepository(goodsDB *sqlx.DB) *Repository {
	return &Repository{
		Income: NewIncomePostgres(goodsDB),
	}
}
