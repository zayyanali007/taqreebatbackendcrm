const handleSocketsEvent = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connection established");
    // socket.on("AccountRequested", (data) => {
    //   socket.broadcast.emit("adminRefresh");
    // });
  });
};

export default handleSocketsEvent;
