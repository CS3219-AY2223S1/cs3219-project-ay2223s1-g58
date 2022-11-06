const { createRoomDto } = require("../dto/room-dto");
const RoomService = require("../service/room-service");
const { setBetween } = require("../utils/common");

exports.getRoomById = async function (req, res) {
  try {
    const room = await RoomService.findByRoomId(req.params.roomId);
    // room not found or user does not belong to room
    const userId = req.user.username;
    if (!room || (room.userId1 !== userId && room.userId2 !== userId)) {
      return res.status(400).json({ message: "Could not get Room info" });
    }
    console.log("getRoom", room);
    return res.status(200).json({
      message: "Get Room info successfully",
      data: {
        roomId: room.roomId,
        userId1: room.userId1,
        userId2: room.userId2,
        questionId:
          room.questionIds[
            setBetween(room.current, room.questionIds.length - 1, 0)
          ],
        isFirst: room.current === 0,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.getRoomByUserId = async function (req, res) {
  try {
    const room = await RoomService.findByUserId(req.user.username);
    const data = {
      isInRoom: room !== null,
    };
    if (room) {
      data.roomId = room.roomId;
    }
    return res.status(200).json({
      message: "Get Room info successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.nextRoomQuestionId = async function (req, res) {
  try {
    const room = await RoomService.findByRoomId(req.params.roomId);
    // room not found or user does not belong to room
    const userId = req.user.username;
    if (!room || (room.userId1 !== userId && room.userId2 !== userId)) {
      return res.status(400).json({ message: "Could not update Room info" });
    }
    await RoomService.updateRoomQuestionIds(req.params.roomId, 1);
    return res.status(200).json({
      message: "Update Room next questionId successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.previousRoomQuestionId = async function (req, res) {
  try {
    const room = await RoomService.findByRoomId(req.params.roomId);
    // room not found or user does not belong to room
    const userId = req.user.username;
    if (!room || (room.userId1 !== userId && room.userId2 !== userId)) {
      return res.status(400).json({ message: "Could not update Room info" });
    }
    await RoomService.updateRoomQuestionIds(req.params.roomId, -1);
    return res.status(200).json({
      message: "Update Room previous questionId successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.createRoom = async function (req, res) {
  try {
    console.log("body", req.body);
    const { value, error } = createRoomDto.validate(req.body);
    if (error) {
      throw error;
    }
    const { roomId, userId1, userId2, difficulty } = value;
    await RoomService.createRoom(roomId, userId1, userId2, difficulty);
    return res.status(200).json({
      message: "Created Room successfully",
      data: {
        roomId: roomId,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteRoom = async function (req, res) {
  try {
    await RoomService.deleteRoom(req.params.roomId);
    return res.status(200).json({
      message: "Deleted Room successfully",
      data: {
        roomId: req.params.roomId,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
