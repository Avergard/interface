package helpers

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"
)

var encodePassword = "ding2810Obsa"

func GeneratePasswordHash(password string) (string, error) {
	// Генерируем случайную соль
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	// Создаем хеш SHA-256
	hash := sha256.New()

	// Добавляем соль и encodePassword к паролю
	hash.Write([]byte(password))
	hash.Write(salt)
	hash.Write([]byte(encodePassword))

	// Получаем хеш
	hashedPassword := hash.Sum(nil)

	// Сохраняем соль вместе с хешем
	return fmt.Sprintf("%x:%x", hashedPassword, salt), nil
}

func VerifyPassword(password, hashedPassword string) bool {
	// Разделяем хеш и соль
	parts := strings.Split(hashedPassword, ":")
	if len(parts) != 2 {
		return false
	}

	storedHash, salt := parts[0], parts[1]

	// Создаем хеш для проверки
	hash := sha256.New()
	hash.Write([]byte(password))
	saltBytes, _ := hex.DecodeString(salt)
	hash.Write(saltBytes)
	hash.Write([]byte(encodePassword))

	// Сравниваем хеши
	return hex.EncodeToString(hash.Sum(nil)) == storedHash
}
