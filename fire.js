import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyAJa4x0PAUmW9ZZierj8fID9FHkwdaNCtg",
  authDomain: "quiz-app-using-react-redux.firebaseapp.com",
  databaseURL: "https://quiz-app-using-react-redux.firebaseio.com",
  projectId: "quiz-app-using-react-redux",
  storageBucket: "quiz-app-using-react-redux.appspot.com",
  messagingSenderId: "446803053109"
  };

  
export const fire = firebase.initializeApp(config);
export const firebaseSignOut=fire.auth(); 
export const database=fire.database().ref('/');
