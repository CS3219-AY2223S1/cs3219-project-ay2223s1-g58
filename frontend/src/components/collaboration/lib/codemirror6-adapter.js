import { TextOperation } from "./text-operation.js"
import { Cursor } from "./cursor.js"

import { Annotation, StateEffect, Transaction } from "@codemirror/state"

const addCodemirror6listener = (_this) => {
  _this.cm.dispatch({
    effects: StateEffect.appendConfig.of(
      _this.cm.constructor.updateListener.of((v) => {
        if (
          v.docChanged &&
          !(
            v.transactions[0] &&
            v.transactions[0].annotations.some((a) => a.type === "firepad")
          )
        ) {
          let index = 0
          let change_op = new TextOperation()
          let inverse_op = new TextOperation()

          //Iterate over changes
          v.changes.toJSON().forEach((c) => {
            if (typeof c == "number") {
              if (c !== 0) {
                index += c
                change_op = change_op.retain(c)
                inverse_op = inverse_op.retain(c)
              }
            } else if (typeof c == "object") {
              const [len, ...inserts] = c
              if (len > 0) {
                change_op = change_op.delete(len)
                inverse_op = inverse_op.insert(
                  v.startState.sliceDoc(index, index + len)
                )
              }
              if (inserts) {
                const jInserts = inserts.join("\n")
                change_op = change_op.insert(jInserts)
                inverse_op = inverse_op.delete(jInserts.length)
              }
            }
          })

          _this.trigger("change", change_op, inverse_op)
        }

        /** Update Editor Content */
        _this.lastDocLines = _this.cm.state.doc.text
      })
    ),
  })
}

/**
 * CodeMirror6 Adapter
 * Create Pipe between Firebase and CodeMirror6 Text Editor
 */
var CodeMirror6Adapter = (function () {
  /**
   * @constructor CodeMirror6Editor
   * @param {CodeMirror6Editor} monacoInstance - Editor Instance
   * @prop {CodeMirror6Editor} monaco - CodeMirror6 Instance passed as Parameter
   * @prop {CodeMirror6ITextModel} monacoModel - Data Model of the CodeMirror6 Instance
   * @prop {string[]} lastDocLines - Text for all Lines in the Editor
   * @prop {CodeMirror6Selection} lastCursorRange - Primary Selection of the Editor
   * @prop {function} onChange - Change Event Handler bound Local Object
   * @prop {function} onBlur - Blur Event Handler bound Local Object
   * @prop {function} onFocus - Focus Event Handler bound Local Object
   * @prop {function} onCursorActivity - Cursor Activity Handler bound Local Object
   * @prop {Boolean} ignoreChanges - Should Avoid OnChange Event Handling
   * @prop {CodeMirror6IDisposable} changeHandler - Event Handler for Model Content Change
   * @prop {CodeMirror6IDisposable} didBlurHandler - Event Handler for Focus Lost on Editor Text/Widget
   * @prop {CodeMirror6IDisposable} didFocusHandler - Event Handler for Focus Gain on Editor Text/Widget
   * @prop {CodeMirror6IDisposable} didChangeCursorPositionHandler - Event Handler for Cursor Position Change
   */
  function CodeMirror6Adapter(cmIstance, options = {}) {
    /* TODO: check if is valid codemirror6 istance
    */

    /** CodeMirror6 Member Variables */
    this.options = options
    this.cm = cmIstance
    this.lastDocLines = this.cm.state.doc.text
    this.lastCursorRange = this.cm.state.selection.main

    /** CodeMirror6 Editor Configurations */
    this.callbacks = {}
    this.otherCursors = []
    this.addedStyleRules = []
    this.ignoreChanges = false

    /** Adapter Callback Functions */
    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onCursorActivity = this.onCursorActivity.bind(this)


    addCodemirror6listener(this)

  }

  /**
   * @method detach - Clears an Instance of Editor Adapter
   */
  CodeMirror6Adapter.prototype.detach = function detach() {
    /*
  this.changeHandler.dispose();
  this.didBlurHandler.dispose();
  this.didFocusHandler.dispose();
  this.didChangeCursorPositionHandler.dispose();
  */
  }

  /**
   * @method getCursor - Get current cursor position
   * @returns Firepad Cursor object
   */
  CodeMirror6Adapter.prototype.getCursor = function getCursor() {
    var selection = this.cm.state.selection.main

    /** Fallback to last cursor change */
    if (typeof selection === "undefined" || selection === null) {
      selection = this.lastCursorRange
    }

    /** Obtain selection indexes */
    var start = selection.from
    var end = selection.to

    /** If Selection is Inversed */
    if (start > end) {
      var _ref = [end, start]
      start = _ref[0]
      end = _ref[1]
    }

    /** Return cursor position */
    return new Cursor(start, end)
  }

  /**
   * @method setCursor - Set Selection on CodeMirror6 Editor Instance
   * @param {Object} cursor - Cursor Position (start and end)
   * @param {Number} cursor.position - Starting Position of the Cursor
   * @param {Number} cursor.selectionEnd - Ending Position of the Cursor
   */
  CodeMirror6Adapter.prototype.setCursor = function setCursor(cursor) {
    var anchor = cursor.position
    var head = cursor.selectionEnd
    this.cm.dispatch({ selection: { anchor, head } })
  }

  /**
   * @method setOtherCursor - Set Remote Selection on CodeMirror6 Editor
   * @param {Number} cursor.position - Starting Position of the Selection
   * @param {Number} cursor.selectionEnd - Ending Position of the Selection
   * @param {String} color - Hex Color codes for Styling
   * @param {any} clientID - ID number of the Remote Client
   */
  CodeMirror6Adapter.prototype.setOtherCursor = function setOtherCursor(
    cursor,
    color,
    clientID
  ) {}

  /**
   * @method registerCallbacks - Assign callback functions to internal property
   * @param {function[]} callbacks - Set of callback functions
   */
  CodeMirror6Adapter.prototype.registerCallbacks = function registerCallbacks(
    callbacks
  ) {
    this.callbacks = Object.assign({}, this.callbacks, callbacks)
  }

  /**
   * @method registerUndo
   * @param {function} callback - Callback Handler for Undo Event
   */
  CodeMirror6Adapter.prototype.registerUndo = function registerUndo(callback) {
    if (typeof callback === "function") {
      this.callbacks.undo = callback
    } else {
      throw new Error(
        "CodeMirror6Adapter: registerUndo method expects a " +
          "callback function in parameter"
      )
    }
  }

  /**
   * @method registerRedo
   * @param {function} callback - Callback Handler for Redo Event
   */
  CodeMirror6Adapter.prototype.registerRedo = function registerRedo(callback) {
    if (typeof callback === "function") {
      this.callbacks.redo = callback
    } else {
      throw new Error(
        "CodeMirror6Adapter: registerRedo method expects a " +
          "callback function in parameter"
      )
    }
  }

  /**
   * @method trigger - Event Handler
   * @param {string} event - Event name
   * @param  {...any} args - Callback arguments
   */
  CodeMirror6Adapter.prototype.trigger = function trigger(event) {
    if (!this.callbacks.hasOwnProperty(event)) {
      return
    }

    var action = this.callbacks[event]

    if (!typeof action === "function") {
      return
    }

    var args = []

    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
      }
    }

    action.apply(null, args)
  }

  /**
   * @method onBlur - Blur event handler
   */
  CodeMirror6Adapter.prototype.onBlur = function onBlur() {
    if (this.monaco.getSelection().isEmpty()) {
      this.trigger("blur")
    }
  }

  /**
   * @method onFocus - Focus event handler
   */
  CodeMirror6Adapter.prototype.onFocus = function onFocus() {
    this.trigger("focus")
  }

  /**
   * @method onCursorActivity - CursorActivity event handler
   */
  CodeMirror6Adapter.prototype.onCursorActivity = function onCursorActivity() {
    var _this = this

    setTimeout(function () {
      return _this.trigger("cursorActivity")
    }, 1)
  }

  /**
   * @method applyOperation
   * @param {Operation} operation - OT.js Operation Object
   */
  CodeMirror6Adapter.prototype.applyOperation = function applyOperation(
    operation
  ) {

    if (!operation.isNoop()) {
      this.ignoreChanges = true
    }
    /** Get Operations List */
    var opsList = operation.ops
    var index = 0

    var _this = this
    opsList.forEach(function (op) {
      /** Retain Operation */
      if (op.isRetain()) {
        index += op.chars
      } else if (op.isInsert()) {
        /** Insert Operation */
        _this.cm.dispatch({
          annotations: [ Transaction.addToHistory.of(false), new Annotation("firepad", true)],
          changes: { from: index, to: index, insert: op.text },
        })

        index += op.text.length
      } else if (op.isDelete()) {
        /** Delete Operation */
        _this.cm.dispatch({
          annotations: [Transaction.addToHistory.of(false),  new Annotation("firepad", true)],
          changes: { from: index, to: index + op.chars, insert: "" },
        })
      }
    })

    /** Update Editor Content and Reset Config */
    this.lastDocLines = this.cm.state.doc.text
    this.ignoreChanges = false

  }

  /**
   * @method invertOperation
   * @param {Operation} operation - OT.js Operation Object
   */
  CodeMirror6Adapter.prototype.invertOperation = function invertOperation(
    operation
  ) {
    operation.invert(this.getValue())
  }

  return CodeMirror6Adapter
})() /** Export Module */

export { CodeMirror6Adapter }
