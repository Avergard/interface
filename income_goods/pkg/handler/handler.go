package handler

import (
	"income_goods/pkg/service"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	services *service.Service
}

func NewHandler(services *service.Service) *Handler {
	return &Handler{
		services: services,
	}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// CORS middleware
	router.Use(func(c *gin.Context) {
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

	// Auth middleware
	router.Use(func(c *gin.Context) {
		headers := c.GetHeader("Authorization")
		if headers == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "the auth header is empty"})
			c.Abort()
			return
		}

		headerParts := strings.Split(headers, " ")
		if len(headerParts) != 2 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "the auth header is invalid"})
			c.Abort()
			return
		}

		userID, err := h.services.Parser.ParseToken(headerParts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "the auth header is invalid"})
			c.Abort()
			return
		}

		c.Set("user_id", strconv.Itoa(int(userID)))
		c.Next()
	})

	// item
	auth := router.Group("/income/goods")
	{
		auth.POST("/get_by_goods_code", h.Get)
		auth.POST("/create", h.Create)
		auth.POST("/get_all_goods", h.GetAllGoods)
	}

	return router
}
