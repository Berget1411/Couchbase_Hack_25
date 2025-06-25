package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

type Payload struct {
	APIKey         string                 `json:"api_key"`
	AppID          string                 `json:"app_id"`
	RequestMethod  string                 `json:"request_method"`
	RequestData    map[string]interface{} `json:"request_data"`
	AllowedOrigins []string               `json:"allowed_origins"`
	SenderIP       string                 `json:"sender_ip"`
	Timestamp      string                 `json:"timestamp"`
	Flag           int                    `json:"flag"`
}

func loadBannedWords(filename string) ([]string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var bannedWords []string
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		// Skip empty lines and comments
		if line != "" && !strings.HasPrefix(line, "#") {
			bannedWords = append(bannedWords, line)
		}
	}

	return bannedWords, scanner.Err()
}

func contains(content string, bannedWords []string) bool {
	contentLower := strings.ToLower(content)

	for _, word := range bannedWords {
		if strings.Contains(contentLower, strings.ToLower(word)) {
			return true
		}
	}
	return false
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("ERROR: No JSON payload provided")
		os.Exit(1)
	}

	payloadJSON := os.Args[1]

	// Load banned words from file
	bannedWords, err := loadBannedWords("bad_words")
	if err != nil {
		fmt.Printf("ERROR: Failed to load banned words: %v\n", err)
		os.Exit(1)
	}

	// Parse JSON payload
	var payload Payload
	err = json.Unmarshal([]byte(payloadJSON), &payload)
	if err != nil {
		fmt.Printf("ERROR: JSON parse error: %v\n", err)
		os.Exit(1)
	}

	// Convert request_data to string for checking
	requestDataBytes, _ := json.Marshal(payload.RequestData)
	requestDataStr := string(requestDataBytes)

	if contains(requestDataStr, bannedWords) {
		fmt.Println("INVALID: Banned content detected")
		os.Exit(1)
	}

	fmt.Println("VALID")
	os.Exit(0)
}
