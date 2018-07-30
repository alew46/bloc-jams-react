import React, { Component } from 'react';
import albumData from './../data/albums.js';
import PlayerBar from './PlayerBar.js';
import '../css/Album.css'

class Album extends Component {
  constructor(props){
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      hoveredSongIndex: "",
      hoveredSong: "",
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: .8
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = this.state.album.songs[0].audioSrc;
    this.audioElement.volume = this.state.volume;
  }

    componentDidMount() {
      this.eventListeners = {
        timeupdate: e => {
          this.setState( {currentTime: this.audioElement.currentTime} )
        },
        durationchange: e => {
          this.setState( {duration: this.audioElement.duration} )
        }
      }

        this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    };

    componentWillUnmount() {
      this.audioElement.src = null;
      this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    };

  play() {
    this.audioElement.play();
    this.setState( {isPlaying: true} )
  };

  pause() {
    this.audioElement.pause();
    this.setState( {isPlaying: false} )
  };

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState( {currentSong: song} );
  };


  handleSongClick(song) {
    var isSameSong = this.state.currentSong === song;

    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song);
      }
      this.play();
    }
  };

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  };

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  };


  handleSongHoverOn(song, index) {
    this.setState({hoveredSong: song})
    this.setState({hoveredSongIndex: index})
  };

  handleSongHoverOff(song) {

    this.setState( {hoveredSongIndex: ""} )

  };

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  };

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume });
  };

  formatTime(time) {
    if (isNaN(time)) {
      return "-:--"
    } else {
      var minutes = Math.floor(time / 60);
      var seconds = Math.floor(time % 60);
      (seconds < 10) ? seconds = '0' + seconds : seconds;
      return minutes + ":" + seconds
    }
  };


  render() {
    return (
      <section className="album">
        <section id="album-info">
          <div className="album-info-wrapper">
            <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>


        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            {
              this.state.album.songs.map( (song, index) =>
                <tr className="song" key={index} onClick={ () => this.handleSongClick(song) } onMouseEnter={ () => this.handleSongHoverOn(song, index) }  onMouseLeave={ () => this.handleSongHoverOff(index) }>
                  <td id="song-number-td">

                  { (this.state.isPlaying && this.state.currentSong === song) ?
                    <span className="ion-pause"></span> :
                      (this.state.hoveredSongIndex === index) ?
                        <span className="ion-play"></span> : index+1 }

                  </td>
                  <td id="song-title-td">{song.title}</td>
                  <td id="song-duration-td">{this.formatTime(song.duration)}</td>
                </tr>
              )
            }
          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          volume={this.audioElement.volume}
          formatTime={this.formatTime}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          >
        </PlayerBar>
      </section>
    );
  }
}

export default Album;
