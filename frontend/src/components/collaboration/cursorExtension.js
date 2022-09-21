import { showTooltip } from '@codemirror/view'
import { StateField } from '@codemirror/state'
import { addCursor, rmCursor } from './cursorEffects'

// This extension must be added to the set of extensions in the Editor component.
// It manages a set of cursor objects representing the cursor of the other user,
// and updates the editor to reflect their cursor position.
// Although there is only 1 partner and thus 1 cursor, we keep an "array of cursor" to be safe.

/**
 * Returns the extension to manage the other person's cursor.
 * @param uid The current user's id (NOT the other user!)
 */
const getCursorExtension = (uid) => {
  return StateField.define({
    // Start with an empty array of cursors
    create() {
      return []
    },
    // This function is called whenever the editor updates — it computes the
    // new cursor array using the previous array and the incoming transaction.
    update(cursors, tx) {
      let ret = cursors
      for (let e of tx.effects) {
        // If this transaction adds or removes cursors, apply those changes
        if (e.is(addCursor)) {
          // Skip my own cursor
          if (e.value.uid === uid) {
            continue
          }
          ret = [
            ...cursors,
            {
              uid: e.value.uid, // Each cursor has 2 fields: user id and position
              pos: e.value.to,
            },
          ]
        } else if (e.is(rmCursor)) {
          if (e.value.uid === uid) {
            continue
          }
          // Remove a certain cursor by filtering it out
          ret = cursors.filter((cur) => cur.uid !== e.value.uid)
        }
      }
      return ret
    },
    provide: (f) => {
      return showTooltip.computeN([f], (state) => {
        // Map each cursor obj stored in this StateField into a DOM element.
        // This renders into the other person's cursor.
        return state.field(f).map((x) => {
          return {
            pos: x.pos,
            create: () => {
              const dom = document.createElement('div')
              dom.style.borderColor = 'magenta'
              dom.style.borderWidth = '1px'
              dom.style.height = '16px'
              const offset = { x: 0, y: -16 }
              return { dom, offset }
            },
          }
        })
      })
    },
  })
}

export default getCursorExtension
