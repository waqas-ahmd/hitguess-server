let rooms = [];

const getRoom = (roomId) => {
  index = rooms.findIndex((room) => room.roomId === roomId);
  if (~index) {
    return rooms[index];
  } else {
    return { error: "Room Not Found" };
  }
};

const isRoomPresent = (roomId) => {
  temp = rooms.filter((room) => room.roomId === roomId);
  if (temp.length === 0) {
    return false;
  } else {
    return true;
  }
};

const removeRoom = (roomId) => {
  rooms = rooms.filter((room) => room.roomId !== roomId);
};

const addFirstPlayer = (roomId, playerId) => {
  rooms.push({ roomId, players: [playerId] });
};

const addSecondPlayer = (roomId, playerId) => {
  index = rooms.findIndex((room) => room.roomId === roomId);
  if (~index) {
    let thisRoom = rooms[index];
    rooms[index] = { ...thisRoom, players: [...thisRoom.players, playerId] };
  }
};

const isRoomFilled = (roomId) => {
  index = rooms.findIndex((room) => room.roomId === roomId);
  if (~index) {
    if (rooms[index].players.length === 1) {
      return false;
    } else {
      return true;
    }
  }
};

module.exports = {
  getRoom,
  addFirstPlayer,
  addSecondPlayer,
  isRoomFilled,
  removeRoom,
  isRoomPresent,
};
