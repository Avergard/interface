package main

import (
	"user-service/pkg/handler"
	"user-service/pkg/helpers"
	"user-service/pkg/repository"
	"user-service/pkg/service"

	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

func main() {
	logrus.SetFormatter(&logrus.JSONFormatter{})

	if err := helpers.InitConfigs("../configs", "config"); err != nil {
		logrus.Fatalf("error inizializing configs: %s", err.Error())
	}

	db, err := repository.NewPostgresDB(repository.Config{
		Host:     viper.GetString("database.host"),
		Port:     viper.GetString("database.port"),
		Username: viper.GetString("database.username"),
		Password: viper.GetString("database.password"),
		DBName:   viper.GetString("database.dbname"),
		SSLMode:  viper.GetString("database.sslmode"),
	})
	if err != nil {
		logrus.Fatalf("error initializing database connection: %s", err.Error())
	}

	repos := repository.NewRepository(db)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)

	srv := NewServer()
	if err := srv.Run(viper.GetString("port"), handlers.InitRoutes()); err != nil {
		logrus.Fatalf("error occured while running http server %s", err.Error())
	}
}
