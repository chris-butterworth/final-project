const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const {
  roomsMap,
  createNewRoom,
  joinMultiPlayerRoom,
  getRoomIdFromSocket,
} = require("./gameFunctions.js");

const app = express();

const server = http.createServer(app);

const port = process.env.PORT || 8080;

const io = new Server(server, {
  cors: "*",
});

io.on("connection", (socket) => {
  socket.on("username", (username) => {
    console.log(socket.id, "=", username);
    socket.data.username = username;
  });

  socket.on("createSinglePlayerRoom", async (callback) => {
    const roomId = `sp${socket.id}`;
    await socket.join(roomId);
    createNewRoom(socket, roomId);
    callback(roomsMap.get(roomId));
  });

  socket.on("createMultiPlayerRoom", async (callback) => {
    const roomId = `mp${socket.id}`;
    await socket.join(roomId);
    createNewRoom(socket, roomId);
    callback(roomsMap.get(roomId));
  });

  socket.on("joinMultiPlayerRoom", async (roomId, callback) => {
    const response = joinMultiPlayerRoom(socket, roomId);
    if (response.error) {
      callback(response);
      return;
    }
    await socket.join(roomId);
    socket.to(roomId).emit("playerJoined", response.players);
    callback(response);
  });

  socket.on("startTimerRequest", () => {
    io.in(getRoomIdFromSocket(socket)).emit("startTimer");
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
