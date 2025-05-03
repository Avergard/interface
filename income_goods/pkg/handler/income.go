package handler

import (
	"net/http"
	"strconv"

	"income_goods/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/sirupsen/logrus"
)

func (h *Handler) Get(c *gin.Context) {
	validate := validator.New(validator.WithRequiredStructEnabled())

	var item models.GetGoodByGoodsCodeRequest

	if err := c.BindJSON(&item); err != nil {
		logrus.Errorf("failed to unmarshal json: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	if err := validate.Struct(&item); err != nil {
		logrus.Errorf("failed to validate json: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	good, err := h.services.Income.GetGoodByGoodsCode(item.GoodsCode)
	if err != nil {
		logrus.Errorf("failed to get item: %v", err)
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "unprocessable entity"})
		return
	}

	c.JSON(http.StatusOK, good)
}

func (h *Handler) Create(c *gin.Context) {
	validate := validator.New(validator.WithRequiredStructEnabled())

	var good models.Good

	if err := c.BindJSON(&good); err != nil {
		logrus.Errorf("failed to unmarshal json: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	if err := validate.Struct(&good); err != nil {
		logrus.Errorf("failed to validate json: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	// Получаем информацию о пользователе из контекста
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	username, _ := c.Get("username")

	// Преобразуем userID в int
	userIDInt, err := strconv.Atoi(userID.(string))
	if err != nil {
		logrus.Errorf("failed to convert user_id to int: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	// Устанавливаем информацию о пользователе
	good.CreatedByUserID = userIDInt
	good.CreatedByRole = role.(string)
	good.CreatedByUsername = username.(string)

	createdGood, err := h.services.Income.Create(good)
	if err != nil {
		logrus.Errorf("failed to create good: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id": createdGood.ID,
	})
}

func (h *Handler) GetAllGoods(c *gin.Context) {
	var request struct {
		GoodsCode string `json:"goods_code"`
	}

	if err := c.BindJSON(&request); err != nil {
		// Если тело запроса пустое, продолжаем без goods_code
		if err.Error() == "EOF" {
			goods, err := h.services.Income.GetAllGoods("")
			if err != nil {
				logrus.Errorf("failed to get goods: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
				return
			}
			c.JSON(http.StatusOK, goods)
			return
		}
		logrus.Errorf("failed to unmarshal json: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	goods, err := h.services.Income.GetAllGoods(request.GoodsCode)
	if err != nil {
		logrus.Errorf("failed to get goods: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, goods)
}

func (h *Handler) Update(c *gin.Context) {
	validate := validator.New(validator.WithRequiredStructEnabled())

	var good models.Good
	if err := c.BindJSON(&good); err != nil {
		logrus.Errorf("failed to unmarshal json: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	if err := validate.Struct(&good); err != nil {
		logrus.Errorf("failed to validate json: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	updatedGood, err := h.services.Income.UpdateGood(good)
	if err != nil {
		logrus.Errorf("failed to update good: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, updatedGood)
}

func (h *Handler) Delete(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}

	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	if err := h.services.Income.DeleteGood(idInt); err != nil {
		logrus.Errorf("failed to delete good: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "good deleted successfully"})
}
