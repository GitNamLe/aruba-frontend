import React, { Component } from 'react';
import queryString from 'query-string';
import Spotify from 'spotify-web-api-js'
const spotifyWebApi = new Spotify();

export default class WebPlayer extends Component {
    constructor(props) {
        super(props);
        let parsed = queryString.parse(window.location.search);
        spotifyWebApi.setAccessToken(parsed.access_token)

        this.state = {
        deviceId: "",
        error: "",
        trackName: "Track Name",
        artistName: "Artist Name",
        albumName: "Album Name",
        playing: false,
        position: 0,
        duration: 0,
        token: parsed.access_token,
        searchTerm: ""
        };
        
        this.player = ''
    }

    startPlayer() {
        const { token } = this.state;
      
        console.log(token);

        if (window.Spotify !== null) {
            this.player = new window.Spotify.Player({
                name: "Matt's Spotify Player",
                getOAuthToken: cb => { cb(token); },
            });
            this.createEventHandlers();
        
            // finally, connect!
            this.player.connect(); 
        }
    
    }
      

  onStateChanged(state) {
    // if we're no longer listening to music, we'll get a null state.
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing,
      });
    }
  }


  createEventHandlers() {
    this.player.on('player_state_changed', state => this.onStateChanged(state));
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });
  
    // Playback status updates
    this.player.on('player_state_changed', state => { console.log(state); });
  
    // Ready
    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });
  }
 
  onPrevClick() {
    console.log(this.player);
    this.player.previousTrack();
  }
  
  onPlayClick() {
    this.player.togglePlay();
  }
  
  onNextClick() {
    this.player.nextTrack();
  }

  transferPlaybackHere() {
    const { deviceId, token } = this.state;
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceId ],
        "play": true,
      }),
    });
  }

  handleSearch(){
    const { token, searchTerm } = this.state;

    fetch(`https://api.spotify.com/v1/search?query=${searchTerm}&type=track`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }).then(response => response.json())
    .then(data => console.log(data));

  }

  render() {
    const {
      artistName,
      trackName,
      albumName,
      error,
      position,
      duration,
      playing,
    } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h2>Now Playing</h2>
          <p>A Spotify Web Playback API Demo.</p>
        </div>
  
        {error && <p>Error: {error}</p>}
  
        <div>
            <p><button onClick={() => this.startPlayer()}>Start</button></p>
          <p>Artist: {artistName}</p>
          <p>Track: {trackName}</p>
          <p>Album: {albumName}</p>
          <p>
            <button onClick={() => this.onPrevClick()}>Previous</button>
            <button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</button>
            <button onClick={() => this.onNextClick()}>Next</button>
          </p>
          <p>
            <input type="text" value={this.state.searchTerm} onChange={e => this.setState({ searchTerm: e.target.value })} />
          </p>
          <p>
            <button onClick={() => this.handleSearch()}>Go</button>
          </p>
        </div>
      </div>
    )
    }
}