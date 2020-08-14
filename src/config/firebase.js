import * as firebase from 'firebase'

const config = {
  apikey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  dabaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  sotrageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  clientId: process.env.REACT_APP_CIENTID
}
firebase.initializeApp(config)
const googleProvider = new firebase.auth.GoogleAuthProvider()
const firebaseAuth = provider => firebase.auth().signInWithPopup(provider)
const database = firebase.database().ref()

export const authRef = firebase.auth()
export const loginGoogle = () => firebaseAuth(googleProvider)
export const usersRef = database.child('users')
