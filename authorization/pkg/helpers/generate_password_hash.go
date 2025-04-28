package helpers

import (
	"crypto/sha1"
	"fmt"
)

var encodePassword = "ding2810Obsa"

func GeneratePasswordHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(encodePassword)))
}
