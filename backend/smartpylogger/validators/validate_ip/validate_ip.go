package main

import (
	"encoding/json"
	"fmt"
	"os"
)

// Defining payload struct
type PayloadIP struct {
	APIKey         string                 `json:"api_key"`
	AppID          string                 `json:"app_id"`
	RequestMethod  string                 `json:"request_method"`
	RequestData    map[string]interface{} `json:"request_data"`
	AllowedOrigins []string               `json:"allowed_origins"`
	SenderIP       string                 `json:"sender_ip"`
	Timestamp      string                 `json:"timestamp"`
	Flag           int                    `json:"flag"`
}

// Function to check if sender_ip is in allowed_origins
func isIPAllowed(senderIP string, allowedOrigins []string) bool {
	for _, origin := range allowedOrigins {
		if origin == senderIP {
			return true
		}
	}
	return false
}

// Main function to validate IP origins - FATAL if unauthorized
func main() {
	// Check if the JSON payload is provided as a command line argument
	if len(os.Args) < 2 {
		fmt.Println("ERROR: No JSON payload provided")
		os.Exit(1)
	}

	// Read the JSON payload from command line argument
	payloadJSON := os.Args[1]

	// Parse JSON payload
	var payload PayloadIP
	err := json.Unmarshal([]byte(payloadJSON), &payload)
	if err != nil {
		fmt.Printf("ERROR: JSON parse error: %v\n", err)
		os.Exit(1)
	}

	// Check if sender_ip is in allowed_origins
	isAllowed := isIPAllowed(payload.SenderIP, payload.AllowedOrigins)

	// If IP not allowed, return fatal error and block request
	if !isAllowed {
		fmt.Printf("FATAL: Unauthorized IP address %s not in allowed origins %v\n",
			payload.SenderIP, payload.AllowedOrigins)
		os.Exit(1) // Fatal exit - blocks the request
	}

	// If IP is allowed, return success
	fmt.Println("IP validation passed")
	os.Exit(0)
}
