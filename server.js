const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    console.log("A user connected");

    // Handle new user
    socket.on("newuser", function (username) {
        socket.username = username;
        io.emit("user-connected", username);
    });

    // Handle new message
    socket.on("chat message", function (msg) {
        io.emit("chat message", { user: socket.username, message: msg });
    });

    // Handle user disconnection
    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.username);
        console.log("A user disconnected");
    });
});

server.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
