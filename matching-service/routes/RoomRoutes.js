const express = require("express");
const { authenticationMiddleware } = require("../utils/authentication");
const { getRoomById, deleteRoom } = require("../handler/room-handler");

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/:roomId", getRoomById);

router.delete("/:roomId", deleteRoom);

module.exports = router;
