require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  


// Our routes go here:


app.get("/", (req,res,next) =>{
  res.render('index')
});

app.get("/artist-search", (req,res,next) =>{
  const {artist} = req.query
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
   
    res.render('artist-search', {allArtists : data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (req,res,next) =>{
  const {artistId} = req.params
  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
    console.log('The received data from the API: ', data.body.items);
   
    res.render('albums', {artistAlbums : data.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/tracks/:albumId", (req,res,next) =>{
  const {albumId} = req.params
  spotifyApi
  .getAlbumTracks(albumId, {limit : 6, offset:1})
  .then(data => {
    console.log('The received data from the API: ', data.body.items);
   
    res.render('tracks', {albumTracks : data.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})



app.listen(8000, () => console.log('My Spotify project running on port 8000 🎧 🥁 🎸 🔊'));
