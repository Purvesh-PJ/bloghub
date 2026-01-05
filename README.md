# BlogHub

A full-stack blogging platform built with the MERN stack. Create, publish, and discover blog posts with a clean, enterprise-grade interface.

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Express Validator

**Frontend:**
- React 19 + Vite
- Radix UI Themes
- React Query (TanStack)
- Zustand (State Management)
- React Router v7
- Lucide Icons
- React Quill (Rich Text Editor)

## Features

- User authentication (signup, signin, JWT refresh tokens)
- Create, edit, and delete blog posts
- Rich text editor with formatting options
- Categories and post organization
- Comments and replies
- Like/unlike posts
- User profiles with follow/unfollow
- Search functionality
- User analytics dashboard
- Admin panel for content management
- Responsive design

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Purvesh-PJ/blogging_platform.git
cd blogging_platform
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in the `backend` directory:

```env
DB_URI=mongodb://127.0.0.1:27017/bloghub
PORT=4000
JWT_SECRET=your_secure_jwt_secret_key_here
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

Create `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:4000
```

### 4. Seed Database (Optional)

Populate the database with sample data:

```bash
cd backend
npm run seed
```

This creates:
- 10 sample users with posts
- Categories, comments, likes, and followers
- Test accounts:
  - Regular user: `john@example.com` / `password123`
  - Admin user: `admin@bloghub.com` / `admin123`

## Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:4000`

### Start Frontend

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:3000`

## Project Structure

```
blogging_platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Auth and validation middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── index.js         # Entry point
│   └── seed.js          # Database seeder
│
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service functions
│   │   ├── store/       # Zustand store
│   │   ├── styles/      # Global styles
│   │   ├── config/      # Axios configuration
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── index.html
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user
- `POST /auth/refreshToken` - Refresh access token

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get single post
- `POST /posts` - Create post (auth required)
- `PUT /posts/:id` - Update post (auth required)
- `DELETE /posts/:id` - Delete post (auth required)

### Users
- `GET /users/getUser` - Get current user
- `PUT /users/setUser` - Update user profile
- `GET /users/getUserPosts` - Get user's posts
- `POST /users/followUser` - Follow a user
- `POST /users/unfollowUser` - Unfollow a user

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin)
- `POST /categories/attachCategories` - Attach categories to post

### Comments
- `POST /comments` - Create comment
- `POST /comments/replies` - Reply to comment

### Likes
- `POST /likes` - Like a post
- `DELETE /likes/:postId` - Unlike a post

### Search
- `GET /search/:query` - Search posts

## Scripts

### Backend
```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm run seed    # Seed database with sample data
npm run lint    # Run ESLint
npm run format  # Format code with Prettier
```

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
npm run format  # Format code with Prettier
```

## License

MIT
