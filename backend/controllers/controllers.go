package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
