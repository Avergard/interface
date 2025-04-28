package main

import (
	"income_goods/pkg/handler"
	"income_goods/pkg/helpers"
	"income_goods/pkg/repository"
	"income_goods/pkg/service"

	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

func main() {
	logrus.SetFormatter(&logrus.JSONFormatter{})

	if err := helpers.InitConfigs("../configs", "config"); err != nil {
		logrus.Fatalf("error inizializing configs: %s", err.Error())
	}

	goodsDB, err := repository.NewPostgresDB(repository.Config{
		Host:     viper.GetString("database.incomeDB.host"),
		Port:     viper.GetString("database.incomeDB.port"),
		Username: viper.GetString("database.incomeDB.username"),
		Password: viper.GetString("database.incomeDB.password"),
		DBName:   viper.GetString("database.incomeDB.dbname"),
		SSLMode:  viper.GetString("database.incomeDB.sslmode"),
	})
	if err != nil {
		logrus.Fatalf("error initializing database connection: %s", err.Error())
	}

	repos := repository.NewRepository(goodsDB)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)

	srv := NewServer(handlers.InitRoutes())
	if err := srv.Run(viper.GetString("port")); err != nil {
		logrus.Fatalf("error occurred while running http server: %s", err.Error())
	}
}
