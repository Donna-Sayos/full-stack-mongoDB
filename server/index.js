require("dotenv").config({ path: "./server/config/config.env" });
const chalk = require("chalk");
const { app } = require("./app");

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(chalk.magenta(`Server running on PORT: ${PORT} 🔊🔊🔊`));
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1); // terminate the node terminal; gracefully leaves the program; 0 = success, 1 = unhandled rejection
  });
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5001",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  // if the user is not in the array, add the user to the array
  !users.some((user) => user?.userId === userId) &&
    users.push({
      userId,
      socketId,
      notificationCount: 0,
    });
};

const removeUser = (socketId) => {
  // if the user is in the array, remove the user from the array
  users = users.filter((user) => user?.socketId !== socketId);
  // emit an event to update the client-side state
  io.emit(
    "updateOnlineUsers",
    users.map((user) => user.userId)
  );
};

const getUser = (userId) => {
  return users.find((user) => user?.userId === userId);
};

io.on("connection", (socket) => {
  // when a user connects, add the user to the array
  console.log("A user connected!");

  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // send and get notification
  socket.on("sendNotification", ({ senderId, receiverId, conversationId }) => {
    const user = getUser(receiverId);
    if (user) {
      user.notificationCount++;

      io.to(user.socketId).emit("getNotification", {
        senderId,
        receiverId,
        conversationId,
        userNotifications: user.notificationCount,
      });
    }
  });

  socket.on("resetNotification", ({ receiverId }) => {
    const user = getUser(receiverId);
    if (user) {
      user.notificationCount = 0;

      io.to(user.socketId).emit("resetNotification", {
        receiverId,
        userNotifications: user.notificationCount,
      });
    }
  });

  // when a user disconnects, remove the user from the array
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
