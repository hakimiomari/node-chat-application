const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const publicPath = path.join(__dirname, "./public");
const direction = app.use(express.static(publicPath));

// route
app.get("/", (req, res) => {
  res.sendFile(direction);
});

// socket.io

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});

// This will emit the event to all connected sockets
io.emit("some event", {
  someProperty: "some value",
  otherProperty: "other value",
});

io.on("connection", (socket) => {
  socket.broadcast.emit("hi");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// server running....
const PORT = process.env.PORT || 3005;
server.listen(3005, () => {
  console.log(`listening on *:${PORT}`);
});
