const socket = io();

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    const username = prompt("Enter your username");
    socket.emit("newuser", username);

    const messageInput = document.getElementById("message-input");
    const sendMessageButton = document.getElementById("send-message");
    const chatWindow = document.querySelector(".messages");

    // Send message
    sendMessageButton.addEventListener("click", () => {
        const message = messageInput.value;
        if (message.trim()) {
            socket.emit("chat message", message);
            messageInput.value = "";
        }
    });

    // Handle "Enter" key press
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessageButton.click();
        }
    });

    // Listen for chat messages
    socket.on("chat message", function (data) {
        const messageElement = document.createElement("div");
        messageElement.className = "message";
        if (data.user === username) {
            messageElement.classList.add("my-message");
        }
        messageElement.textContent = `${data.user}: ${data.message}`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
    });

    // Listen for new user connections
    socket.on("user-connected", function (username) {
        const messageElement = document.createElement("div");
        messageElement.className = "message";
        messageElement.textContent = `${username} joined the chat`;
        messageElement.style.fontStyle = "italic";
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
    });

    // Listen for user disconnections
    socket.on("user-disconnected", function (username) {
        const messageElement = document.createElement("div");
        messageElement.className = "message";
        messageElement.textContent = `${username} left the chat`;
        messageElement.style.fontStyle = "italic";
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
    });
});
