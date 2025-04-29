#!/bin/bash

# Copies .env from the project root to ~/.habits.env for the habits CLI
set -e

# Define paths
PROJECT_ENV="./.env"
HOME_ENV="$HOME/.habits.env"

# Check if .env exists in the project root
if [ ! -f "$PROJECT_ENV" ]; then
  echo "Error: .env file not found in the project root directory."
  exit 1
fi

# Check if .env contains DATABASE_URL
if ! grep -q "^DATABASE_URL=" "$PROJECT_ENV"; then
  echo "Error: .env file does not contain DATABASE_URL."
  exit 1
fi

# Copy .env to ~/.habits.env
cp "$PROJECT_ENV" "$HOME_ENV"
chmod 600 "$HOME_ENV" # Set secure permissions

echo "Success: Copied .env to ~/.habits.env"
echo "You can now use the 'habits' command from any directory."