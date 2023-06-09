package controllers

import (
	"log"
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

	models.AddressBook = append(models.AddressBook, input)

	log.Printf("%v", models.AddressBook)
	// TODO: order matching
	c.JSON(http.StatusOK, gin.H{"result": models.AddressBook})
}

// GET /address
func GetAddress(c *gin.Context) {

	// TODO: order matching
	c.JSON(http.StatusOK, models.AddressBook)
}
