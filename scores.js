const scores = [];

const createScoreObject = (roomId, player1, player2) => {
  scores.push({
    room: roomId,
    player1,
    player2,
    p1Scores: [],
    p2Scores: [],
    p1Total: 0,
    p2Total: 0,
  });
};

const addScore = (room, player, score) => {
  index = scores.findIndex((score) => score.room === room);
  if (player === scores[index].player1) {
    scores[index].p1Scores.push(score);
  } else {
    scores[index].p2Scores.push(score);
  }
};

const getScores = (room) => {
  index = scores.findIndex((score) => score.room === room);
  if (~index) return scores[index];
};

module.exports = { addScore, createScoreObject, getScores };
