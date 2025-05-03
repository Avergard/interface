package models

import (
	"time"
)

type Good struct {
	ID                int64     `json:"id" db:"id"`
	GoodsCode         string    `json:"goods_code" db:"goods_code" validate:"required,gt=0,lte=255"`
	Name              string    `json:"name" db:"name" validate:"required,gt=0,lte=255"`
	Count             uint      `json:"count" db:"count" validate:"required,gt=0,lte=1000"`
	Description       string    `json:"description" db:"description" validate:"required,gt=0,lte=10000"`
	Category          string    `json:"category" db:"category" validate:"required,lte=255"`
	CreatedAt         time.Time `json:"created_at" db:"created_at"`
	CreatedByUserID   int       `json:"created_by_user_id" db:"created_by_user_id"`
	CreatedByUsername string    `json:"created_by_username" db:"created_by_username"`
	CreatedByRole     string    `json:"created_by_role" db:"created_by_role"`
}

type GetGoodByGoodsCodeRequest struct {
	GoodsCode string `json:"goods_code" db:"goods_code" validate:"required,gt=0,lte=255"`
}
