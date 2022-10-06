import HistoryService from '../service/service.js'

export async function getHistory(req, res) {
  try {
    const { uid } = req.params
    if (!uid) {
      return res.status(400).json({ message: 'user ID is missing' })
    }
    const resp = await HistoryService.getUserHistory(uid)
    if (resp.err) {
      const msg = `Could not get history for user ${uid}`
      console.log(`${msg}: ${resp.err}`)
      return res.status(400).json({ message: msg })
    }
    return res.status(200).json({
      message: 'Get history successfully',
      data: resp,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

export async function createHistory(req, res) {
  try {
    const { roomId } = req.body
    if (!roomId) {
      return res.status(400).json({ message: 'roomId is missing' })
    }
    const resp = await HistoryService.createRoomHistory(roomId)
    if (resp?.err) {
      const msg = `Could not create room history for roomId ${roomId}`
      console.log(`${msg}: ${resp.err}`)
      return res.status(400).json({ message: msg })
    }
    return res.status(201).json({ message: 'Created room history' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

export async function updateHistory(req, res) {
  try {
    const { roomId } = req.params
    const { questionId, answer } = req.body
    if (!roomId) {
      return res.status(400).json({ message: 'roomId is missing' })
    }
    if (!questionId) {
      return res.status(400).json({ message: 'questionId is missing' })
    }
    const resp = await HistoryService.updateRoomHistory(roomId, questionId, answer)
    if (resp?.err) {
      const msg = `Could not update history for room ${roomId}`
      console.log(`${msg}: ${resp.err}`)
      return res.status(400).json({ message: msg })
    }
    return res.status(200).json({ message: 'Update history successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}
