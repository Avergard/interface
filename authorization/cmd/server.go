package main

import (
	"github.com/gin-gonic/gin"
)

type Server struct {
	ginEngine *gin.Engine
}

func NewServer() *Server {
	return &Server{ginEngine: gin.New()}
}

func (server *Server) Run(port string, ginRouter *gin.Engine) error {
	return ginRouter.Run(":" + port)
}
