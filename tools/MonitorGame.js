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
      if (this.matchManager.games[this.currentRoom]) {
        try {
          this.io
            .to(this.socket.id)
            .emit("DebugGameUpdateRoom", this.matchManager.games[this.currentRoom].stage.stageJson);
        } catch (error) {
          console.log(`Error happend: ${error}`);
        }
      }
    } else {
      try {
        this.io.to(this.socket.id).emit("DebugGameUpdateStatus", this.getStats);
      } catch (error) {
        console.log(`Error happend: ${error}`);
      }
    }
  }
  get getStats() {
    let _totalPlayers = 0;
    let _totalRooms = 0;
    try {
      _totalPlayers = Object.keys(this.matchManager.players).length;
      _totalRooms = Object.keys(this.matchManager.rooms).length;
    } catch (error) {
      console.log(`Error happend: ${error}`);
    }
    return {
      totalPlayers: _totalPlayers,
      totalRooms: _totalRooms,
      players: this.matchManager.players,
      rooms: this.matchManager.rooms,
    };
  }
};
