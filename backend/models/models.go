package models

type AddressInput struct {
	Type    string `json:"type" binding:"required"`
	Address string `json:"address" binding:"required"`
}

var addressBook []AddressInput
