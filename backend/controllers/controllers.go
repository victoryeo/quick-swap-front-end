package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/victoryeo/quick-swap-front-end/backend/models"
)

// POST /address
func CreateAddress(c *gin.Context) {
	var input models.AddressInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: order matching
	c.JSON(http.StatusOK, gin.H{"data": "ok"})
}

// GET /address
func GetAddress(c *gin.Context) {

	// TODO: order matching
	c.JSON(http.StatusOK, gin.H{"data": "ok"})
}
