package helpers

import "github.com/spf13/viper"

func InitConfigs(dirName, fileName string) error {
	viper.AddConfigPath(dirName)
	viper.SetConfigName(fileName)
	return viper.ReadInConfig()
}
