const express = require("express");
const { getRoomById, deleteRoom } = require("../handler/room-handler");

const router = express.Router();

router.get("/:roomId", getRoomById);

router.delete("/:roomId", deleteRoom);

module.exports = router;
