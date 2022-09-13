import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: 'AIzaSyA4aSt26GSxjrebAMFuSykUEz-xPivu0NM',
  authDomain: 'cs3219-peerprep-24ab8.firebaseapp.com',
  databaseURL:
    'https://cs3219-peerprep-24ab8-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'cs3219-peerprep-24ab8',
  storageBucket: 'cs3219-peerprep-24ab8.appspot.com',
  messagingSenderId: '116710912438',
  appId: '1:116710912438:web:153a1d1acd8d42a2cf5117',
  measurementId: 'G-B4XN4F6NJ1',
}

export const compatApp = firebase.initializeApp(firebaseConfig)
export const db = firebase.database(compatApp)
