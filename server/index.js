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

// const addUser = (userId, socketId) => {
//   // if the user is not in the array, add the user to the array
//   !users.some((user) => user?.userId === userId) &&
//     users.push({
//       userId,
//       socketId,
//       notificationCount: 0,
//       isReading: false, // FIXME: testing!
//     });
// };
const addUser = (userId, socketId) => {
  // Check if user already exists in the array
  const existingUser = users.find((user) => user.userId === userId);
  if (!existingUser) {
    // If user does not exist, add the user to the array
    const newUser = {
      userId,
      socketId,
      notificationCount: 0,
      isReading: false, // FIXME: testing!
      conversations: [], // Initialize conversations array as empty
    };
    users.push(newUser);
  } else {
    // If user already exists, update the socketId
    existingUser.socketId = socketId;
  }
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

const getConversation = (conversationId) => {
  return users.find((user) =>
    user.conversations.some(
      (conversation) => conversation.conversationId === conversationId
    )
  );
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
  // socket.on("sendNotification", ({ senderId, receiverId, conversationId }) => {
  //   const user = getUser(receiverId);
  //   if (user) {
  //     user.notificationCount++;

  //     io.to(user.socketId).emit("getNotification", {
  //       senderId,
  //       receiverId,
  //       conversationId,
  //       userNotifications: user.notificationCount,
  //     });
  //   }
  // });
  socket.on("sendNotification", ({ senderId, receiverId, conversationId }) => {
    // FIXME: testing feature
    const receiver = getUser(receiverId);
    const sender = getUser(senderId);

    if (receiver) {
      // check if both members of the conversation have an active socket connection
      const isBothOnline = sender && sender.isReading && receiver.isReading;

      if (!isBothOnline) {
        receiver.notificationCount++;

        io.to(receiver.socketId).emit("getNotification", {
          senderId,
          receiverId,
          conversationId,
          userNotifications: receiver.notificationCount,
        });
      }
    }
  });

  // reading socket
  socket.on("setIsReading", ({ senderId, receiverId }) => {
    // FIXME: testing feature
    const senderUser = getUser(senderId);
    const receiverUser = getUser(receiverId);

    if (senderUser && receiverUser) {
      senderUser.isReading = true;
      receiverUser.isReading = true;

      // Emit the event only to the sockets of the sender and the receiver
      io.to(senderUser.socketId)
        .to(receiverUser.socketId)
        .emit("getIsReading", {
          senderId,
          receiverId,
          isReading: true,
        });
    }
  });

  // reset isReading
  socket.on("resetIsReading", ({ senderId, receiverId }) => {
    // FIXME: testing feature
    let user;

    if (senderId) {
      user = getUser(senderId);
    } else if (receiverId) {
      user = getUser(receiverId);
    }

    if (user) {
      user.isReading = false;

      // Emit the event only to the socket of the user being read by senderId or receiverId
      io.to(user.socketId).emit("resetIsReading", {
        userId: user.id,
        isReading: user.isReading,
      });
    }
  });

  // reset notification
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
