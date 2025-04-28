package service

import (
	"fmt"
	"time"
	"user-service/pkg/helpers"
	"user-service/pkg/models"
	"user-service/pkg/repository"

	"github.com/golang-jwt/jwt/v5"
)

const (
	signedKey = "23F#HFerlf3joinus"
)

type TokenClaims struct {
	jwt.RegisteredClaims
	UserID uint `json:"user_id"`
}

type AuthService struct {
	repo repository.Authorization
}

func NewAuthService(repo repository.Authorization) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) CreateUser(user models.User) (uint, error) {
	user.Password = helpers.GeneratePasswordHash(user.Password)

	return s.repo.CreateUser(user)
}

func (s *AuthService) GenerateToken(email, password string) (string, error) {
	user, err := s.repo.GetUser(email, helpers.GeneratePasswordHash(password))
	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.MapClaims{
		"ExpiredAt": time.Now().Add(time.Hour * 72).Unix(),
		"IssuedAt":  time.Now().Unix(),
		"user_id":   user.ID,
	})

	return token.SignedString([]byte(signedKey))
}

func (s *AuthService) ParseToken(accessToken string) (uint, error) {
	token, err := jwt.ParseWithClaims(accessToken, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(signedKey), nil
	})
	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(*TokenClaims)
	if !ok || !token.Valid {
		return 0, err
	}

	return claims.UserID, nil
}
