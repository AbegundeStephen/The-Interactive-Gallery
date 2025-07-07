# 🖼️ The Interactive Gallery

**The Interactive Gallery** is a modern full-stack web application that provides an immersive image browsing experience using the Unsplash API. Users can explore beautiful images, view detailed information, interact through comments and likes, and enjoy a seamless responsive interface.

## 🌟 Features

- **Image Gallery**: Browse high-quality images from Unsplash API
- **Image Details**: View comprehensive image information and metadata
- **Interactive Comments**: Add and view comments on images
- **Like System**: Like/unlike images with duplicate prevention
- **User Authentication**: Secure JWT-based user registration and login
- **Search Functionality**: Search images by keywords
- **Responsive Design**: Optimized for all device sizes
- **Real-time Notifications**: Toast notifications for user feedback

---

## 🧰 Tech Stack

### 🖥️ Frontend
- **Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) for fast development and building
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **HTTP Client**: Axios for API communication
- **Routing**: React Router for navigation
- **Form Handling**: React Hook Form or Formik
- **Authentication**: useContext as AuthProvider
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) library for toast notifications

### ⚙️ Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Language**: TypeScript for type safety
- **Database**: [PostgreSQL](https://www.postgresql.org/) with Knex.js query builder
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Integration**: Axios for Unsplash API calls
- **Environment Management**: Environment-based configuration (development/production)
- **Mock Data**: Development environment supports mock data fallback

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Unsplash API access key

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/interactive-gallery.git
cd interactive-gallery
```

2. **Install dependencies**:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Configuration**:

Create `.env` file in the backend directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development  # or production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=interactive_gallery

# Authentication
JWT_SECRET=your-secure-jwt-secret-key

# API Configuration
UNSPLASH_ACCESS_KEY=your-unsplash-access-key

# CORS Configuration
FRONTEND_URL=http://localhost:3001
```

4. **Database Setup**:
```bash
# Create database
createdb interactive_gallery

# Run migrations
cd backend
npm run migrate

# (Optional) Run seeds
npm run seed
```

5. **Start the application**:
```bash
# Start backend server (TypeScript compiled to dist/src/server.js)
cd backend
npm start

# Start frontend development server (Vite)
cd frontend
npm run dev
```

**Live Application URLs**:
- **Frontend**: [https://the-interactive-gallery-zeta.vercel.app](https://the-interactive-gallery-zeta.vercel.app)
- **Backend API**: [https://the-interactive-gallery-3r7v.onrender.com](https://the-interactive-gallery-3r7v.onrender.com)

---

## 📁 Project Structure

```
the-interactive-gallery/
│
├── frontend/                    # React + TypeScript frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React contexts (AuthProvider)
│   │   ├── pages/              # Application pages
│   │   ├── services/           # API service layer
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── types/              # TypeScript type definitions
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                     # Node.js + Express.js API
│   ├── src/
│   │   ├── config/             # Database and service configurations
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Authentication, validation, etc.
│   │   ├── migrations/         # Database schema migrations
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic layer
│   │   ├── types/              # TypeScript type definitions
│   │   └── server.ts           # Main application entry point
│   ├── dist/                   # Compiled TypeScript output
│   │   └── src/
│   │       └── server.js       # Compiled main server file
│   └── package.json
│
├── README.md
└── package.json
```

---

## 🔌 API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://the-interactive-gallery-3r7v.onrender.com/api`

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Images Endpoints

#### Get Images (with pagination)
```http
GET /api/images?page=1&limit=12
```

#### Search Images
```http
GET /api/images?q=nature&page=1&limit=12
```

#### Get Single Image
```http
GET /api/images/:id
```

### Comments Endpoints

#### Add Comment
```http
POST /api/images/:id/comments
Content-Type: application/json

{
  "content": "Beautiful image!",
  "author_name": "John Doe",
  "author_email": "john@example.com"
}
```

#### Get Comments
```http
GET /api/images/:id/comments
```

### Likes Endpoints

#### Like Image
```http
POST /api/images/:id/like
Authorization: Bearer <token>
```

#### Get Likes Count
```http
GET /api/images/:id/likes
```

### Authentication Endpoints

#### User Registration
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

---

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Images Table (Cache)
```sql
CREATE TABLE images (
  id VARCHAR(255) PRIMARY KEY,  -- Unsplash image ID
  title VARCHAR(255),
  description TEXT,
  author VARCHAR(255),
  author_username VARCHAR(255),
  url_regular VARCHAR(500),
  url_thumb VARCHAR(500),
  url_full VARCHAR(500),
  tags JSON,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  image_id VARCHAR(255) REFERENCES images(id),
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Likes Table
```sql
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  image_id VARCHAR(255) REFERENCES images(id),
  user_id INTEGER REFERENCES users(id),
  ip_address INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(image_id, user_id),
  UNIQUE(image_id, ip_address)
);
```

---

## 🛡️ Security Features

- **HTTP Security Headers**: Helmet.js for comprehensive security
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP address
- **Input Validation**: Joi schemas for all API endpoints
- **Password Security**: bcrypt with salt rounds for password hashing
- **JWT Authentication**: Secure token-based authentication
- **SQL Injection Prevention**: Parameterized queries via Knex.js
- **Environment-based Configuration**: Separate development and production settings

---

## 🔧 Development

### Available Scripts

#### Backend
```bash
# Development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server (runs dist/src/server.js)
npm start

# Run database migrations
npm run migrate

# Run database seeds
npm run seed

# TypeScript type checking
npm run type-check
```

#### Frontend
```bash
# Development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

### Environment Modes

The application supports different environment modes:

#### Development Mode
- `NODE_ENV=development`
- Uses mock data fallback when API is unavailable
- Detailed error logging
- Hot reload enabled

#### Production Mode
- `NODE_ENV=production`
- Uses live Unsplash API
- Optimized error handling
- Performance optimizations enabled

### API Service Configuration

The `apiService` automatically determines data source based on environment:
- **Development**: Falls back to mock data if API is unavailable
- **Production**: Uses live Unsplash API exclusively

---

## 📱 Features Implemented

### ✅ Core Requirements
- [x] Image fetching from Unsplash API
- [x] Image gallery with pagination
- [x] Image details view
- [x] Comments system (CRUD operations)
- [x] Input validation and sanitization
- [x] Responsive design

### ✅ Bonus Features
- [x] Like system with duplicate prevention
- [x] JWT-based user authentication
- [x] User registration and login
- [x] Image search functionality
- [x] Real-time toast notifications
- [x] Environment-based configuration

### ✅ Security & Performance
- [x] Comprehensive security headers
- [x] CORS configuration
- [x] Rate limiting
- [x] Password hashing
- [x] Image caching system
- [x] TypeScript throughout
- [x] Clean architecture pattern

---

## 🚀 Production Deployment

### Live Application
- **Frontend**: Deployed on [Vercel](https://vercel.com/) - [https://the-interactive-gallery-zeta.vercel.app](https://the-interactive-gallery-zeta.vercel.app)
- **Backend**: Deployed on [Render](https://render.com/) - [https://the-interactive-gallery-3r7v.onrender.com](https://the-interactive-gallery-3r7v.onrender.com)

### Backend Deployment (Render)
1. Set `NODE_ENV=production`
2. Configure production database connection
3. Set strong JWT secret (32+ characters)
4. Configure CORS for frontend domain
5. Set up SSL/TLS termination
6. Configure reverse proxy (nginx/Apache)
7. Set up monitoring and logging
8. Configure process manager (PM2)

### Frontend Deployment (Vercel)
1. Update API base URL for production
2. Build optimized production bundle (`npm run build`)
3. Configure static file serving
4. Set up CDN for assets
5. Configure proper caching headers

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your-serverless-postgress-connection-string
JWT_SECRET=your-super-secure-jwt-secret-key
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
FRONTEND_URL=https://the-interactive-gallery-zeta.vercel.app
```

---

## 🧪 Testing

### API Testing Tools
- **Postman**: Complete API testing suite
- **curl**: Command-line testing
- **Thunder Client**: VS Code extension
- **Insomnia**: REST client

### Example API Requests

#### Get Images
```bash
curl -X GET "https://the-interactive-gallery-3r7v.onrender.com/api/images?page=1&limit=5" \
  -H "Content-Type: application/json"
```

#### Add Comment
```bash
curl -X POST "https://the-interactive-gallery-3r7v.onrender.com/api/images/abc123/comments" \
  -H "Content-Type: application/json" \
  -d '{"content": "Amazing photo!", "author_name": "Jane Doe", "author_email": "jane@example.com"}'
```

#### User Authentication
```bash
curl -X POST "https://the-interactive-gallery-3r7v.onrender.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

---

## 🐛 Error Handling

### Consistent Error Response Format
```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com/) for providing beautiful, high-quality images
- [Sonner](https://sonner.emilkowal.ski/) for elegant toast notifications
- React and Node.js communities for excellent documentation


---

## 📞 Support

For support, email timilehin18@gmail.com.

---

**Built with ❤️ by Abegunde Oluwatimilehin Stephen**