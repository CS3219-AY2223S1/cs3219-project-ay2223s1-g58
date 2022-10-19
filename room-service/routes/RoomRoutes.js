const express = require("express");
const { authenticationMiddleware } = require("../utils/authentication");
const {
  getRoomById,
  deleteRoom,
  createRoom,
  updateRoomQuestionId,
  getRoomByUserId,
} = require("../controller/room-controller");

const router = express.Router();

router.get("/:roomId", authenticationMiddleware, getRoomById);

router.get("/", authenticationMiddleware, getRoomByUserId);

// no authentication for createRoom, since it is used by internally
router.post("/", createRoom);

router.put("/:roomId", authenticationMiddleware, updateRoomQuestionId);

router.delete("/:roomId", authenticationMiddleware, deleteRoom);

module.exports = router;
