import { useEffect, useRef, useState } from 'react'
import { db } from '../../api/firebase'
import useAuth from '../../hooks/useAuth'
import useTabSize from '../../hooks/useTabSize'
import useLanguage from '../../hooks/useLanguage'
import Firepad from './lib/firepad'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { indentUnit } from '@codemirror/language'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import getCursorExtension from './cursorExtension'
import getSelectionExtension from './selectionExtension'
import CursorListener from './cursorListener'
import { useColorMode, Select } from '@chakra-ui/react'
import { oneDark, lightTheme } from './editorThemes'

const indents = {
  2: '  ',
  4: '    ',
}

const languageExtensions = {
  'Python': python(),
  'Java': java(),
  'C++': cpp(),
  'JavaScript': javascript(),
}

const Editor = ({ roomId }) => {
  const docPath = 'docs/' + roomId

  const { auth } = useAuth()
  const editorRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [tabSize, setTabSize] = useTabSize(docPath)
  const [lang, setLang] = useLanguage(docPath)
  const { colorMode } = useColorMode()

  const uid = auth.username

  useEffect(() => {
    /** Timer ID returned by setTimeout, used for sending cursor data */
    let timerId = null
    const MIN_DELAY = 1, MAX_DELAY = 100 // Delay duration in milisec to send cursor data
    let lastSend = 0 // Timestamp of last cursor update

    // Delay to send cursor should be in the range [MIN_DELAY, MAX_DELAY]
    const getDelay = () => {
      const elapsed = Date.now() - lastSend
      if (elapsed >= MAX_DELAY) {
        return MIN_DELAY // waited too long already, send ASAP
      }
      if (MAX_DELAY - elapsed < MIN_DELAY) {
        return MIN_DELAY // not deadline yet, but we still need to wait at least MIN_DELAY
      }
      return MAX_DELAY - elapsed // keep waiting the rest of the duration until the deadline
    }

    const parentNode = editorRef.current
    const codeMirrorInstance = new EditorView({
      parent: editorRef.current,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]), // extension to press tab for indent
        indentUnit.of(indents[tabSize]),
        languageExtensions[lang], // extension for language
        EditorView.lineWrapping, // extension to wrap line
        // extension to customize editor style
        colorMode === 'light'
          ? lightTheme
          : oneDark,
        // extension to upload my own cursor data
        EditorView.updateListener.of((update) => {
          if (!update.selectionSet && !update.docChanged) return
          clearTimeout(timerId)
          timerId = setTimeout(() => { // send cursor data to Firebase
            lastSend = Date.now()
            db.ref(`${docPath}/users/${uid}/cursor`).set({
              from: update.state.selection.main.anchor,
              to: update.state.selection.main.head,
            })
          }, getDelay())
        }),
        // extensions to manage the other person's cursor and selection
        getCursorExtension(uid),
        getSelectionExtension(uid),
      ],
    })

    const firepad = Firepad.fromCodeMirror6(
      db.ref(docPath),
      codeMirrorInstance,
      {
        defaultText: '# Type your answer here',
        userId: uid,
      }
    )

    let cl
    firepad.on('ready', () => {
      cl = new CursorListener(docPath, codeMirrorInstance)
      setReady(true)
    })

    return () => {
      firepad.off('ready')
      codeMirrorInstance.destroy()
      cl?.deregister()
      db.ref(`${docPath}/users/${uid}`).set(null)
      parentNode.removeChild(parentNode.children[0])
    }
  })

  return (
    <>
      {!ready && <h2>Loading editor...</h2>}

      {ready && (
        <div className="flex flex-row">
          <Select value={lang} onChange={(event) => setLang(event.target.value)}>
            {Object.keys(languageExtensions).map((language, i) => {
              return (
                <option key={i} value={language}>
                  {language}
                </option>
              )
            })}
          </Select>

          <Select value={tabSize} onChange={(event) => setTabSize(event.target.value)}>
            {Object.keys(indents).map((indent, i) => {
              return (
                <option key={i} value={indent}>
                  {indent}
                </option>
              )
            })}
          </Select>
        </div>
      )}

      <div
        ref={editorRef}
        className={
          ready ? 'my-2 mr-2 flex h-min flex-col justify-start' : 'hidden'
        }
      />
    </>
  )
}

export default Editor
