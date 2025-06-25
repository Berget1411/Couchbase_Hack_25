package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

// Defining payload struct
type PayloadWords struct {
	APIKey         string                 `json:"api_key"`
	AppID          string                 `json:"app_id"`
	RequestMethod  string                 `json:"request_method"`
	RequestData    map[string]interface{} `json:"request_data"`
	AllowedOrigins []string               `json:"allowed_origins"`
	SenderIP       string                 `json:"sender_ip"`
	Timestamp      string                 `json:"timestamp"`
	Flag           int                    `json:"flag"`
}

// loading banned words from the file
func loadBannedWords(filename string) ([]string, error) {
	// Open the file containing banned words
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Read the file line by line and store the words in a slice
	var bannedWords []string
	scanner := bufio.NewScanner(file)

	// Use a scanner to read the file line by line and remove comments
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		// Skip empty lines and comments
		if line != "" && !strings.HasPrefix(line, "#") {
			// Remove trailing comma if present
			line = strings.TrimSuffix(line, ",")
			if line != "" {
				bannedWords = append(bannedWords, line)
			}
		}
	}

	return bannedWords, scanner.Err()
}

// Function to check if the content contains any banned words
func contains(content string, bannedWords []string) bool {
	contentLower := strings.ToLower(content)

	for _, word := range bannedWords {
		if strings.Contains(contentLower, strings.ToLower(word)) {
			return true // Return true if any banned word is found
		}
	}
	return false // Return false if no banned words are found
}

// Main function to validate the JSON payload
func main() {
	// Check if the JSON payload is provided as a command line argument
	if len(os.Args) < 2 {
		fmt.Println("ERROR: No JSON payload provided")
		os.Exit(1)
	}

	// Read the JSON payload from command line argument
	payloadJSON := os.Args[1]

	// Load banned words from file
	bannedWords, err := loadBannedWords("bad_words")
	if err != nil {
		fmt.Printf("ERROR: Failed to load banned words: %v\n", err)
		os.Exit(1)
	}

	// Parse JSON payload
	var payload PayloadWords
	err = json.Unmarshal([]byte(payloadJSON), &payload)
	if err != nil {
		fmt.Printf("ERROR: JSON parse error: %v\n", err)
		os.Exit(1)
	}

	// Validation 1: Check if request_data contains banned words
	requestDataBytes, _ := json.Marshal(payload.RequestData)
	requestDataStr := string(requestDataBytes)
	hasBannedWords := contains(requestDataStr, bannedWords)

	// If validation fails, set flag to 1
	if hasBannedWords {
		payload.Flag = 1

		// Create response with updated flag
		response := map[string]interface{}{
			"api_key":         payload.APIKey,
			"app_id":          payload.AppID,
			"request_method":  payload.RequestMethod,
			"request_data":    payload.RequestData,
			"allowed_origins": payload.AllowedOrigins,
			"sender_ip":       payload.SenderIP,
			"timestamp":       payload.Timestamp,
			"flag":            payload.Flag,
		}

		// Convert back to JSON and print
		responseJSON, _ := json.Marshal(response)
		fmt.Println(string(responseJSON))
		os.Exit(1)
	}

	// If validation passes, keep flag as 0 and return original payload
	response := map[string]interface{}{
		"api_key":         payload.APIKey,
		"app_id":          payload.AppID,
		"request_method":  payload.RequestMethod,
		"request_data":    payload.RequestData,
		"allowed_origins": payload.AllowedOrigins,
		"sender_ip":       payload.SenderIP,
		"timestamp":       payload.Timestamp,
		"flag":            payload.Flag, // This will be 0
	}

	responseJSON, _ := json.Marshal(response)
	fmt.Println(string(responseJSON))
	os.Exit(0)
}
