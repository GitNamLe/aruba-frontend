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
    work = [];
    constructor(props) {
        super(props);
        let parsed = queryString.parse(window.location.search);
        spotifyWebApi.setAccessToken(parsed.access_token)

        this.state = {
        deviceId: "",
        error: "",
        searchTerm: '',
        playlistTracks: []
        };

        this.onSearch = this.onSearch.bind(this);

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

  async componentDidMount() {
    //spotifyWebApi.createPlaylist('namnomnom', {name: 'Weaponized Roombas'},function(err) {console.log(err)});

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
 
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }
 
  closeModal() {
    this.setState({modalIsOpen: false});
  }
 


  onSearch(e) {
    e.preventDefault();

    // store the current promise in case we need to abort it
    spotifyWebApi.searchTracks(`${this.state.searchTerm}`, {limit: 5}).then(data => {
      // ...render list of search results...
      console.log(data);
    }, function(err) {
      console.error(err);
    });

  }
    
  onAddSong(){
    spotifyWebApi.addTracksToPlaylist('7gmwIJu2qG2xRCFb1CmI17',['spotify:track:0s3nnoMeVWz3989MkNQiRf']).then(data => console.log(data));
    
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

    return (
      <div className="App">
        <div className="admin-view">
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
          <div>
            <button onClick={this.openModal}>Open Modal</button>
              <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
        
                <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
                <button onClick={this.closeModal}>close</button>
                <div>I am a modal</div>
                <form>
                  <input />
                  <button>tab navigation</button>
                  <button>stays</button>
                  <button>inside</button>
                  <button>the modal</button>
                </form>
              </Modal>
            </div>
          <ul>
            {tracksToPlay}
          </ul>
        </div>
      </div>
    )
    }
}