import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as firebase from 'firebase';
import registerServiceWorker from './registerServiceWorker';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA1wiTs6EgtyYX2JUBcbfRUyrqjlw7ThBw",
    authDomain: "aruba-1d5c3.firebaseapp.com",
    databaseURL: "https://aruba-1d5c3.firebaseio.com",
    projectId: "aruba-1d5c3",
    storageBucket: "aruba-1d5c3.appspot.com",
    messagingSenderId: "416115633607"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
