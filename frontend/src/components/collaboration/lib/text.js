import { Formatting } from "./formatting"

/**
 * Object to represent Formatted text.
 *
 * @type {Function}
 */
export const Text = (function () {
  function Text(text, formatting) {
    // Allow calling without new.
    if (!(this instanceof Text)) {
      return new Text(text, formatting)
    }

    this.text = text
    this.formatting = formatting || Formatting()
  }

  return Text
})()
