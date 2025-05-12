# 🎬 StreamBlaze - Full-Stack Media Streaming Platform

StreamBlaze is a comprehensive media streaming application that provides a YouTube-like experience with advanced features and robust architecture.

## 🌟 Project Overview

StreamBlaze is a full-stack media streaming platform designed to offer creators and viewers a seamless content sharing and consumption experience. From secure authentication to interactive features, StreamBlaze provides a complete solution for media sharing.

## 🚀 Project Repositories

- [Frontend]: [StreamBlaze Frontend](https://github.com/Amankumar-02/StreamBlaze-Frontend-UI)
- [Backend]: [StreamBlaze Backend](https://github.com/Amankumar-02/StreamBlaze-Backend)

---

## ✨ Key Features

### 🔐 Authentication & Security

- JWT-based secure authentication
- Password hashing with bcrypt
- Secure token management

### 📽️ Video Management

- Seamless video uploads
- Cloudinary integration for media storage
- Public/private video visibility
- Comprehensive video CRUD operations

### 🤝 Interactive Features

- Like and comment on videos
- Watch history tracking
- Subscription management
- User profile customization
- Tweet feature for upcoming posts

### 🗂️ Content Organization

- Personal video collections
- Playlist creation
- Liked videos section
- Content dashboard

---

## 📦 Tech Stack

### Frontend

- **React.js** - UI library for building the interface
- **Vite** - Next generation frontend tooling
- **Redux & Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form validation and handling
- **React Icons** - Icon components
- **TailwindCSS** - Utility-first CSS framework

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Cloud storage for media files
- **CORS** - Cross-Origin Resource Sharing
- **EJS** - Embedded JavaScript templates
- **Multer** - Middleware for handling multipart/form-data

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/docs/) (local or Atlas)
- [Cloudinary](https://cloudinary.com/documentation) (account for media storage)
- npm or Yarn
- [Git](https://git-scm.com/)
- Frontend running at: `http://localhost:5173`
- Backend running at: `http://localhost:3000`

---

## 📦 Full Project Setup

```bash
1. Clone Repositories

bash

# Clone Frontend
git clone https://github.com/Amankumar-02/StreamBlaze---Video-streaming-app
cd frontend

# Clone Backend
git clone https://github.com/Amankumar-02/StreamBlaze---Video-streaming-app
cd backend

2. Backend Setup

I. Install dependencies:

bash
cd backend
npm install

II. Create .env file:

PORT = 3000
MONGODB_URL = "Your mongodb cluster url"
ACCESS_TOKEN_SECRET = ""
ACCESS_TOKEN_EXPIRY = 1d
REFRESH_TOKEN_SECRET = ""
REFRESH_TOKEN_EXPIRY = 10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional
CORS_ORIGIN=http://localhost:5173, *

III. Start backend server:

bash
npm start
# or
yarn start

3. Frontend Setup

I. Install dependencies:

bash
cd frontend
npm install

II. Create .env file:

VITE_BACKEND_URL=http://localhost:3000/api/v1

Start frontend development server:

bash
npm run dev
```

---

### 📋 Main API Endpoints

### 🔐 Auth

* `POST /api/v1/users/register` - Register a new user
* `POST /api/v1/users/login` - Login and receive JWT
* `POST /api/v1/users/logout` - Logout and clear JWT
* `POST /api/v1/users/refresh-token` - Refresh authentication token

### 👤 User

* `POST /api/v1/users/change-password` - Change Password
* `PATCH /api/v1/users/update-user` - Update username, fullname
* `PATCH /api/v1/users/update-avatar` - Update avatar
* `PATCH /api/v1/users/update-coverImg` - Update cover image

### 🎥 Videos

* `GET /api/v1/video/` - Get all public videos
* `POST /api/v1/video/` - Upload a new video
* `GET /api/v1/video/v/:videoId` - Get video by ID
* `DELETE /api/v1/video/v/:videoId` - Delete a video
* `PATCH /api/v1/video/v/:videoId` - Update video details
* `PATCH /api/v1/video/toggle/publish/:videoId` - Toggle video visibility

### 👍 Interactions - Likes, Comment, Tweet

❤️ Likes
* `POST /api/v1/likes/toggle/v/:videoId` - Toggle Video Like
* `POST /api/v1/likes/toggle/c/:commentId` - Toggle comment Like
* `POST /api/v1/likes/toggle/t/:tweetId` - Toggle tweet Like
* `GET /api/v1/likes/videos` - Get all liked videos

💬 Comment
* `GET /api/v1/comment/v/:videoId` - Get all comments for a video
* `POST /api/v1/comment/v/:videoId` - Add comment to a video
* `PATCH /api/v1/comment/c/:commentId` - Update a comment
* `DELETE /api/v1/comment/c/:commentId` - Delete a comment

📢 Tweet
* `POST /api/v1/tweet` - Post a tweet
* `GET /api/v1/tweet/user/:userId` - Get all user posted tweets
* `PATCH /api/v1/tweet/user/:userId` - Update a tweet
* `DELETE /api/v1/tweet/:tweetId` - Delete a tweet

### 📀 Playlist

* `POST /api/v1/playlist` - Create playlist
* `GET /api/v1/playlist/p/:playlistId` - Get playlist by ID
* `PATCH /api/v1/playlist/p/:playlistId` - Update a playlist
* `DELETE /api/v1/playlist/p/:playlistId` - Delete a playlist
* `PATCH /api/v1/playlist/add/:videoId/:playlistId` - Add a video to playlist
* `PATCH /api/v1/playlist/remove/:videoId/:playlistId` - Remove a video from playlist
* `GET /api/v1/playlist/user/:userId` - Get all user playlist

### 📊 User Content

* `GET /api/v1/dashboard/stats` - Get user dashboard stats
* `GET /api/v1/dashboard/videos` - Get user dashboard videos
* `GET /api/v1/users/watch-history` - Get user watch history
* `GET /api/v1/subscriptions/c/:channelId` - Get user channel subscribers
* `POST /api/v1/subscriptions/c/:channelId` - Toggle subscriptions
* `GET /api/v1/subscriptions/u/:subscriberId` - Get subscribed channels

### 🧩 Middleware / Utils

* `verifyJWT` — Verifies JWT for protected routes
* `upload` - Handles file uploads with Multer
* `asyncHandler` - Manages asynchronous route handlers
* `responseHandler` - Centralized response handling
* `errorHandler` - Centralized error handling
* `uploadOnCloudinary` - Handles media uploading with cloudinary
* `deleteOnCloudinary` - Delete media from cloudinary

---

## 🌈 Frontend Navigation Flow

- **Home** - Discover trending and recommended videos
- **Liked Videos** - Videos you've liked
- **History** - Recently watched videos
- **My Content** - Videos you've uploaded
- **Collections** - Your curated playlists
- **Subscriptions** - Content from channels you follow

## 🚧 Future Roadmap

- Live streaming integration
- Advanced video recommendation algorithm
- Multi-language support
- Monetization features
- Enhanced analytics dashboard

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface

---

## 🤝 Contributing

- Fork the repository
- Create your feature branch
- Commit your changes
- Push to the branch
- Open a Pull Request

---

# Happy Streaming! 🎥✨
