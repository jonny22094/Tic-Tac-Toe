const express = require("express");
const app     = express();
const http    = require("http").Server(app);
const io      = require("socket.io")(http);

let rooms = {};
const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

app.use(express.static(`${__dirname}/client`));

io.on("connection", user => {
  let roomId = null;

  for(const room in rooms) {
    if(rooms[room].players.length === 1) {
      rooms[room].players.push(user);
      rooms[room].ready = true;

      roomId = room;
      sendData(roomId, "alert", "Game started");
    }
  }

  if(!roomId) {
    roomId = createRoom(user);
  }

  user.on("move", data => {
    let room = rooms[roomId];
    if(room.ready && user.id === room.players[room.turn].id && room.maps[data] === null) {
      room.maps[data] = room.turn;
      room.moves++;

      sendData(roomId, "move", {id: data, text: room.turn ? "X" : "O"});
      room.turn = room.turn ? 0 : 1;

      if(checkMap(room)) {
        sendData(roomId, "alert", `Win ${room.turn ? "X" : "O"}`);
        room.ready = false;
      }
      else if(room.moves === 9) {
        sendData(roomId, "alert", "Draw");
        room.ready = false;
      }

      rooms[roomId] = room;
    }
  });

  user.once("disconnect", () => {
    rooms[roomId].ready = false;
    sendData(roomId, "alert", "Oponent disconnected");
  });
});

const sendData = (roomId, event, data) => {
  rooms[roomId].players.map(user => {
    user.emit(event, data);
  });
}

const createRoom = data => {
  const newRoom = {
    players: [data],
    maps: new Array(9).fill(null),
    turn: 0,
    moves: 0,
    ready: false
  };
  rooms[data.id] = newRoom;
  sendData(data.id, "alert", "Waiting for oponent...");

  return data.id;
}

const checkMap = room => {
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i] ;
    if(room.maps[a] !== null && room.maps[a] === room.maps[b] && room.maps[a] === room.maps[c]) {
      return true;
    }
  }

  return false;
}

http.listen( 3000, () => {
  console.log('server start in 3000 port');
});
