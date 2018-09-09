import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as firebase from 'firebase';
import registerServiceWorker from './registerServiceWorker';

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyAjHq7O7dNJlCNcal30HleDgeIaaZ2sUHU",
    authDomain: "aruba-9b036.firebaseapp.com",
    databaseURL: "https://aruba-9b036.firebaseio.com",
    projectId: "aruba-9b036",
    storageBucket: "aruba-9b036.appspot.com",
    messagingSenderId: "1049117972776"
    };
    firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
