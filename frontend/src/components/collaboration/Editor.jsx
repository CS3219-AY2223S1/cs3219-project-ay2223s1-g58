import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../api/firebase'
import useAuth from '../../hooks/useAuth'
import Firepad from './lib/firepad'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { indentUnit } from '@codemirror/language'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import throttle from 'lodash.throttle'
import getCursorExtension from './cursorExtension'
import getSelectionExtension from './selectionExtension'
import CursorListener from './cursorListener'
import { Select } from '@chakra-ui/react'

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

const sendCursorData = throttle((updatedEditor, docPath, uid) => {
  db.ref(`${docPath}/users/${uid}/cursor`).set({
    from: updatedEditor.state.selection.main.anchor,
    to: updatedEditor.state.selection.main.head,
  })
}, 80)

const Editor = () => {
  const { auth } = useAuth()
  const { docID } = useParams()
  const editorRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [tabSize, setTabSize] = useState(4)
  const [lang, setLang] = useState('Python')

  const docPath = 'docs/' + docID
  const uid = auth.username

  useEffect(() => {
    const parentNode = editorRef.current
    const codeMirrorInstance = new EditorView({
      parent: editorRef.current,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]), // extension to press tab for indent
        indentUnit.of(indents[tabSize]),
        languageExtensions[lang], // extension for language
        EditorView.lineWrapping, // extension to wrap line
        EditorView.theme({
          // extension to change editor style
          '&': {
            height: '85vh',
            borderColor: 'd3d3d3',
            borderWidth: '3px',
          },
          '.cm-cursor': {
            borderColor: 'black',
            borderWidth: '1px',
          },
        }),
        EditorView.updateListener.of((update) => {
          if (!update.selectionSet && !update.docChanged) return
          sendCursorData(update, docPath, uid) // send cursor data to Firebase
        }),
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
  }, [tabSize, lang, docPath, uid])

  return (
    <>
      {!ready && <h2>Loading editor...</h2>}

      {ready && (
        <div className="flex flex-row">
          <Select onChange={(event) => setLang(event.target.value)}>
            {Object.keys(languageExtensions).map((language, i) => {
              return (
                <option key={i} value={language}>
                  {language}
                </option>
              )
            })}
          </Select>

          <Select onChange={(event) => setTabSize(event.target.value)}>
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
