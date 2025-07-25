# Dokumentasi API 


## Endpoint Autentikasi

### POST /register
Mendaftarkan pengguna baru.

**Request Body:**
```json
{
  "name": "admin",
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "admin",
  "email": "admin@example.com"
}
```

**Error Response:**
- **400 Bad Request**: Jika input tidak valid.
  ```json
  {
    "message": ["Name is required", "Email is required"]
  }
  
  ```
    ```json
  {
    "message": ["Invalid email format"]
  }
  ```


---

### POST /login
Login pengguna dan mendapatkan access token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Error Response:**
- **401 Unauthorized**: Jika email/password salah.
  ```json
  {
    "message": "Invalid email/password"
  }
  ```
---

### POST /google-login
Login menggunakan Google OAuth token.


**Request Body:**
```json
{
  "googleToken": "google_oauth_token_here"
}
```

**Response (200/201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response:**
- **401 Unauthorized**: Jika Google token tidak valid.
  ```json
  {
    "message": "Invalid google token"
  }
  ```


---

## Endpoint Lagu

### GET /songs
Mendapatkan semua lagu dengan pagination dan pencarian.

**Query Parameters:**
- `page` (opsional): Nomor halaman, default: 1
- `search` (opsional): Cari berdasarkan judul atau artis (tidak case-sensitive)


**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "songs": [
    {
      "id": 1,
      "title": "Judul Lagu",
      "artist": "Nama Artis",
      "coverUrl": "http://example.com/cover.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```
**Error Response:**
- **401 Unauthorized**: Jika token tidak valid.
  ```json
  {
    "message": "Invalid token"
  }
  ```

---

### GET /songs/:id
Mendapatkan lagu berdasarkan ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Judul Lagu",
  "artist": "Nama Artis",
  "coverUrl": "http://example.com/cover.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
**Error Response:**
- **404 Not Found**: Jika lagu tidak ditemukan.
  ```json
  {
    "message": "Song not found"
  }
  ```


---

## Endpoint Playlist

### GET /playlists
Mendapatkan semua playlist untuk pengguna yang sudah login.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Playlist Saya",
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "Songs": [
      {
        "id": 1,
        "title": "Judul Lagu",
        "artist": "Nama Artis",
        "coverUrl": "http://example.com/cover.jpg"
      }
    ]
  }
]
```
**Error Response:**
- **401 Unauthorized**: Jika token tidak valid.
  ```json
  {
    "message": "Invalid token"
  }
  ```

---

### POST /playlists
Membuat playlist baru.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Playlist Baru Saya"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Playlist Baru Saya",
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
**Error Response:**
- **400 Bad Request**: Jika nama playlist tidak diberikan.
  ```json
  {
    "message": "Playlist name required"
  }
---

### GET /playlists/:id
Mendapatkan playlist berdasarkan ID beserta lagu-lagunya.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Playlist Saya",
  "songs": [
    {
      "id": 1,
      "title": "Judul Lagu",
      "artist": "Nama Artis",
      "coverUrl": "http://example.com/cover.jpg"
    }
  ]
}
```
**Error Response:**
- **404 Not Found**: Jika playlist tidak ditemukan.
  ```json
  {
    "message": "Playlist not found"
  }

---

### PUT /playlists/:id
Mengubah nama playlist.


**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Nama Playlist Baru"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Nama Playlist Baru",
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
**Error Response:**
- **404 Not Found**: Jika playlist tidak ditemukan.
  ```json
  {
    "message": "Playlist not found"
  }
  ```


---

### DELETE /playlists/:id
Menghapus playlist.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Song removed from playlist"
}
```
**Error Response:**
- **404 Not Found**: Jika playlist tidak ditemukan.
  ```json
  {
    "message": "Playlist not found"
  }
---

### POST /playlists/:playlistId/songs
Menambahkan lagu ke playlist.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "songId": 1
}
```

**Response (201):**
```json
{
  "message": "Song added to playlist"
}
```

**Error Response:**
- **404 Not Found**: Jika playlist atau lagu tidak ditemukan.
  ```json
  {
    "message": "Playlist not found"
  }

---

## Endpoint AI/Gemini

### POST /ai/gemini-lyric
Menghasilkan lirik lagu menggunakan Gemini AI.


**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Judul Lagu",
  "artist": "Nama Artis"
}
```

**Response (200):**
```json
{
  "lyric": "Verse 1:\nLirik lagu di sini...\n\nChorus:\nLirik chorus di sini..."
}
```
---

## Response Error

### 400 Bad Request
**Untuk input tidak valid:**
```json
{
  "message": "Playlist name required"
}
```

**Untuk error validasi Sequelize:**
```json
{
  "message": ["Name is required", "Email is required"]
}
```

### 401 Unauthorized
**Token tidak valid:**
```json
{
  "message": "Invalid token"
}
```

**Google token tidak valid:**
```json
{
  "message": "Invalid google token"
}
```

**Email/password salah:**
```json
{
  "message": "Invalid email/password"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden access"
}
```

### 404 Not Found
**Playlist tidak ditemukan:**
```json
{
  "message": "Playlist not found"
}
```

**Song tidak ditemukan:**
```json
{
  "message": "Song not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

