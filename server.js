const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { router } = require("./routes");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(router);

const server = http.createServer(app);
const io = socketio(server);
const {
  addFirstPlayer,
  addSecondPlayer,
  removeRoom,
  isRoomFilled,
  getRoom,
  isRoomPresent,
} = require("./rooms");
const { createScoreObject, addScore, getScores } = require("./scores");

io.on("connection", (socket) => {
  socket.on("create", ({ room }) => {
    addFirstPlayer(room, socket.id);
    socket.join(room);
    console.log("Player 1 joined");
  });

  socket.on("join", ({ room }, callback) => {
    if (isRoomPresent(room)) {
      if (!isRoomFilled(room)) {
        addSecondPlayer(room, socket.id);
        socket.join(room);
        console.log("Player 2 Joined");
        callback(0);
      } else if (isRoomFilled(room)) {
        callback(2);
      }
    } else {
      callback(1);
    }
  });

  socket.on("joined", ({ room }) => {
    io.to(room).emit("start", {
      round: getRoom(room).players[Math.floor(Math.random() * 2)],
    });
    player1 = getRoom(room).players[0];
    player2 = getRoom(room).players[1];
    createScoreObject(room, player1, player2);
  });

  socket.on("hit", ({ num, room }) => {
    addScore(room, socket.id, num);
    io.to(room).emit("hitted", { player: socket.id, num });
  });

  socket.on("guess", ({ num, room }) => {
    const scoreRoom = getScores(room);
    addScore(room, socket.id, num);
    let guessed = false;
    const { p1Scores, p2Scores } = getScores(room);
    if (p1Scores[p1Scores.length - 1] === p2Scores[p2Scores.length - 1]) {
      guessed = true;
    }
    if (guessed) {
      io.to(room).emit("guessed", {
        guessed,
        player: socket.id,
        score: 0,
        num,
      });
    } else if (scoreRoom.player1 === socket.id) {
      io.to(room).emit("guessed", {
        guessed,
        player: socket.id,
        score: p2Scores[p2Scores.length - 1],
        num,
      });
    } else if (scoreRoom.player2 === socket.id) {
      io.to(room).emit("guessed", {
        guessed,
        player: socket.id,
        score: p1Scores[p1Scores.length - 1],
        num,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server Started on Port:${PORT}`);
});
