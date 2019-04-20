import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";









var config = {

    apiKey: "AIzaSyDAffeVDTeHO463GitGsdNqXJg7GtVaKeg",

    authDomain: "react-slack-clone-fa815.firebaseapp.com",

    databaseURL: "https://react-slack-clone-fa815.firebaseio.com",

    projectId: "react-slack-clone-fa815",

    storageBucket: "react-slack-clone-fa815.appspot.com",

    messagingSenderId: "98195429635"
  };



  firebase.initializeApp(config);



  export default firebase;