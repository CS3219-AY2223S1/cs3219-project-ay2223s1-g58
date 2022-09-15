import { TextOperation } from "./text-operation.js"
import { FirebaseAdapter } from "./firebase-adapter.js"
import { EntityManager } from "./entity-manager.js"
import { ParseHtml } from "./parse-html.js"
import { SerializeHtml } from "./serialize-html.js"
import { sentinelConstants } from "./constants.js"
import { textPiecesToInserts } from "./text-pieces-to-inserts.js"
import { getDocument, setDocument } from "./document.js"

import firebase from "firebase/compat/app"
import "firebase/compat/database"

/**
 * Instance of headless Firepad for use in NodeJS. Supports get/set on text/html.
 */
export const Headless = (function () {
  function Headless(refOrPath) {
    // Allow calling without new.
    if (!(this instanceof Headless)) {
      return new Headless(refOrPath)
    }

    var ref
    if (typeof refOrPath === "string") {
      ref = firebase.database().refFromURL(refOrPath)
    } else {
      ref = refOrPath
    }

    this.entityManager_ = new EntityManager()

    this.firebaseAdapter_ = new FirebaseAdapter(ref)
    this.ready_ = false
    this.zombie_ = false
  }

  Headless.prototype.getDocument = function (callback) {
    var self = this

    if (self.ready_) {
      return callback(self.firebaseAdapter_.getDocument())
    }

    self.firebaseAdapter_.on("ready", function () {
      self.ready_ = true
      callback(self.firebaseAdapter_.getDocument())
    })
  }

  Headless.prototype.getText = function (callback) {
    if (this.zombie_) {
      throw new Error(
        "You can't use a firepad.Headless after calling dispose()!"
      )
    }

    this.getDocument(function (doc) {
      var text = doc.apply("")

      // Strip out any special characters from Rich Text formatting
      for (var key in sentinelConstants) {
        text = text.replace(new RegExp(sentinelConstants[key], "g"), "")
      }
      callback(text)
    })
  }

  Headless.prototype.setText = function (text, callback) {
    if (this.zombie_) {
      throw new Error(
        "You can't use a firepad.Headless after calling dispose()!"
      )
    }

    var op = TextOperation().insert(text)
    this.sendOperationWithRetry(op, callback)
  }

  Headless.prototype.initializeFakeDom = function (callback) {
    if (typeof getDocument() === "object") {
      callback()
    } else {
      const require = global.require
      const jsdom = require("jsdom")
      const { JSDOM } = jsdom
      const { window } = new JSDOM("<head></head><body></body>")
      if (getDocument()) {
        // Return if we've already made a jsdom to avoid making more than one
        // This would be easier with promises but we want to avoid introducing
        // another dependency for just headless mode.
        window.close()
        return callback()
      }
      setDocument(window.document)
      callback()
    }
  }

  Headless.prototype.getHtml = function (callback) {
    var self = this

    if (this.zombie_) {
      throw new Error(
        "You can't use a firepad.Headless after calling dispose()!"
      )
    }

    self.initializeFakeDom(function () {
      self.getDocument(function (doc) {
        callback(SerializeHtml(doc, self.entityManager_))
      })
    })
  }

  Headless.prototype.setHtml = function (html, callback) {
    var self = this

    if (this.zombie_) {
      throw new Error(
        "You can't use a firepad.Headless after calling dispose()!"
      )
    }

    self.initializeFakeDom(function () {
      var textPieces = ParseHtml(html, self.entityManager_)
      var inserts = textPiecesToInserts(true, textPieces)
      var op = new TextOperation()

      for (var i = 0; i < inserts.length; i++) {
        op.insert(inserts[i].string, inserts[i].attributes)
      }

      self.sendOperationWithRetry(op, callback)
    })
  }

  Headless.prototype.sendOperationWithRetry = function (operation, callback) {
    var self = this

    self.getDocument(function (doc) {
      var op = operation.clone()["delete"](doc.targetLength)
      self.firebaseAdapter_.sendOperation(op, function (err, committed) {
        if (committed) {
          if (typeof callback !== "undefined") {
            callback(null, committed)
          }
        } else {
          self.sendOperationWithRetry(operation, callback)
        }
      })
    })
  }

  Headless.prototype.dispose = function () {
    this.zombie_ = true // We've been disposed.  No longer valid to do anything.

    this.firebaseAdapter_.dispose()
  }

  return Headless
})()
