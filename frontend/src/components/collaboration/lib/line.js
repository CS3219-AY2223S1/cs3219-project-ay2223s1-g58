import { LineFormatting } from "./line-formatting.js"

/**
 * Object to represent Formatted line.
 *
 * @type {Function}
 */
export const Line = (function () {
  function Line(textPieces, formatting) {
    // Allow calling without new.
    if (!(this instanceof Line)) {
      return new Line(textPieces, formatting)
    }

    if (Object.prototype.toString.call(textPieces) !== "[object Array]") {
      if (typeof textPieces === "undefined") {
        textPieces = []
      } else {
        textPieces = [textPieces]
      }
    }

    this.textPieces = textPieces
    this.formatting = formatting || LineFormatting()
  }

  return Line
})()
