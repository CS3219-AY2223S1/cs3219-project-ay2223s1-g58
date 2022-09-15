/*!
 * This file, and the entire ../lib directory is copied from https://github.com/lucafabbian/firepad.
 * lucafabbian's Firepad offers support for CodeMirror and Ace editors. Our project
 * only uses CodeMirror6, but the Ace adapter source code generates some webpack 
 * warnings when compiled, causing our project to fail the CI. Since a PR can take 
 * time to be merged and resolve the issue, we decide to copy over relevant CodeMirror6
 * source files only.
 * 
 * Some other files also violate eslint rules, which are silenced by eslint-disable-next-line.
 * 
 * Firepad is an open-source, collaborative code and text editor. It was designed
 * to be embedded inside larger applications. Since it uses Firebase as a backend,
 * it requires no server-side code and can be added to any web app simply by
 * including a couple JavaScript files.
 *
 * http://www.firepad.io/
 * License: MIT
 * Copyright: 2014 Firebase
 * With code from ot.js (Copyright 2012-2013 Tim Baumann)
 */

import { TextOperation } from "./text-operation.js"
import { FirebaseAdapter } from "./firebase-adapter.js"
import { EntityManager } from "./entity-manager.js"
import { ParseHtml } from "./parse-html.js"
import { utils } from "./utils.js"
import { LineFormatting } from "./line-formatting.js"
import { SerializeHtml } from "./serialize-html.js"
import { ATTR } from "./constants.js"
import { textPiecesToInserts } from "./text-pieces-to-inserts.js"
import { EditorClient } from "./editor-client.js"
import { Text } from "./text.js"
import { Entity } from "./entity.js"
import { Line } from "./line.js"
import { Formatting } from "./formatting.js"

import { CodeMirror6Adapter } from "./codemirror6-adapter.js"

// TODO - change this hack to a real solution
// https://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript
let global
try {
  // eslint-disable-next-line no-new-func
  global = Function("return this")()
} catch (e) {
  global = window
}

const Firepad = (function () {
  var CodeMirror = global.CodeMirror
  var ace = global.ace

  function Firepad(ref, place, options) {
    if (!(this instanceof Firepad)) {
      return new Firepad(ref, place, options)
    }

    if (
      !CodeMirror &&
      !ace &&
      !global.monaco &&
      !(place.type === "CodeMirror6")
    ) {
      throw new Error(
        "Couldn't find CodeMirror, ACE or Monaco.  Did you forget to include codemirror.js/ace.js or import monaco?"
      )
    }

    this.zombie_ = false
    if (place.type === "CodeMirror6") {
      this.codeMirror6_ = this.editor_ = place.editor
      const curValue = this.codeMirror6_.state.doc.toString()
      if (curValue !== "") {
        throw new Error(
          "Can't initialize Firepad with a CodeMirror6 instance that already contains text."
        )
      }
    } else if (CodeMirror && place instanceof CodeMirror) {
      this.codeMirror_ = this.editor_ = place
      var curValue = this.codeMirror_.getValue()
      if (curValue !== "") {
        throw new Error(
          "Can't initialize Firepad with a CodeMirror instance that already contains text."
        )
      }
    } else if (ace && place && place.session instanceof ace.EditSession) {
      this.ace_ = this.editor_ = place
      curValue = this.ace_.getValue()
      if (curValue !== "") {
        throw new Error(
          "Can't initialize Firepad with an ACE instance that already contains text."
        )
      }
    } else {
      this.codeMirror_ = this.editor_ = new CodeMirror(place)
    }

    var editorWrapper
    if (this.codeMirror6_) {
      editorWrapper = this.codeMirror6_.dom
    } else if (this.codeMirror_) {
      editorWrapper = this.codeMirror_.getWrapperElement()
    } else if (this.ace_) {
      editorWrapper = this.ace_.container
    } else {
      editorWrapper = this.monaco_.getDomNode()
    }

    // var editorWrapper = this.codeMirror_ ? this.codeMirror_.getWrapperElement() : this.ace_.container;
    this.firepadWrapper_ = utils.elt("div", null, { class: "firepad" })
    editorWrapper.parentNode.replaceChild(this.firepadWrapper_, editorWrapper)
    this.firepadWrapper_.appendChild(editorWrapper)

    // Provide an easy way to get the firepad instance associated with this CodeMirror instance.
    this.editor_.firepad = this

    this.options_ = options || {}

    if (this.getOption("richTextShortcuts", false)) {
      if (!CodeMirror.keyMap["richtext"]) {
        this.initializeKeyMap_()
      }
      this.codeMirror_.setOption("keyMap", "richtext")
      this.firepadWrapper_.className += " firepad-richtext"
    }

    this.imageInsertionUI = this.getOption("imageInsertionUI", true)

    if (this.getOption("richTextToolbar", false)) {
      throw new Error("does not support Rich text, let alone Rich Text Toolbar!")
    }

    this.addPoweredByLogo_()

    // Now that we've mucked with CodeMirror, refresh it.
    if (this.codeMirror_) this.codeMirror_.refresh()

    var userId = this.getOption("userId", ref.push().key)
    var userColor = this.getOption("userColor", colorFromUserId(userId))

    this.entityManager_ = new EntityManager()

    this.firebaseAdapter_ = new FirebaseAdapter(ref, userId, userColor)
    if (this.codeMirror6_) {
      this.editorAdapter_ = new CodeMirror6Adapter(
        this.codeMirror6_,
        this.options_
      )
    }
    this.client_ = new EditorClient(this.firebaseAdapter_, this.editorAdapter_)

    var self = this
    this.firebaseAdapter_.on("cursor", function () {
      self.trigger.apply(self, ["cursor"].concat([].slice.call(arguments)))
    })

    if (this.codeMirror_) {
      this.richTextCodeMirror_.on("newLine", function () {
        self.trigger.apply(self, ["newLine"].concat([].slice.call(arguments)))
      })
    }

    this.firebaseAdapter_.on("ready", function () {
      self.ready_ = true

      if (self.ace_) {
        self.editorAdapter_.grabDocumentState()
      }
      if (self.monaco_) {
        self.editorAdapter_.grabDocumentState()
      }

      var defaultText = self.getOption("defaultText", null)
      if (defaultText && self.isHistoryEmpty()) {
        self.setText(defaultText)
      }

      self.trigger("ready")
    })

    this.client_.on("synced", function (isSynced) {
      self.trigger("synced", isSynced)
    })

    // Hack for IE8 to make font icons work more reliably.
    // http://stackoverflow.com/questions/9809351/ie8-css-font-face-fonts-only-working-for-before-content-on-over-and-sometimes
    if (
      navigator.appName === "Microsoft Internet Explorer" &&
      navigator.userAgent.match(/MSIE 8\./)
    ) {
      window.onload = function () {
        var head = document.getElementsByTagName("head")[0],
          style = document.createElement("style")
        style.type = "text/css"
        style.styleSheet.cssText = ":before,:after{content:none !important;}"
        head.appendChild(style)
        setTimeout(function () {
          head.removeChild(style)
        }, 0)
      }
    }
  }
  utils.makeEventEmitter(Firepad)

  // For readability, these are the primary "constructors", even though right now they're just aliases for Firepad.
  Firepad.fromCodeMirror = Firepad
  Firepad.fromACE = Firepad
  Firepad.fromMonaco = Firepad

  Firepad.fromCodeMirror6 = (ref, editor, ...e) =>
    Firepad(
      ref,
      {
        type: "CodeMirror6",
        editor,
      },
      ...e
    )

  Firepad.prototype.dispose = function () {
    this.zombie_ = true // We've been disposed.  No longer valid to do anything.

    // Unwrap the editor.
    var editorWrapper
    if (this.codeMirror_) {
      editorWrapper = this.codeMirror_.getWrapperElement()
    } else if (this.ace_) {
      editorWrapper = this.ace_.container
    } else {
      editorWrapper = this.monaco_.getDomNode()
    }

    this.firepadWrapper_.removeChild(editorWrapper)
    this.firepadWrapper_.parentNode.replaceChild(
      editorWrapper,
      this.firepadWrapper_
    )

    this.editor_.firepad = null

    if (
      this.codeMirror_ &&
      this.codeMirror_.getOption("keyMap") === "richtext"
    ) {
      this.codeMirror_.setOption("keyMap", "default")
    }

    this.firebaseAdapter_.dispose()
    this.editorAdapter_.detach()
    if (this.richTextCodeMirror_) this.richTextCodeMirror_.detach()
  }

  Firepad.prototype.setUserId = function (userId) {
    this.firebaseAdapter_.setUserId(userId)
  }

  Firepad.prototype.setUserColor = function (color) {
    this.firebaseAdapter_.setColor(color)
  }

  Firepad.prototype.getText = function () {
    this.assertReady_("getText")
    if (this.codeMirror_) return this.richTextCodeMirror_.getText()
    else if (this.ace_) return this.ace_.getSession().getDocument().getValue()
    else return this.monaco_.getModel().getValue()
  }

  Firepad.prototype.setText = function (textPieces) {
    this.assertReady_("setText")

    if (this.codeMirror6_) {
      return this.codeMirror6_.dispatch({
        changes: {from: 0, to: this.codeMirror6_.state.doc.length, insert: textPieces}
      })
      
    } else if (this.monaco_) {
      return this.monaco_.getModel().setValue(textPieces)
    } else if (this.ace_) {
      return this.ace_.getSession().getDocument().setValue(textPieces)
    } else {
      // HACK: Hide CodeMirror during setText to prevent lots of extra renders.
      this.codeMirror_.getWrapperElement().style.display = "none"
      this.codeMirror_.setValue("")
      this.insertText(0, textPieces)
      this.codeMirror_.getWrapperElement().style.display = ""
      this.codeMirror_.refresh()
    }
    this.editorAdapter_.setCursor({ position: 0, selectionEnd: 0 })
  }

  Firepad.prototype.insertTextAtCursor = function (textPieces) {
    this.insertText(
      this.codeMirror_.indexFromPos(this.codeMirror_.getCursor()),
      textPieces
    )
  }

  Firepad.prototype.insertText = function (index, textPieces) {
    utils.assert(!this.ace_, "Not supported for ace yet.")
    utils.assert(!this.monaco_, "Not supported for monaco yet.")
    this.assertReady_("insertText")

    // Wrap it in an array if it's not already.
    if (Object.prototype.toString.call(textPieces) !== "[object Array]") {
      textPieces = [textPieces]
    }

    var self = this
    self.codeMirror_.operation(function () {
      // HACK: We should check if we're actually at the beginning of a line; but checking for index == 0 is sufficient
      // for the setText() case.
      var atNewLine = index === 0
      var inserts = textPiecesToInserts(atNewLine, textPieces)

      for (var i = 0; i < inserts.length; i++) {
        var string = inserts[i].string
        var attributes = inserts[i].attributes
        self.richTextCodeMirror_.insertText(index, string, attributes)
        index += string.length
      }
    })
  }

  Firepad.prototype.getOperationForSpan = function (start, end) {
    var text = this.richTextCodeMirror_.getRange(start, end)
    var spans = this.richTextCodeMirror_.getAttributeSpans(start, end)
    var pos = 0
    var op = new TextOperation()
    for (var i = 0; i < spans.length; i++) {
      op.insert(text.substr(pos, spans[i].length), spans[i].attributes)
      pos += spans[i].length
    }
    return op
  }

  Firepad.prototype.getHtml = function () {
    return this.getHtmlFromRange(null, null)
  }

  Firepad.prototype.getHtmlFromSelection = function () {
    var startPos = this.codeMirror_.getCursor("start"),
      endPos = this.codeMirror_.getCursor("end")
    var startIndex = this.codeMirror_.indexFromPos(startPos),
      endIndex = this.codeMirror_.indexFromPos(endPos)
    return this.getHtmlFromRange(startIndex, endIndex)
  }

  Firepad.prototype.getHtmlFromRange = function (start, end) {
    this.assertReady_("getHtmlFromRange")
    var doc =
      start != null && end != null
        ? this.getOperationForSpan(start, end)
        : this.getOperationForSpan(0, this.codeMirror_.getValue().length)
    return SerializeHtml(doc, this.entityManager_)
  }

  Firepad.prototype.insertHtml = function (index, html) {
    var lines = ParseHtml(html, this.entityManager_)
    this.insertText(index, lines)
  }

  Firepad.prototype.insertHtmlAtCursor = function (html) {
    this.insertHtml(
      this.codeMirror_.indexFromPos(this.codeMirror_.getCursor()),
      html
    )
  }

  Firepad.prototype.setHtml = function (html) {
    var lines = ParseHtml(html, this.entityManager_)
    this.setText(lines)
  }

  Firepad.prototype.isHistoryEmpty = function () {
    this.assertReady_("isHistoryEmpty")
    return this.firebaseAdapter_.isHistoryEmpty()
  }

  Firepad.prototype.bold = function () {
    this.richTextCodeMirror_.toggleAttribute(ATTR.BOLD)
    this.codeMirror_.focus()
  }

  Firepad.prototype.italic = function () {
    this.richTextCodeMirror_.toggleAttribute(ATTR.ITALIC)
    this.codeMirror_.focus()
  }

  Firepad.prototype.underline = function () {
    this.richTextCodeMirror_.toggleAttribute(ATTR.UNDERLINE)
    this.codeMirror_.focus()
  }

  Firepad.prototype.strike = function () {
    this.richTextCodeMirror_.toggleAttribute(ATTR.STRIKE)
    this.codeMirror_.focus()
  }

  Firepad.prototype.fontSize = function (size) {
    this.richTextCodeMirror_.setAttribute(ATTR.FONT_SIZE, size)
    this.codeMirror_.focus()
  }

  Firepad.prototype.font = function (font) {
    this.richTextCodeMirror_.setAttribute(ATTR.FONT, font)
    this.codeMirror_.focus()
  }

  Firepad.prototype.color = function (color) {
    this.richTextCodeMirror_.setAttribute(ATTR.COLOR, color)
    this.codeMirror_.focus()
  }

  Firepad.prototype.highlight = function () {
    this.richTextCodeMirror_.toggleAttribute(
      ATTR.BACKGROUND_COLOR,
      "rgba(255,255,0,.65)"
    )
    this.codeMirror_.focus()
  }

  Firepad.prototype.align = function (alignment) {
    if (
      alignment !== "left" &&
      alignment !== "center" &&
      alignment !== "right"
    ) {
      throw new Error('align() must be passed "left", "center", or "right".')
    }
    this.richTextCodeMirror_.setLineAttribute(ATTR.LINE_ALIGN, alignment)
    this.codeMirror_.focus()
  }

  Firepad.prototype.orderedList = function () {
    this.richTextCodeMirror_.toggleLineAttribute(ATTR.LIST_TYPE, "o")
    this.codeMirror_.focus()
  }

  Firepad.prototype.unorderedList = function () {
    this.richTextCodeMirror_.toggleLineAttribute(ATTR.LIST_TYPE, "u")
    this.codeMirror_.focus()
  }

  Firepad.prototype.todo = function () {
    this.richTextCodeMirror_.toggleTodo()
    this.codeMirror_.focus()
  }

  Firepad.prototype.newline = function () {
    this.richTextCodeMirror_.newline()
  }

  Firepad.prototype.deleteLeft = function () {
    this.richTextCodeMirror_.deleteLeft()
  }

  Firepad.prototype.deleteRight = function () {
    this.richTextCodeMirror_.deleteRight()
  }

  Firepad.prototype.indent = function () {
    this.richTextCodeMirror_.indent()
    this.codeMirror_.focus()
  }

  Firepad.prototype.unindent = function () {
    this.richTextCodeMirror_.unindent()
    this.codeMirror_.focus()
  }

  Firepad.prototype.undo = function () {
    this.codeMirror_.undo()
  }

  Firepad.prototype.redo = function () {
    this.codeMirror_.redo()
  }

  Firepad.prototype.insertEntity = function (type, info, origin) {
    this.richTextCodeMirror_.insertEntityAtCursor(type, info, origin)
  }

  Firepad.prototype.insertEntityAt = function (index, type, info, origin) {
    this.richTextCodeMirror_.insertEntityAt(index, type, info, origin)
  }

  Firepad.prototype.registerEntity = function (type, options) {
    this.entityManager_.register(type, options)
  }

  Firepad.prototype.getOption = function (option, def) {
    return option in this.options_ ? this.options_[option] : def
  }

  Firepad.prototype.assertReady_ = function (funcName) {
    if (!this.ready_) {
      throw new Error(
        'You must wait for the "ready" event before calling ' + funcName + "."
      )
    }
    if (this.zombie_) {
      throw new Error(
        "You can't use a Firepad after calling dispose()!  [called " +
          funcName +
          "]"
      )
    }
  }

  Firepad.prototype.makeImageDialog_ = function () {
    this.makeDialog_("img", "Insert image url")
  }

  Firepad.prototype.makeDialog_ = function (id, placeholder) {
    var self = this

    var hideDialog = function () {
      var dialog = document.getElementById("overlay")
      dialog.style.visibility = "hidden"
      self.firepadWrapper_.removeChild(dialog)
    }

    var cb = function () {
      var dialog = document.getElementById("overlay")
      dialog.style.visibility = "hidden"
      var src = document.getElementById(id).value
      if (src !== null) self.insertEntity(id, { src: src })
      self.firepadWrapper_.removeChild(dialog)
    }

    var input = utils.elt("input", null, {
      class: "firepad-dialog-input",
      id: id,
      type: "text",
      placeholder: placeholder,
      autofocus: "autofocus",
    })

    var submit = utils.elt("a", "Submit", {
      class: "firepad-btn",
      id: "submitbtn",
    })
    utils.on(submit, "click", utils.stopEventAnd(cb))

    var cancel = utils.elt("a", "Cancel", { class: "firepad-btn" })
    utils.on(cancel, "click", utils.stopEventAnd(hideDialog))

    var buttonsdiv = utils.elt("div", [submit, cancel], {
      class: "firepad-btn-group",
    })

    var div = utils.elt("div", [input, buttonsdiv], {
      class: "firepad-dialog-div",
    })
    var dialog = utils.elt("div", [div], {
      class: "firepad-dialog",
      id: "overlay",
    })

    this.firepadWrapper_.appendChild(dialog)
  }

  Firepad.prototype.addPoweredByLogo_ = function () {
    var poweredBy = utils.elt("a", null, { class: "powered-by-firepad" })
    poweredBy.setAttribute("href", "http://www.firepad.io/")
    poweredBy.setAttribute("target", "_blank")
    this.firepadWrapper_.appendChild(poweredBy)
  }

  Firepad.prototype.initializeKeyMap_ = function () {
    function binder(fn) {
      return function (cm) {
        // HACK: CodeMirror will often call our key handlers within a cm.operation(), and that
        // can mess us up (we rely on events being triggered synchronously when we make CodeMirror
        // edits).  So to escape any cm.operation(), we do a setTimeout.
        setTimeout(function () {
          fn.call(cm.firepad)
        }, 0)
      }
    }

    CodeMirror.keyMap["richtext"] = {
      "Ctrl-B": binder(this.bold),
      "Cmd-B": binder(this.bold),
      "Ctrl-I": binder(this.italic),
      "Cmd-I": binder(this.italic),
      "Ctrl-U": binder(this.underline),
      "Cmd-U": binder(this.underline),
      "Ctrl-H": binder(this.highlight),
      "Cmd-H": binder(this.highlight),
      Enter: binder(this.newline),
      Delete: binder(this.deleteRight),
      Backspace: binder(this.deleteLeft),
      Tab: binder(this.indent),
      "Shift-Tab": binder(this.unindent),
      fallthrough: ["default"],
    }
  }

  function colorFromUserId(userId) {
    var a = 1
    for (var i = 0; i < userId.length; i++) {
      a = (17 * (a + userId.charCodeAt(i))) % 360
    }
    var hue = a / 360

    return hsl2hex(hue, 1, 0.75)
  }

  function rgb2hex(r, g, b) {
    function digits(n) {
      var m = Math.round(255 * n).toString(16)
      return m.length === 1 ? "0" + m : m
    }
    return "#" + digits(r) + digits(g) + digits(b)
  }

  function hsl2hex(h, s, l) {
    if (s === 0) {
      return rgb2hex(l, l, l)
    }
    var var2 = l < 0.5 ? l * (1 + s) : l + s - s * l
    var var1 = 2 * l - var2
    var hue2rgb = function (hue) {
      if (hue < 0) {
        hue += 1
      }
      if (hue > 1) {
        hue -= 1
      }
      if (6 * hue < 1) {
        return var1 + (var2 - var1) * 6 * hue
      }
      if (2 * hue < 1) {
        return var2
      }
      if (3 * hue < 2) {
        return var1 + (var2 - var1) * 6 * (2 / 3 - hue)
      }
      return var1
    }
    return rgb2hex(hue2rgb(h + 1 / 3), hue2rgb(h), hue2rgb(h - 1 / 3))
  }

  return Firepad
})()

Object.assign(Firepad, {
  // Export Text classes
  Formatting,
  Text,
  Entity,
  LineFormatting,
  Line,
  TextOperation,
})

export default Firepad
export { Headless } from "./headless.js"
