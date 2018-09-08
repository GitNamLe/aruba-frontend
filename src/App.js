import React, { Component } from 'react';
import 'reset-css/reset.css';
import './App.css';
import queryString from 'query-string';

import WebPlayer from './components/web-player';

let defaultStyle = {
  color: '#fff',
  'fontFamily': 'Papyrus'
};

let accessToken = '';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceId: "",
      loggedIn: false,
      error: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 0,
    }
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    accessToken = parsed.access_token;
    if (!accessToken)
      return;
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))
  }


  render() {
    return (
      <div className="App">
        {this.state.user ?
        <div>
          <h1 style={{...defaultStyle, 
            'fontSize': '54px',
            'marginTop': '5px'
          }}>
            {this.state.user.name}'s Playlists
          </h1>
          <WebPlayer />
        </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost') 
              ? 'http://localhost:8888/login' 
              : 'https://better-playlists-backend.herokuapp.com/login' }
          }
          style={{padding: '20px', 'fontSize': '50px', 'marginTop': '20px'}}>Sign in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;
