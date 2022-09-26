import { useEffect, useState } from 'react'
import { db } from '../api/firebase'

const DEFAULT_LANGUAGE = 'Python'

/** 
 * Hook used in collaborative editor to sync the editor's coding language between users.
 * Returns the current language, and a function to update it.
 */
const useLanguage = (docPath) => {
  const [language, setLanguageLocally] = useState(DEFAULT_LANGUAGE)

  useEffect(() => {
    const dbRef = db.ref(`${docPath}/language`)
    // Listen to change from the other user
    dbRef.on('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() !== language) {
        setLanguageLocally(snapshot.val())
      }
    })
    // Cleanup effect: Detach listener
    return () => dbRef.off()
  })

  const updateLang = (newLang) => {
    if (newLang === language) return
    setLanguageLocally(newLang)
    return db.ref(`${docPath}/language`).set(newLang).catch(console.log)
  }

  return [language, updateLang]
}

export default useLanguage
