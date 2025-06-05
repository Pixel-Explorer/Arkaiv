# API Specification

Base URL: `/api`

## POST `/register-user`
Create a new user.

### Request Body
```json
{
  "email": "user@example.com",
  "name": "Jane Doe"
}
```

### Response
```json
{
  "_id": "<mongoId>",
  "email": "user@example.com",
  "name": "Jane Doe"
}
```

## POST `/upload-image`
Upload a JPEG file and store metadata.

- `file` – multipart form field
- `userId` – ID of the uploader

### Response
```json
{
  "_id": "<mongoId>",
  "ev": 8.5,
  "storagePath": "<firebase path>"
}
```

## GET `/feed`
Return recent images.

### Response
```json
[
  { "_id": "1", "ev": 10.2, "storagePath": "..." }
]
```
