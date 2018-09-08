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
        

      }

  componentDidMount(){
    spotifyWebApi.getMe().then(data => console.log(data));
    //spotifyWebApi.createPlaylist('namnomnom', {name: 'Weaponized Roombas'},function(err) {console.log(err)}).then(data => console.log(data));
  }

  onSearch() {
    spotifyWebApi.searchTracks(`${this.state.searchTerm}`, {limit: 5}, function(err) {console.log(err)})
    .then(data => console.log(data))
  }
    
  onAddSong(){

  }

  onEnd() {
    //spotifyWebApi.removePlaylist('namnomnom', {name: 'Weaponized Roombas'},function(err) {console.log(err)}).then(data => )
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
          <p>
          <input type="text" value={this.state.searchTerm} onChange={e => this.setState({ searchTerm: e.target.value })} />
          </p>
          <p>
            <button onClick={() => this.onSearch()}>Go</button>
          </p>          
          
          <p><button onClick={() => this.onAddSong()}></button></p>
        </div>
      </div>
    )
    }
}