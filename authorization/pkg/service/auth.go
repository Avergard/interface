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
	UserID   uint   `json:"user_id"`
	Role     string `json:"role"`
	Username string `json:"username"`
}

type AuthService struct {
	repo repository.Authorization
}

func NewAuthService(repo repository.Authorization) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) CreateUser(user models.User) (uint, error) {
	hashedPassword, err := helpers.GeneratePasswordHash(user.Password)
	if err != nil {
		return 0, fmt.Errorf("failed to hash password: %v", err)
	}
	user.Password = hashedPassword

	return s.repo.CreateUser(user)
}

func (s *AuthService) GenerateToken(email, password string) (string, error) {
	user, err := s.repo.GetUser(email)
	if err != nil {
		return "", err
	}

	if !helpers.VerifyPassword(password, user.Password) {
		return "", fmt.Errorf("invalid password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &TokenClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		UserID:   uint(user.ID),
		Role:     user.Role,
		Username: user.Name,
	})

	return token.SignedString([]byte(signedKey))
}

func (s *AuthService) ParseToken(accessToken string) (uint, string, string, error) {
	token, err := jwt.ParseWithClaims(accessToken, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(signedKey), nil
	})
	if err != nil {
		return 0, "", "", err
	}

	claims, ok := token.Claims.(*TokenClaims)
	if !ok || !token.Valid {
		return 0, "", "", err
	}

	return claims.UserID, claims.Role, claims.Username, nil
}

func (s *AuthService) SignUp(user models.User) (uint, error) {
	return s.repo.CreateUser(user)
}
