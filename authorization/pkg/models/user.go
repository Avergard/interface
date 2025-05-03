package models

type User struct {
	ID       int    `json:"-" db:"id"`
	Name     string `json:"name" db:"name" validate:"required,gt=0,lte=30"`
	Email    string `json:"email" db:"email" validate:"required,gt=0,lte=255"`
	Password string `json:"password" db:"password" validate:"required,gt=8,lte=50"`
	Age      int    `json:"age" db:"age" validate:"required,gte=18,lte=70"`
	Role     string `json:"role" db:"role" validate:"required,oneof=worker admin"`
}

type AuthorizationRequest struct {
	Email    string `json:"email" db:"email" validate:"required,gt=0,lte=255"`
	Password string `json:"password" db:"password" validate:"required,gt=8,lte=50"`
}
