package repository

import (
	"fmt"
	"income_goods/pkg/models"

	"github.com/jmoiron/sqlx"
)

type IncomePostgres struct {
	db *sqlx.DB
}

func NewIncomePostgres(db *sqlx.DB) *IncomePostgres {
	return &IncomePostgres{db: db}
}

func (s *IncomePostgres) GetGoodByGoodsCode(goodsCode string) (models.Good, error) {
	var item models.Good

	query := fmt.Sprintf("SELECT * FROM %s WHERE goods_code=$1", goodsTable)
	err := s.db.Get(&item, query, goodsCode)

	return item, err
}

func (s *IncomePostgres) Create(good models.Good) (models.Good, error) {
	query := fmt.Sprintf("INSERT INTO %s (name, goods_code, count, description) VALUES ($1, $2, $3, $4) RETURNING id", goodsTable)
	
	var id int64
	err := s.db.QueryRow(query, good.Name, good.GoodsCode, good.Count, good.Description).Scan(&id)
	if err != nil {
		return models.Good{}, err
	}
	
	good.ID = id
	return good, nil
}

func (s *IncomePostgres) GetAllGoods(goodsCode string) ([]models.Good, error) {
	var items []models.Good

	query := fmt.Sprintf("SELECT * FROM %s", goodsTable)
	if goodsCode != "" {
		query += " WHERE goods_code LIKE $1"
		err := s.db.Select(&items, query, goodsCode+"%")
		return items, err
	}

	err := s.db.Select(&items, query)
	return items, err
}
