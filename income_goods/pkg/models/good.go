package models

type Good struct {
	ID          int64  `json:"id" db:"id"`
	GoodsCode   string `json:"goods_code" db:"goods_code" validate:"required,gt=0,lte=255"`
	Name        string `json:"name" db:"name" validate:"required,gt=0,lte=255"`
	Count       uint   `json:"count" db:"count" validate:"required,gt=0,lte=1000"`
	Description string `json:"description" db:"description" validate:"required,gt=0,lte=10000"`
}

type GetGoodByGoodsCodeRequest struct {
	GoodsCode string `json:"goods_code" db:"goods_code" validate:"required,gt=0,lte=255"`
}
