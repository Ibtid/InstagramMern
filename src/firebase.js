import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyBSk1y1DAXqIVtomBI7aEa8yeLga81wxrQ',
  authDomain: 'instagram-clone-13671.firebaseapp.com',
  projectId: 'instagram-clone-13671',
  storageBucket: 'instagram-clone-13671.appspot.com',
  messagingSenderId: '911868821616',
  appId: '1:911868821616:web:7c490c8523e9a28a5674b5',
  measurementId: 'G-W39GFW7DC4',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
