package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/victoryeo/quick-swap-front-end/backend/controllers"
)

func getRoot(context *gin.Context) {
	fmt.Print("getRoot")
	// Call the HTML method of the Context to render a template
	context.HTML(
		http.StatusOK,
		"index.html",
		// Pass the data that the page uses (in this case, 'title')
		gin.H{
			"title": "Home Page",
		},
	)
}

func main() {
	fmt.Print("Order Backend ", "started.\n")

	// golang array
	buildTags := []string{"cli_no_docs", "cli_docs"}
	buildTags = append(buildTags, "osusergo", "netgo")
	if len(buildTags) > 0 {
		log.Printf("buildTags > 0")
		log.Printf("%v", buildTags)
	}

	router := gin.Default()
	router.LoadHTMLGlob("templates/*")
	router.GET("/", getRoot)
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"POST", "GET"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	router.POST("/address", controllers.CreateAddress)
	router.GET("/address", controllers.GetAddress)

	router.Run("0.0.0.0:9090")
}
