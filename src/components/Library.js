import React, { Component } from 'react';
import albumData from './../data/albums.js';
import { Link } from 'react-router-dom';
import '../css/Library.css'

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = { albums: albumData }
  }

  render() {
    return (
      <section className="Library">
      <h1 className="hero-title">Albums</h1>
        {
          this.state.albums.map( (album, index) =>
            <div className="album-wrapper" key={index}>
              <Link to={`/album/${album.slug}`}>
                <div className="cover-container">
                  <img src={album.albumCover} alt={album.title} className="album-cover" />
                  <div className="cover-overlay"><span className="overlay-span ion-ios-play"></span></div>
                </div>
                <div className="album-title">{album.title}</div>
                <div>{album.artist}</div>
                <div>{album.songs.length} songs</div>
              </Link>
            </div>
          )
        }
      </section>
    );
  }
}

export default Library;
