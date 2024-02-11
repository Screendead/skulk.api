# skulk.dev API Guide

This guide will help you get started with integrating our API into your applications. Our API provides access to [Philosophical Fox](https://opensea.io/collection/philosophicalfoxes)-related resources, including thumbnails of various sizes and formats.

## Table of Contents

- Getting Started
- API Endpoints
  - General Endpoints
  - Fox Thumbnails
- Usage Examples
  - Fetching a Fox Thumbnail
- Error Handling
- Contributing
- License

## Getting Started

Before you can start using the API, you need to set up your environment:

1. Node.js: Ensure you have Node.js installed on your machine. The API is built with Express, which runs on Node.js.
2. Firebase Admin SDK: This project uses Firebase Admin SDK to interact with Firebase Storage. Make sure you have configured Firebase in your project.

## API Endpoints

### General Endpoints

- GET /: Returns a welcome message from the skulk.dev API.
- GET /v1/: Returns a versioned welcome message, indicating you're interacting with version 1 of the API.

### Fox Thumbnails

- GET /v1/foxes/:foxID/thumbnails/:fileType/:size: Fetches a thumbnail for a specific fox by its ID, file type, and size.

Parameters:

- foxID: The unique identifier for the fox.
- fileType: The format of the thumbnail (e.g., jpeg, webp).
- size: The dimensions of the thumbnail (e.g., 64x64, 128x128).

## Usage Examples

### Fetching a Fox Thumbnail

To fetch a thumbnail for a fox with ID 123, in jpeg format, and size 128x128:

`curl https://skulk.dev/v1/foxes/123/thumbnails/jpeg/128x128`

This will return the requested thumbnail image if it exists.

## Error Handling

The API uses conventional HTTP response codes to indicate success or failure of an API request. In general:

- 200 OK - The request was successful.
- 400 Bad Request - The request was malformed or invalid.
- 404 Not Found - The requested resource was not found.
- 500 Internal Server Error - An error occurred on the server side.
