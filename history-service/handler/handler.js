import HistoryService from '../service/service.js'

export async function getHistory(req, res) {
  try {
    const { uid } = req.query
    const resp = await HistoryService.getUserHistory(uid)
    if (resp.err) {
      const msg = `Could not get history for user ${uid}`
      console.log(`${msg}: ${resp.err}`)
      return res
        .status(400)
        .json({ message: msg })
    }
    return res.status(200).json({
      message: 'Get history successfully',
      data: {
        history: resp.history,
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

export async function addHistory(req, res) {
  try {
    const { roomId } = req.query
    const { questionId, answer } = req.body
    if (!questionId) {
      return res.status(400).json({ message: 'Question ID is missing' })
    }
    const resp = await HistoryService.addRoomHistory(roomId, questionId, answer)
    if (resp.err) {
      const msg = `Could not add history for room ${uid}`
      console.log(`${msg}: ${resp.err}`)
      return res
        .status(400)
        .json({ message: msg })
    }
    return res.status(201).json({ message: 'Add history successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}
