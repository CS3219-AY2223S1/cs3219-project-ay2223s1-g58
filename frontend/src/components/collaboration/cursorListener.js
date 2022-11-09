import { db } from '../../api/firebase'
import { addCursor, rmCursor } from './cursorEffects'

function isPresent(x) {
  return x !== null && x !== undefined
}

class CursorListener {
  /** The ref to the Firebase document */
  dbRef
  /** The CodeMirror instance */
  view
  /** The current cursor status of both users. Maps uid to the cursor data. */
  cursorsData
  /** The array of callbacks when a cursor is added */
  onAddCallbacks
  /** The array of callbacks when a cursor is removed */
  onRemoveCallbacks
  /** Boolean, true if this listerner has been deregistered */
  deregistered

  constructor(docPath, view) {
    this.dbRef = db.ref(`${docPath}/users`)
    this.view = view
    this.cursorsData = {}
    this.onAddCallbacks = []
    this.onRemoveCallbacks = []
    this.deregistered = false

    this.registerCursorCallbacks()
    this.attachFirebaseListeners()
    this.initUserData()
  }

  /**
   * Registers callbacks for add-cursor and rm-cursor events.
   * For each event, the callback fn creates a corresponding Effect object
   * and dispatches this effect to update the CodeMirror view.
   */
  registerCursorCallbacks() {
    // On add cursor
    this.onAddCallbacks.push((newCursor) => {
      if (isPresent(newCursor.from) && isPresent(newCursor.to)) {
        let toAdd = addCursor.of({
          uid: newCursor.uid,
          from: Math.min(newCursor.from, this.view.state.doc.length),
          to: Math.min(newCursor.to, this.view.state.doc.length),
        })
        this.view.dispatch({ effects: [toAdd] })
      }
    })
    // On remove cursor
    this.onRemoveCallbacks.push((oldCursor) => {
      if (isPresent(oldCursor.from) && isPresent(oldCursor.to)) {
        let toRm = rmCursor.of({
          uid: oldCursor.uid,
          from: oldCursor.from,
          to: oldCursor.to,
        })
        this.view.dispatch({ effects: [toRm] })
      }
    })
  }

  /**
   * Attaches Firebase listeners to listen for changes in cursor data.
   * On the cursor data change, pass the new data to the callbacks registered
   * in {@link registerCursorCallbacks} which will emit changes to CodeMirror.
   */
  attachFirebaseListeners() {
    this.dbRef.on(
      'child_changed',
      (snapshot) => {
        this.handleCursorEvent({
          uid: snapshot.key,
          ...snapshot.val(),
        })
      },
      (err) => {
        console.error('[child_changed] read failed: ' + err.name)
      }
    )

    this.dbRef.on(
      'child_removed',
      (snapshot) => {
        this.handleCursorEvent({ uid: snapshot.key })
      },
      (err) => {
        console.error('[child_removed] read failed: ' + err.name)
      }
    )
  }

  /**
   * Called once when the CursorListener is initialized.
   * Manually retrieves cursor data because Firebase listeners have not taken effect yet.
   */
  initUserData() {
    this.dbRef
      .get()
      .then((snapshot) => {
        if (!snapshot.exists()) {
          console.error('[initUserData] fail to read user data')
          return
        }
        const v = snapshot.val()
        for (const uid in v) {
          this.handleCursorEvent({ uid: uid, ...v[uid] })
        }
      })
      .catch(console.error)
  }

  /**
   * Handles add- and remove-cursor events.
   * Invoked on Firebase change, or on init this object.
   * @param eventData an object `{uid, cursor}`, where `uid` is the owner of the cursor
   * and `cursor` contains the position of the cursor.
   */
  handleCursorEvent = (eventData) => {
    const { uid, cursor } = eventData
    // Since cursorsData stores the current cursor of both users, if one user is undefined,
    // this is an addCursor event.
    if (this.cursorsData[uid] === undefined) {
      this.cursorsData[uid] = {
        uid: uid,
        from: cursor?.from,
        to: cursor?.to,
      }
      this.callbackOnAdd(this.cursorsData[uid])
    }
    // User has an existing cursor. Remove the old cursor, then add a new cursor.
    else {
      this.callbackOnRemove(this.cursorsData[uid])
      this.cursorsData[uid].from = cursor?.from
      this.cursorsData[uid].to = cursor?.to
      this.callbackOnAdd(this.cursorsData[uid])
    }
  }

  /** Executes all registered callbacks for Add-cursor event. */
  callbackOnAdd = (cursor) => {
    for (const fn of this.onAddCallbacks) {
      fn(cursor)
    }
  }

  /** Executes all registered callbacks for Remove-cursor event. */
  callbackOnRemove = (cursor) => {
    for (const fn of this.onRemoveCallbacks) {
      fn(cursor)
    }
  }

  /** Deletes all callbacks registered with this object. */
  deregister = () => {
    if (this.deregistered) {
      console.error('Unable to deregister twice')
      return
    }
    this.deregistered = true
    this.dbRef.off()
    this.onAddCallbacks = []
    this.onRemoveCallbacks = []
  }
}

export default CursorListener
