import firebase from 'firebase'
import 'firebase/storage'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: 'periodicimage.firebaseapp.com',
  databaseURL: 'https://periodicimage.firebaseio.com',
  projectId: 'periodicimage',
  storageBucket: 'periodicimage.appspot.com',
  messagingSenderId: '313047336345',
  appId: '1:313047336345:web:db323cb94d9e0b6d0e7f08',
  measurementId: 'G-6FMER7E1Q6'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export { storage, firebase as default }
