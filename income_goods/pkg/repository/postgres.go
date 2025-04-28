package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
)

type RepackStatus uint8

const (
	goodsTable = "income_goods"
)

type Config struct {
	Host     string
	Port     string
	Username string
	Password string
	DBName   string
	SSLMode  string
}

func NewPostgresDB(cfg Config) (*sqlx.DB, error) {
	db, err := sqlx.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s", cfg.Host, cfg.Port, cfg.Username, cfg.DBName, cfg.Password, cfg.SSLMode))
	if err != nil {
		logrus.Errorf("failed to connect to postgres: %v", err)
		return nil, err
	}

	if err := db.Ping(); err != nil {
		logrus.Errorf("failed to ping postgres: %v", err)
		return nil, err
	}

	return db, nil
}
