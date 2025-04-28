package service

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
)

const (
	signedKey = "23F#HFerlf3joinus"
)

type TokenClaims struct {
	jwt.RegisteredClaims
	UserID uint `json:"user_id"`
}

type ParseTokenService struct{}

func NewParseTokenService() *ParseTokenService {
	return &ParseTokenService{}
}

func (s *ParseTokenService) ParseToken(accessToken string) (uint, error) {
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
