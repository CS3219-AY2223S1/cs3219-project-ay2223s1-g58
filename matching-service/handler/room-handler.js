const RoomService = require("../service/room-service");

exports.getRoomById = async function (req, res) {
  try {
    const room = await RoomService.findByRoomId(req.params.roomId);
    if (!room) {
      return res.status(400).json({ message: "Could not get Room info" });
    }
    return res.status(200).json({
      message: "Get Room info successfully",
      data: {
        roomId: room.roomId,
        questionId: room.questionId,
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
