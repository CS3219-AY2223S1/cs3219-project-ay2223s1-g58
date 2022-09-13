import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../api/firebase'
import useAuth from '../hooks/useAuth'
import Firepad from '@lucafabbian/firepad'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { indentUnit } from '@codemirror/language'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
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

const Editor = () => {
  // console.log("rendered Editor")
  const { auth } = useAuth()
  const { docID } = useParams()
  const editorRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [tabSize, setTabSize] = useState(4)
  const [lang, setLang] = useState('Python')

  useEffect(() => {
    // console.log("useEffect...")
    const docPath = 'docs/' + docID
    const uid = auth.username
  
    const parentNode = editorRef.current
    const codeMirrorInstance = new EditorView({
      parent: editorRef.current,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),   // extension to press tab for indent
        indentUnit.of(indents[tabSize]),
        languageExtensions[lang],   // extension for language
        EditorView.lineWrapping,  // extension to wrap line
        EditorView.theme({    // extension to change editor style
          "&": {
            height: "85vh",
            borderColor: "d3d3d3",
            borderWidth: "3px"
          }
        }),
        
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

    firepad.on('ready', () => {
      setReady(true)
    })

    return () => {
      // console.log("     Clean up useEffect...")
      firepad.off('ready')
      codeMirrorInstance.destroy()
      parentNode.removeChild(parentNode.children[0])
    }
  }, [tabSize, lang, auth.username, docID])

  return (
    <>
      {!ready && <h2>Loading editor...</h2>}

      {
        ready 
        && 
        <div className='flex flex-row'>
          <Select onChange={(event) => setLang(event.target.value)}>
            {Object.keys(languageExtensions).map((language, i) => {
              return <option key={i} value={language}>{language}</option>
            })}
          </Select>
          
          <Select onChange={(event) => setTabSize(event.target.value)}>
            {Object.keys(indents).map((indent, i) => {
              return <option key={i} value={indent}>{indent}</option>
            })}
          </Select>
        </div>
      }
      
      <div ref={editorRef} className={
        ready 
        ? 'mr-2 my-2 flex flex-col justify-start h-min' 
        : 'hidden'
      } />
    </>
  )
}

export default Editor
