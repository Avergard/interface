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

	query := fmt.Sprintf("INSERT INTO %s (name, password, email, age, role) VALUES ($1, $2, $3, $4, $5) RETURNING id", usersTable)

	row := s.db.QueryRow(query, user.Name, user.Password, user.Email, user.Age, user.Role)

	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (s *AuthPostgres) GetUser(email string) (models.User, error) {
	var user models.User

	query := fmt.Sprintf("SELECT id, name, password, email, age, role FROM %s WHERE email = $1", usersTable)
	err := s.db.Get(&user, query, email)

	return user, err
}
