const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle new user
    socket.on("newuser", (username) => {
        socket.username = username;
        io.emit("user-connected", username);
    });

    // Handle new message
    socket.on("chat message", (msg) => {
        io.emit("chat message", { user: socket.username, message: msg });
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.username);
        console.log("A user disconnected");
    });
});

// Use the port provided by Glitch or default to 3000
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
