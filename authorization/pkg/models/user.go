package models

type User struct {
	ID          int    `json:"-" db:"id"`
	Name        string `json:"name" db:"name" validate:"required,gt=0,lte=30"`
	Nickname    string `json:"nickname" db:"nickname" validate:"required,gt=0,lte=30"`
	PhoneNumber string `json:"phone_number" db:"phone_number" validate:"required,gt=0,lte=12"`
	Email       string `json:"email" db:"email" validate:"required,gt=0,lte=255"`
	Password    string `json:"password" db:"password" validate:"required,gt=8,lte=50"`
	Age         int    `json:"age" db:"age" validate:"required,gte=18,lte=70"`
}

type AuthorizationRequest struct {
	Email    string `json:"email" db:"email" validate:"required,gt=0,lte=255"`
	Password string `json:"password" db:"password" validate:"required,gt=8,lte=50"`
}
