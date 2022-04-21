const { Server, Socket } = require("socket.io");
const User = require("../models/User");
const Game = require("../game/game");
const MatchManager = require("../game/matchManager");

module.exports = class MonitorGame {
  constructor(/** @type {MatchManager} */ _matchManager) {
    this.matchManager = _matchManager;
    this.currentRoom = null;
    this.socket = null;
    this.io = null;
    this.frameRate = 10;
  }
  Init(_socket, _io) {
    this.socket = _socket;
    this.io = _io;
  }
  changeRoom(room) {
    this.currentRoom = room;
  }
  deleteRoom() {
    this.currentRoom = null;
  }
  changeFrameRate(frameRate) {
    this.frameRate = frameRate;
  }
  disconnect() {
    this.socket = null;
    this.io = null;
    this.currentRoom = null;
  }
  Update() {
    if (this.currentRoom) {
      this.io.to(this.socket.id).emit("DebugGameUpdateRoom", this.matchManager.games[this.currentRoom].stage.stageJson);
    } else {
      const result = this.getStats;
      this.io.to(this.socket.id).emit("DebugGameUpdateStatus", result);
    }
  }
  get getStats() {
    return {
      totalPlayers: Object.keys(this.matchManager.players).length,
      totalRooms: Object.keys(this.matchManager.rooms).length,
      players: this.matchManager.players,
      rooms: this.matchManager.rooms,
    };
  }
};
