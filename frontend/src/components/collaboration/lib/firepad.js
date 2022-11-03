/*!
 * This file, and the entire ../lib directory is copied from https://github.com/lucafabbian/firepad.
 * lucafabbian's Firepad offers support for CodeMirror and Ace editors. Our project
 * only uses CodeMirror6, but the Ace adapter source code generates some webpack 
 * warnings when compiled, causing our project to fail the CI. Since a PR on his repo can take 
 * time to be merged and resolve the issue, we decide to copy over relevant CodeMirror6
 * source files only.
 * 
 * Some other files also violate eslint rules, which we silence with eslint-disable-next-line.
 * 
 * =========================
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
import { utils } from "./utils.js"
import { EditorClient } from "./editor-client.js"
import { CodeMirror6Adapter } from "./codemirror6-adapter.js"

const Firepad = (function () {

  function Firepad(ref, place, options) {
    if (!(this instanceof Firepad)) {
      return new Firepad(ref, place, options)
    }

    if (place.type !== "CodeMirror6") {
      throw new Error(
        "We only support a CodeMirror6 instance (CodeMirror Rich text not supported)!"
      )
    }

    this.zombie_ = false
    this.codeMirror6_ = this.editor_ = place.editor
    const curValue = this.codeMirror6_.state.doc.toString()
    if (curValue !== "") {
      throw new Error(
        "Can't initialize Firepad with a CodeMirror6 instance that already contains text."
      )
    }

    var editorWrapper = this.codeMirror6_.dom
    this.firepadWrapper_ = utils.elt("div", null, { class: "firepad" })
    editorWrapper.parentNode.replaceChild(this.firepadWrapper_, editorWrapper)
    this.firepadWrapper_.appendChild(editorWrapper)

    // Provide an easy way to get the firepad instance associated with this CodeMirror instance.
    this.editor_.firepad = this

    this.options_ = options || {}

    var userId = this.getOption("userId", ref.push().key)
    var userColor = this.getOption("userColor", colorFromUserId(userId))

    this.firebaseAdapter_ = new FirebaseAdapter(ref, userId, userColor)
    this.editorAdapter_ = new CodeMirror6Adapter(
      this.codeMirror6_,
      this.options_
    )
    this.client_ = new EditorClient(this.firebaseAdapter_, this.editorAdapter_)

    var self = this
    this.firebaseAdapter_.on("cursor", function () {
      self.trigger.apply(self, ["cursor"].concat([].slice.call(arguments)))
    })

    this.firebaseAdapter_.on("ready", function () {
      self.ready_ = true

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

  // For readability, this is the Firepad "constructor", even though right now it's just an alias for Firepad.
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
    }

    this.firepadWrapper_.removeChild(editorWrapper)
    this.firepadWrapper_.parentNode.replaceChild(
      editorWrapper,
      this.firepadWrapper_
    )

    this.editor_.firepad = null

    this.firebaseAdapter_.dispose()
    this.editorAdapter_.detach()
  }

  Firepad.prototype.setUserId = function (userId) {
    this.firebaseAdapter_.setUserId(userId)
  }

  Firepad.prototype.setUserColor = function (color) {
    this.firebaseAdapter_.setColor(color)
  }

  Firepad.prototype.getText = function () {
    this.assertReady_("getText")
    if (this.codeMirror6_) return this.codeMirror6_.state.doc.toString()
    throw new Error('Firepad cannot find CodeMirror6 instance')
  }

  Firepad.prototype.setText = function (textPieces) {
    this.assertReady_("setText")

    if (this.codeMirror6_) {
      return this.codeMirror6_.dispatch({
        changes: {from: 0, to: this.codeMirror6_.state.doc.length, insert: textPieces}
      })
    }
    throw new Error('Firepad cannot find CodeMirror6 instance')
  }

  Firepad.prototype.isHistoryEmpty = function () {
    this.assertReady_("isHistoryEmpty")
    return this.firebaseAdapter_.isHistoryEmpty()
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
  Text,
  TextOperation,
})

export default Firepad
