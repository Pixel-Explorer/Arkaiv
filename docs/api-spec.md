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
Upload a JPEG file and store metadata. This endpoint requires an
`Authorization: Bearer <token>` header containing a valid Supabase session
token.

- `file` – multipart form field

### Response
```json
{
  "_id": "<mongoId>",
  "ev": 8.5,
  "storagePath": "<firebase path>",
  "publicUrl": "<public url>"
}
```

## GET `/feed`
Return recent images.

### Response
```json
[
  { "_id": "1", "ev": 10.2, "storagePath": "...", "publicUrl": "..." }
]
```
