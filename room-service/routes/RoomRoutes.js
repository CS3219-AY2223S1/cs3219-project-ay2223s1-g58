const express = require("express");
const { authenticationMiddleware } = require("../utils/authentication");
const {
  getRoomById,
  deleteRoom,
  createRoom,
  nextRoomQuestionId,
  previousRoomQuestionId,
  getRoomByUserId,
} = require("../controller/room-controller");

const router = express.Router();

router.get("/:roomId", authenticationMiddleware, getRoomById);

router.get("/", authenticationMiddleware, getRoomByUserId);

// no authentication for createRoom, since it is used by internally
router.post("/", createRoom);

router.put("/next/:roomId", authenticationMiddleware, nextRoomQuestionId);

router.put("/prev/:roomId", authenticationMiddleware, previousRoomQuestionId);

router.delete("/:roomId", authenticationMiddleware, deleteRoom);

module.exports = router;
