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
	SessionID      string                 `json:"session_id"`
	AppName        string                 `json:"app_name"`
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
	os.Stderr.WriteString("DEBUG: content =" + content)
	// fmt.Println("DEBUG: bannedWords =", bannedWords)
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

	payloadJSON := os.Args[1]

	// Default path
	bannedWordsPath := "bad_words.txt"
	// If a second argument is provided, use it as the banned words file
	if len(os.Args) >= 3 {
		bannedWordsPath = os.Args[2]
	}

	bannedWords, err := loadBannedWords(bannedWordsPath)
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
	requestDataStr := fmt.Sprintf("%v", payload.RequestData)
	// fmt.Println("DEBUG: request_data =", requestDataStr)
	// os.Stderr.WriteString("DEBUG: request_data = " + requestDataStr + "\n")
	hasBannedWords := contains(requestDataStr, bannedWords)

	if hasBannedWords {
		payload.Flag = 1
		// Print JSON and exit 1
		output, _ := json.Marshal(payload)
		fmt.Println(string(output))
		os.Exit(1)
	}

	// If no banned words, print JSON and exit 0
	output, _ := json.Marshal(payload)
	fmt.Println(string(output))
	os.Exit(0)
}
