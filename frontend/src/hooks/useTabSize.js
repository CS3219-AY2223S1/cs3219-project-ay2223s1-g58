import { useEffect, useState } from 'react'
import { db } from '../api/firebase'

const DEFAULT_TAB = 4

/** 
 * Hook used in collaborative editor to sync tabSize between users.
 * Returns the current tab size, and a function to update it.
 */
const useTabSize = (docPath) => {
  const [tab, setTabLocally] = useState(DEFAULT_TAB)

  useEffect(() => {
    const dbRef = db.ref(`${docPath}/tab`)
    // Listen to tabSize change from the other user
    dbRef.on('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() !== tab) {
        setTabLocally(snapshot.val())
      }
    })
    // Cleanup effect: Detach listener
    return () => dbRef.off()
  })

  const updateTab = (newTab) => {
    if (newTab === tab) return
    setTabLocally(newTab)
    return db.ref(`${docPath}/tab`).set(newTab).catch(console.log)
  }

  return [tab, updateTab]
}

export default useTabSize
