class SocketServices {
  connection(socket) {
    socket.on("setup", (userData) => {
      socket.join(userData._id);

      socket.emit("connected");
    });

    socket.on("join-chat", (room) => {
      socket.join(room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

    socket.on("new-message", (newMessageReceived) => {
      let chat = newMessageReceived.chat;

      if (!chat.users) return console.log(`chat.users not defined`);

      chat.users.forEach((user) => {
        if (user._id === newMessageReceived.sender._id) return;

        socket.in(user._id).emit("message-received", newMessageReceived);
      });
    });

    socket.off("setup", () => {
      socket.leave(userData._id);
    });
  }
}
module.exports = new SocketServices();
