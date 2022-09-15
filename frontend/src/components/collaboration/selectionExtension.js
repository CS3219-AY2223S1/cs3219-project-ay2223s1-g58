import { StateField } from '@codemirror/state'
import { EditorView, Decoration } from '@codemirror/view'
import { addCursor, rmCursor } from './cursorEffects'
import getOtherSelectionDecor from './selectionDecor'

// This extension must be added to the set of extensions in the Editor component.
// It manages a set of Decoration objects representing the selections of the other user,
// and updates the editor to reflect their selection.

// Why is it a Selection extension, but the effects used are addCursor/rmCursor?
// Because selection IS a cursor, only with from != to. All selection changes are
// reported as cursor changes, we distinguish selection from cursor by checking from != to.

/**
 * Returns the extension to manage the other person's selection.
 * @param uid The current user's id (NOT the other user!)
 */
const getSelectionExtension = (uid) => {
  return StateField.define({
    // Start with an empty set of decorations
    create() {
      return Decoration.none
    },
    // This is called whenever the editor updates
    update(selections, tx) {
      // map adjusts the previous selections to account for document changes, using operational transformation
      selections = selections.map(tx.changes)
      // If this transaction adds or removes selections, apply those changes
      for (let e of tx.effects) {
        if (e.is(addCursor)) {
          // Skip my own selection
          if (e.value.uid === uid) {
            continue
          }
          let arr = []
          // Verify that this is actually a selection (if from == to, no text selected)
          if (e.value.from !== e.value.to) {
            let from = e.value.from, to = e.value.to
            if (from > to) {
              [from, to] = [to, from]   // Swap to ensure from < to
            }
            const otherSel = getOtherSelectionDecor(e.value.uid)
            arr.push(otherSel.range(from, to))
          }
          selections = selections.update({
            add: arr,
          })
        } else if (e.is(rmCursor)) {
          if (e.value.uid === uid) {
            continue
          }
          selections = selections.update({
            filter: (from, to, decoration) => {
              // Remove a cursor by filtering it out
              // decoration.spec contains the uid associated with that cursor.
              // See getOtherSelectionMark() for the definition of our Decoration.
              return decoration.spec.uid !== e.value.uid
            },
          })
        }
      }
      return selections
    },
    // Indicate that this StateField obj provides a set of decorations
    provide: (f) => EditorView.decorations.from(f),
  })
}

export default getSelectionExtension
