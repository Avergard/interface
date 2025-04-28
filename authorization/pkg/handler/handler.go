package handler

import (
	"user-service/pkg/service"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	serviceManager *service.Service
}

func NewHandler(serviceManager *service.Service) *Handler {
	return &Handler{
		serviceManager: serviceManager,
	}
}

func (handler *Handler) InitRoutes() *gin.Engine {
	ginRouter := gin.New()
	ginRouter.Use(gin.Logger())
	ginRouter.Use(gin.Recovery())

	// CORS middleware
	ginRouter.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// auth
	authGroup := ginRouter.Group("/auth")
	{
		authGroup.POST("/sign-up", handler.SignUp)
		authGroup.POST("/sign-in", handler.SignIn)
	}

	return ginRouter
}
