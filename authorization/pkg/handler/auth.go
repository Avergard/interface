package handler

import (
	"net/http"
	"user-service/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/sirupsen/logrus"
)

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

	userID, err := h.serviceManager.Authorization.CreateUser(newUser)
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

	authToken, err := h.serviceManager.Authorization.GenerateToken(authRequest.Email, authRequest.Password)
	if err != nil {
		logrus.Errorf("failed to generate token: %v", err)
		ginContext.JSON(http.StatusUnprocessableEntity, gin.H{"error": "failed to generate token"})
		return
	}

	ginContext.JSON(http.StatusOK, gin.H{
		"token": authToken,
	})
}
