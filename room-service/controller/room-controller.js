const { createRoomDto } = require("../dto/room-dto");
const RoomService = require("../service/room-service");

exports.getRoomById = async function (req, res) {
  try {
    const room = await RoomService.findByRoomId(req.params.roomId);
    // room not found or user does not belong to room
    const userId = req.user.username;
    if (!room || (room.userId1 !== userId && room.userId2 !== userId)) {
      return res.status(400).json({ message: "Could not get Room info" });
    }
    return res.status(200).json({
      message: "Get Room info successfully",
      data: {
        roomId: room.roomId,
        userId1: room.userId1,
        userId2: room.userId2,
        questionId: room.questionId,
      },
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
    const { roomId, questionId, userId1, userId2, difficulty } = value;
    await RoomService.createRoom(
      roomId,
      questionId,
      userId1,
      userId2,
      difficulty
    );
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
