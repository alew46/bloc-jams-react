import React, { Component } from 'react';
import albumData from './../data/albums.js';

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
      hoveredSong: ""
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = this.state.album.songs[0].audioSrc
  }

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
      this.setState( {numColContent:""} )
    } else {
      if (!isSameSong) {
        this.setSong(song);
      }
      this.play();
      this.setState( {numColContent:<span className="ion-pause"></span>} )
    }
  };


  handleSongHoverOn(song, index) {
    console.log(index)

    this.setState({hoveredSong: song})
    this.setState({hoveredSongIndex: index})
  };

  handleSongHoverOff(song) {

    this.setState( {hoveredSongIndex: ""} )

  };


  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <h1 id="album-title">{this.state.album.title}</h1>
          <h2 className="artist">{this.state.album.artist}</h2>
          <div id="release-info">{this.state.album.releaseInfo}</div>
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
                  <td>{song.title}</td>
                  <td>{song.duration}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
    );
  }
}

export default Album;
