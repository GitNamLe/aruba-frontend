import React, { Component } from 'react';
import queryString from 'query-string';
import Spotify from 'spotify-web-api-js'
import * as firebase from 'firebase';
import search from '../search.png';
import Modal from 'react-modal';
 
const spotifyWebApi = new Spotify();

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class WebPlayer extends Component {
    player = '';
    constructor(props) {
        super(props);
        let parsed = queryString.parse(window.location.search);
        spotifyWebApi.setAccessToken(parsed.access_token)

        this.state = {
        deviceId: "",
        error: "",
        searchTerm: '',
        playlistTracks: [],
        searchResults: [],
        token: parsed.access_token
        };


        this.onSearch = this.onSearch.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onAddSong = this.onAddSong.bind(this);
        this.getPlaylistTracks = this.getPlaylistTracks.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

  componentDidMount() {
    this.getPlaylistTracks();
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
    });
  }

  handleLogin() {
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
    }
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
  }

  checkForPlayer() {
    const { token } = this.state;
  
    console.log(token);
    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Matt's Spotify Player",
        getOAuthToken: cb => { cb(this.state.token); },
      });
      this.createEventHandlers();
  
      // finally, connect!
      this.player.connect();
    }

  }
  

  async getPlaylistTracks() {
    
    let parsed = queryString.parse(window.location.search);
    const accessToken = parsed.access_token;
    await fetch('https://api.spotify.com/v1/users/namnomnom/playlists/7gmwIJu2qG2xRCFb1CmI17/tracks', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(async response => response.json())
      .then(data => {
        this.setState({playlistTracks: data.items})
      })
    
    console.log(this.state.playlistTracks)

  }

  openModal() {
    this.setState({modalIsOpen: true});
  }
 
 
  closeModal() {
    this.setState({modalIsOpen: false});
  }
 


  async onSearch(e) {
    e.preventDefault();

    // store the current promise in case we need to abort it
    await spotifyWebApi.searchTracks(`${this.state.searchTerm}`, {limit: 6}).then(data => {
      // ...render list of search results...
      this.setState({
        searchResults: data
      })
    }, function(err) {
      console.error(err);
    });

    console.log(this.state.searchResults);
    this.openModal(); 
    

  }
    
  async onAddSong(uri){
    alert("SAJKDBKAJSDBKS");
    await spotifyWebApi.addTracksToPlaylist('7gmwIJu2qG2xRCFb1CmI17',[uri]).then(data => console.log(data));
    this.getPlaylistTracks();
  }

  onEnd() {
  }

  onAddAuth(){
    const ref = firebase.database().ref('test/');

    ref.once('value', function(snapshot){

      snapshot.forEach(function(childSnapshot){
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        var age = childData.clientSecret;
        alert(age);
      })
    });
  }

  render() {
    const tracksToPlay= this.state.playlistTracks.map((val, idx) => (
    <li key={idx} className="track-item">
      <img className="pic" src={val.track.album.images[1].url}/>
      <div className="song-artist">
        <p>Lucid Dream</p>
        <p>by Kali Uchi</p>
      </div>
      <div className="duration">3:10</div>
    </li>
    ))

    const searches = this.state.searchResults.tracks !== undefined ? this.state.searchResults.tracks.items : [];

    return (
      <div className="App">
        <div className="admin-view">
          <button onClick={this.handleLogin}></button>
          <div className="search-bar-container">
            <img src={search} className="search-bar-icon"/>
             <form onSubmit={this.onSearch} className="form">
              <label>
                <input className="search-bar-input" 
                      autoFocus="off" 
                      autoCorrect="off" 
                      type="text" 
                      value={this.state.searchTerm} 
                      placeholder="Nothing but bops..."
                      onChange={e => this.setState({ searchTerm: e.target.value })}/>
              </label>
            </form>          
          </div>







            { this.state.searchResults.tracks ? 
            <div>
              <Modal
                ariaHideApp={false}
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
              <ul>
                <li className="search-list"><img className="search-pics" src={searches[0].album.images[1].url}/><p className="search-names"><span className="plus" onClick={() => this.onAddSong(searches[0].uri)}>+</span>{searches[0].name}</p></li>
                <li className="search-list"><img className="search-pics" src={searches[1].album.images[1].url}/><p className="search-names"><span className="plus" onClick={() => this.onAddSong(searches[1].uri)}>+</span>{searches[1].name}</p></li>
                <li className="search-list"><img className="search-pics" src={searches[2].album.images[1].url}/><p className="search-names"><span className="plus" onClick={() => this.onAddSong(searches[2].uri)}>+</span>{searches[2].name}</p></li>
              </ul>
              <ul>
                <li className="search-list"><img className="search-pics" src={searches[3].album.images[1].url}/><p className="search-names"><span className="plus" onClick={() => this.onAddSong(searches[3].uri)}>+</span>{searches[3].name}</p></li>
                <li className="search-list"><img className="search-pics" src={searches[4].album.images[1].url}/><p className="search-names"><span className="plus" onClick={() => this.onAddSong(searches[4].uri)}>+</span>{searches[4].name}</p></li>
                <li className="search-list"><img className="search-pics" src={searches[5].album.images[1].url}/><p className="search-names"><span className="plus" onClick={() => this.onAddSong(searches[5].uri)}>+</span>{searches[5].name}</p></li>
              </ul>
              </Modal>
            </div> : <div></div>
            }





          <ul>
            {tracksToPlay}
          </ul>
        </div>
      </div>
    )
    }
}
