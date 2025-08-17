# 📝 Blogging Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![MERN Stack](https://img.shields.io/badge/stack-MERN-red.svg)
![Status](https://img.shields.io/badge/status-in%20development-yellow.svg)

A modern MERN stack blogging platform that allows users to create, share, and discover blog posts and articles. Share your knowledge and experiences with the world through this intuitive platform.

## 📋 Table of Contents
- [📝 Blogging Platform](#-blogging-platform)
  - [📋 Table of Contents](#-table-of-contents)
  - [🔍 Overview](#-overview)
  - [✨ Features](#-features)
  - [🚀 Installation](#-installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [💻 Development](#-development)
    - [Running the Application](#running-the-application)
    - [Development Workflow](#development-workflow)
  - [🤝 Contributing](#-contributing)
  - [📊 Project Status](#-project-status)
    - [✅ Completed](#-completed)
    - [🔄 In Progress](#-in-progress)
    - [📝 Todo](#-todo)
    - [⚠️ Known Issues](#️-known-issues)
  - [📄 License](#-license)

## 🔍 Overview

This blogging platform is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and provides a seamless experience for content creators and readers alike. Users can create accounts, publish blog posts, and interact with content from other users.

## ✨ Features

- 🔐 User authentication and authorization
- ✍️ Create, edit, and delete blog posts
- 📝 Rich text editor for content creation
- 💬 Comment system for reader engagement
- 📱 Responsive design for all devices
- 👤 User profiles and dashboards

## 🚀 Installation

### Prerequisites
Ensure you have the following software installed:
- Node.js (v14 or later)
- npm or yarn
- MongoDB (v4 or later)

### Steps

1. **Clone the repository:**
```sh
git clone https://github.com/your-username/blogging_platform.git
```

2. **Navigate to the project directory:**
```sh
cd blogging_platform
```

3. **Install server dependencies:**
```sh
cd server
npm install
# or
yarn install
```

4. **Install client dependencies:**
```sh
cd ../client
npm install
# or
yarn install
```

5. **Set up environment variables:**
Create a `.env` file in the `server` directory and add the following:
```sh
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```
   
## 💻 Development

### Running the Application

1. **Start the server:**
```sh
cd server
npm start
# or
yarn start
```

2. **Start the client:**
In a new terminal window, navigate to the client directory:
```sh
cd client
npm start
# or
yarn start
```

3. **Open the application:**
Open your web browser and go to:
```
http://localhost:3000
```

### Development Workflow

- 🖥️ Make changes in the `client/src` directory for frontend development
- 🔧 Make changes in the `server` directory for backend development
- 📊 Use version control (e.g., git) to manage your code changes

## 🤝 Contributing

We welcome contributions! To contribute, follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

> [!IMPORTANT]
> Please adhere to the following guidelines:
> - Follow the existing code style
> - Write clear commit messages
> - Test your changes thoroughly
> - Document new features or changes

## 📊 Project Status

### ✅ Completed
- Basic authentication system
- Blog post creation and management
- User profiles

### 🔄 In Progress
- User/Admin UI optimization

### 📝 Todo
- Lobby UI: Research and develop new user interface
- Performance optimizations
- Enhanced mobile responsiveness

### ⚠️ Known Issues 
- `axiosInstance` and `authApi` getting referenceError when created an instance of axios in authApi (not yet resolved)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Purvesh-PJ/web_developement/blob/main/MERN/blogging_platform/LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by Your Team</sub>
</div>

