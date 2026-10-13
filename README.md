<div align="center">

# 🎓 Talkdemy

**A real-time communication platform for students to chat in groups and one-on-one.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

</div>

---

## 📖 About

Talkdemy is a real-time chat platform built for students. It gives them one place to **talk openly, ask questions, and connect with peers**, through group conversations and direct messages. Anonymous interaction is planned for a future release (see the [Roadmap](#-roadmap)).

## ✨ Features

- 💬 **Real-time messaging**: instant delivery over WebSockets
- 👥 **Group chats**: study groups, class discussions, and communities
- 📩 **Direct messages**: one-on-one conversations
- ✍️ **Typing indicators**: see when someone is replying
- 👀 **Seen receipts**: know when your message has been read

## 🛠 Tech Stack

> Update this table to match your actual dependencies.

| Layer | Technology |
| --- | --- |
| Frontend | `client/`: [e.g. React, Vite, Tailwind CSS] |
| Backend | `server/`: [e.g. Node.js, Express] |
| Real-time | WebSockets (Socket.IO) |
| Database | [e.g. MongoDB / PostgreSQL] |
| Auth | [e.g. JWT] |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm or yarn
- A running database instance (see your `.env` configuration)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aayushrk13/Talkdemy.git
   cd Talkdemy
   ```

2. **Set up the server**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in `server/`:

   ```env
   PORT=5000
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_secret_key
   CLIENT_URL=http://localhost:5173
   ```

   Start the server:

   ```bash
   npm run dev
   ```

3. **Set up the client** (in a new terminal)

   ```bash
   cd client
   npm install
   ```

   Create a `.env` file in `client/`:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

   Start the client:

   ```bash
   npm run dev
   ```

4. **Open the app** at `http://localhost:5173`

## 📁 Project Structure

```
Talkdemy/
├── client/        # Frontend application
├── server/        # Backend API and Socket server
├── Talkdemy.pptx  # Project presentation
└── README.md
```


**Aayush** · [@Aayushrk13](https://github.com/Aayushrk13)

---

<div align="center">
Made with ❤️ for students, by a student.
</div>
