package handler

import (
	"net/http"

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
