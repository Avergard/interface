package service

import (
	"user-service/pkg/models"
	"user-service/pkg/repository"
)

type Authorization interface {
	CreateUser(user models.User) (uint, error)
	GenerateToken(email, password string) (string, error)
	ParseToken(token string) (uint, string, string, error)
}

type Service struct {
	Authorization Authorization
}

func NewService(repo *repository.Repository) *Service {
	return &Service{Authorization: NewAuthService(repo.Authorization)}
}
