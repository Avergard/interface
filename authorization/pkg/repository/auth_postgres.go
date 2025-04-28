package repository

import (
	"fmt"
	"user-service/pkg/models"

	"github.com/jmoiron/sqlx"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

func (s *AuthPostgres) CreateUser(user models.User) (uint, error) {
	var id uint

	query := fmt.Sprintf("INSERT INTO %s (name, nickname, password, email, phone_number, age) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", usersTable)

	row := s.db.QueryRow(query, user.Name, user.Nickname, user.Password, user.Email, user.PhoneNumber, user.Age)

	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (s *AuthPostgres) GetUser(email, password string) (models.User, error) {
	var user models.User

	query := fmt.Sprintf("SELECT id FROM %s WHERE email = $1 AND password = $2", usersTable)
	err := s.db.Get(&user, query, email, password)

	return user, err
}
