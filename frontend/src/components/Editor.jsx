import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../api/firebase'
import useAuth from '../hooks/useAuth'
import Firepad from '@lucafabbian/firepad'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { indentWithTab } from '@codemirror/commands'

const Editor = () => {
  // console.log("rendered Editor")
  const { auth } = useAuth()
  const { docID } = useParams()
  const editorRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // console.log("useEffect...")
    const docPath = 'docs/' + docID
    const uid = auth.username

    const codeMirrorInstance = new EditorView({
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        EditorView.lineWrapping,
      ],
      parent: editorRef.current,
    })

    const firepad = Firepad.fromCodeMirror6(
      db.ref(docPath),
      codeMirrorInstance,
      {
        defaultText: '# Type your answer here',
        userId: uid,
      }
    )

    firepad.on('ready', () => {
      setReady(true)
    })

    return () => {
      // console.log("     Clean up useEffect...")
      firepad.off('ready')
      codeMirrorInstance.destroy()
    }
  }, [])

  return (
    <>
      {!ready && <h2>Loading editor...</h2>}
      <div ref={editorRef} className={ready ? '' : 'hidden'} />
    </>
  )
}

export default Editor
