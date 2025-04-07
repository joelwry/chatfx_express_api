const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketio = require("socket.io");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", ({ username }) => {
    console.log(`${username} joined`);
    socket.broadcast.emit("message", {
      sender: "System",
      content: `${username} has joined the chat.`,
    });
  });

  socket.on("chat", ({ sender, content }) => {
    io.emit("message", { sender, content });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
