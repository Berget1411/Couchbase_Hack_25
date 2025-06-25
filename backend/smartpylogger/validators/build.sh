#!/bin/bash

# Build script for Go validators
# Compiles both validators for Linux, Mac, and Windows

cd "$(dirname "$0")"

echo "Building Go validators..."

# Build content validator (validate_content/validate_content.go)
echo "Building content validator..."
GOOS=linux GOARCH=amd64 go build -o contains_linux validate_content/validate_content.go
GOOS=darwin GOARCH=amd64 go build -o contains_mac validate_content/validate_content.go
GOOS=windows GOARCH=amd64 go build -o contains_windows.exe validate_content/validate_content.go

# Build IP validator (validate_ip/validate_ip.go)
echo "Building IP validator..."
GOOS=linux GOARCH=amd64 go build -o ip_validator_linux validate_ip/validate_ip.go
GOOS=darwin GOARCH=amd64 go build -o ip_validator_mac validate_ip/validate_ip.go
GOOS=windows GOARCH=amd64 go build -o ip_validator_windows.exe validate_ip/validate_ip.go

echo "Build complete!"
echo "Generated files:"
ls -la *_linux *_mac *.exe 2>/dev/null || echo "No executables found" 