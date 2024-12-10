#!/bin/bash

# Base URL for local development
BASE_URL="http://localhost:8888/.netlify/functions"

echo "Testing Hello World function..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"aaaa"}' \
  "${BASE_URL}/hello-world"
echo -e "\n"

echo "Testing FCM Notification function..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"token":"your_fcm_token","title":"Test Title","body":"Test Body"}' \
  "${BASE_URL}/send-fcm-notification"
echo -e "\n"

echo "Testing Firestore Notification function..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"Test notification message"}' \
  "${BASE_URL}/send-firestore-notification"
echo -e "\n"