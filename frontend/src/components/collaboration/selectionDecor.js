import { Decoration } from '@codemirror/view'

/**
 * Returns a CodeMirror Decoration for the other person's selection.
 * Basically, the returned decoration object specifies how the
 * selected text should be styled (text color, background color, etc.)
 */
const getOtherSelectionDecor = (uid) => {
  return Decoration.mark({
    inclusiveStart: true,
    attributes: {
      class: 'cm-other-selection',
    },
    uid: uid,
  })
}

export default getOtherSelectionDecor
