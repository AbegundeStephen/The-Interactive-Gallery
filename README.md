# 🖼️ The Interactive Gallery

**The Interactive Gallery** is a full-stack web application that allows users to browse beautiful images from the Unsplash API, view image details, and interact by leaving comments. Built with modern technologies and designed to showcase clean architecture, user-friendly interfaces, and solid API integration.

---

## 🧰 Tech Stack

### 🖥 Frontend
- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Axios for HTTP requests
- React Router for navigation
- React Hook Form or Formik for forms

### ⚙️ Backend
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) for data persistence
- Knex.js for database queries
- Axios for Unsplash API calls
- JWT for authentication (optional)
- bcrypt for password hashing

# Interactive Gallery Backend

A RESTful API backend for The Interactive Gallery built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **Image Management**: Fetch and cache images from Unsplash API
- **Comments System**: Add and retrieve comments for images
- **Like System**: Like/unlike images with duplicate prevention
- **Authentication**: JWT-based user authentication
- **Security**: Helmet.js, CORS, rate limiting, input validation
- **Database**: PostgreSQL with Knex query builder
- **TypeScript**: Full type safety throughout the application

## Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Copy `.env.example` to `.env` and update with your values:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=interactive_gallery
JWT_SECRET=your-jwt-secret
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

3. **Set up database**:
```bash
# Create database
createdb interactive_gallery

# Run migrations
npm run migrate
```

4. **Start development server**:
```bash
npm run dev
```

## API Endpoints

### Images
- `GET /api/images` - Get images (with pagination)
- `GET /api/images/:id` - Get single image
- `GET /api/images?q=search` - Search images

### Comments
- `POST /api/images/:id/comments` - Add comment
- `GET /api/images/:id/comments` - Get comments

### Likes
- `POST /api/images/:id/like` - Like image
- `GET /api/images/:id/likes` - Get likes count

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

## Project Structure

```
src/
├── config/          # Database and external service configs
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, etc.
├── migrations/      # Database migrations
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── server.ts        # Main application file
```

## Database Schema

### Users
- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password_hash`
- `created_at`, `updated_at`

### Images (Cache)
- `id` (PK, from Unsplash)
- `title`
- `description`
- `author`
- `author_username`
- `url_regular`, `url_thumb`, `url_full`
- `tags` (JSON array)
- `likes_count`
- `created_at`, `updated_at`

### Comments
- `id` (PK)
- `image_id` (FK to images)
- `user_id` (FK to users, nullable)
- `content`
- `author_name`
- `author_email`
- `created_at`, `updated_at`

### Likes
- `id` (PK)
- `image_id` (FK to images)
- `user_id` (FK to users, nullable)
- `ip_address`
- `created_at`, `updated_at`

## Security Features

- **Helmet.js**: HTTP header security
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schemas for all endpoints
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **SQL Injection Prevention**: Parameterized queries via Knex

## API Examples

### Get Images with Pagination
```bash
GET /api/images?page=1&limit=12
```

### Search Images
```bash
GET /api/images?q=nature&page=1&limit=12
```

### Add Comment
```bash
POST /api/images/abc123/comments
Content-Type: application/json

{
  "content": "Beautiful image!",
  "author_name": "John Doe",
  "author_email": "john@example.com"
}
```

### Like Image
```bash
POST /api/images/abc123/like
Authorization: Bearer <token>
```

### User Registration
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port | Yes |
| `DB_USER` | PostgreSQL username | Yes |
| `DB_PASSWORD` | PostgreSQL password | Yes |
| `DB_NAME` | PostgreSQL database name | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `UNSPLASH_ACCESS_KEY` | Unsplash API access key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run migrations
npm run migrate

# Run seeds (if any)
npm run seed
```

## Error Handling

The API uses consistent error response format:

```json
{
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Features Implemented

✅ **Core Requirements**
- Image fetching from Unsplash API
- Image details endpoint
- Comments CRUD operations
- Input validation

✅ **Bonus Features**
- Like system with duplicate prevention
- JWT authentication (signup/login)
- Pagination for all list endpoints
- Image search functionality

✅ **Security**
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting
- Input validation with Joi
- Password hashing with bcrypt

✅ **Advanced Features**
- Image caching in database
- Optional authentication for comments/likes
- IP-based like tracking for anonymous users
- Comprehensive error handling
- TypeScript throughout
- Clean architecture with services/controllers

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure database connection string
3. Set strong JWT secret
4. Configure CORS for your frontend domain
5. Set up SSL/TLS termination
6. Configure reverse proxy (nginx)
7. Set up monitoring and logging

## Testing

The API includes comprehensive error handling and validation. Test endpoints using tools like:
- Postman
- curl
- Thunder Client (VS Code)
- Insomnia

Example curl request:
```bash
curl -X GET "http://localhost:3000/api/images?page=1&limit=5" \
  -H "Content-Type: application/json"
```

This backend provides a solid foundation for The Interactive Gallery with all requested features implemented, including security best practices, proper error handling, and scalable architecture.

---

## 📁 Folder Structure

```bash
the-interactive-gallery/
│
├── frontend/           # React + TypeScript app
│   ├── public/
│   ├── src/
│   └── ...
│
├── backend/            # Node.js + Express.js API
│   ├── src/
│   └── ...
│
├── .gitignore
├── README.md
└── ...
