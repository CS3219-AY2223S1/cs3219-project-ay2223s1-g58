import { StateEffect } from '@codemirror/state'

// In CodeMirror, changes to the editor state are made by creating "effect" objects
// representing the change, then encapsulating them in a "transaction" object
// to be processed by the extension.

/** 
 * A CodeMirror Effect representing the action of adding a cursor.
 * 
 * This effect contains 3 values: 
 * - uid: The user id associated with this cursor (could be this user or the partner)
 * - from: cursor start
 * - to: cursor end
 * 
 *  If from == to, this is a cursor. If from != to, this is a selection.
 */
const addCursor = StateEffect.define()

/** 
 * A CodeMirror Effect representing the action of removing a cursor.
 * 
 * This effect contains 3 values: 
 * - uid: The user id associated with this cursor (could be this user or the partner)
 * - from: cursor start
 * - to: cursor end
 * 
 *  If from == to, this is a cursor. If from != to, this is a selection.
 */
const rmCursor = StateEffect.define()

export { addCursor, rmCursor }
