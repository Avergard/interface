package handler

import (
	"net/http"
	"strings"
	"user-service/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/sirupsen/logrus"
)

const (
	authorizationHeader = "Authorization"
)

func newErrorResponse(c *gin.Context, statusCode int, message string) {
	c.AbortWithStatusJSON(statusCode, map[string]interface{}{
		"message": message,
	})
}

func (h *Handler) SignUp(ginContext *gin.Context) {
	jsonValidator := validator.New(validator.WithRequiredStructEnabled())

	var newUser models.User

	if err := ginContext.ShouldBindJSON(&newUser); err != nil {
		logrus.Errorf("failed to unmarshal json: %v", err)
		ginContext.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	if err := jsonValidator.Struct(&newUser); err != nil {
		logrus.Errorf("failed to validate json: %v", err)
		ginContext.JSON(http.StatusBadRequest, gin.H{"error": "validation failed"})
		return
	}

	userID, err := h.services.Authorization.CreateUser(newUser)
	if err != nil {
		logrus.Errorf("failed to create user: %v", err)
		ginContext.JSON(http.StatusUnprocessableEntity, gin.H{"error": "failed to create user"})
		return
	}

	ginContext.JSON(http.StatusOK, gin.H{
		"id": userID,
	})
}

func (h *Handler) SignIn(ginContext *gin.Context) {
	jsonValidator := validator.New(validator.WithRequiredStructEnabled())

	var authRequest models.AuthorizationRequest

	if err := ginContext.ShouldBindJSON(&authRequest); err != nil {
		logrus.Errorf("failed to unmarshal json: %v", err)
		ginContext.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	if err := jsonValidator.Struct(&authRequest); err != nil {
		logrus.Errorf("failed to validate json: %v", err)
		ginContext.JSON(http.StatusBadRequest, gin.H{"error": "validation failed"})
		return
	}

	authToken, err := h.services.Authorization.GenerateToken(authRequest.Email, authRequest.Password)
	if err != nil {
		logrus.Errorf("failed to generate token: %v", err)
		ginContext.JSON(http.StatusUnprocessableEntity, gin.H{"error": "failed to generate token"})
		return
	}

	ginContext.JSON(http.StatusOK, gin.H{
		"token": authToken,
	})
}

func (h *Handler) userIdentity(c *gin.Context) {
	header := c.GetHeader(authorizationHeader)
	if header == "" {
		newErrorResponse(c, http.StatusUnauthorized, "empty auth header")
		return
	}

	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		newErrorResponse(c, http.StatusUnauthorized, "invalid auth header")
		return
	}

	if len(headerParts[1]) == 0 {
		newErrorResponse(c, http.StatusUnauthorized, "token is empty")
		return
	}

	userID, role, username, err := h.services.Authorization.ParseToken(headerParts[1])
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	c.Set("user_id", userID)
	c.Set("role", role)
	c.Set("username", username)
}
