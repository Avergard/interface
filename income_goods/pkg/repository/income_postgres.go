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

func (r *IncomePostgres) Create(good models.Good) (models.Good, error) {
	query := fmt.Sprintf("INSERT INTO %s (goods_code, name, count, description, category, created_by_user_id, created_by_username, created_by_role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", goodsTable)
	var createdGood models.Good
	err := r.db.Get(&createdGood, query, good.GoodsCode, good.Name, good.Count, good.Description, good.Category, good.CreatedByUserID, good.CreatedByUsername, good.CreatedByRole)
	if err != nil {
		return models.Good{}, err
	}
	return createdGood, nil
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

func (s *IncomePostgres) UpdateGood(good models.Good) (models.Good, error) {
	query := fmt.Sprintf("UPDATE %s SET name=$1, goods_code=$2, count=$3, description=$4, category=$5 WHERE id=$6 RETURNING *", goodsTable)

	var updatedGood models.Good
	err := s.db.Get(&updatedGood, query, good.Name, good.GoodsCode, good.Count, good.Description, good.Category, good.ID)
	if err != nil {
		return models.Good{}, err
	}

	return updatedGood, nil
}

func (s *IncomePostgres) DeleteGood(id int64) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", goodsTable)
	_, err := s.db.Exec(query, id)
	return err
}
