require("dotenv").config()
var moment = require('moment')
var axios = require('axios')
var keys = require("./keys.js")
var Spotify = require('node-spotify-api')
var fs = require("fs")
var os = require("os")

var argOne = process.argv[2]
var argTwo = process.argv.splice(3, process.argv.length - 1)
argTwo = argTwo.join(' ')

main()

function main() {

/*****************************Spotify*************************************/

var spotify = new Spotify(keys.spotify)

if (argOne === 'spotify-this-song' ) {

    if (argTwo === '' || argTwo === null) {
        argTwo = 'The Sign'
    }

    spotify.search({ type: 'track', query: argTwo }, function(err, data) {

        var artist, song, album, preview

        if (err) {
          return console.log('Error occurred: ' + err)
        }

        if (argTwo === 'The Sign') {
            
            var AOB = data.tracks.items.find(item => {
                    return item.album.artists[0].name === 'Ace of Base'
            })

            artist = AOB.album.artists[0].name
            song = AOB.name
            album = AOB.album.name
            preview = AOB.preview_url 

        } else {
            artist = data.tracks.items[0].album.artists[0].name
            song = data.tracks.items[0].name
            album = data.tracks.items[0].album.name
            preview = data.tracks.items[0].preview_url
        }

        console.log(`Artist: ${artist}`)
        console.log(`Song Name: ${song}`)
        console.log(`Album: ${album}`)
        console.log(`Preview: ${preview}`)
        var array = []
        array.push('Artist: ' + artist, 'Song: ' + song, 'Album: ' + album, 'Preview Clip: ' + preview)
        fs.appendFile('log.txt', array + os.EOL, function(err) {
            if (err) {
                console.log(err)
            }
        })

      })
      
}

/**************************************Bands In Town****************************/

if (argOne === 'concert-this') {
    axios
  .get("https://rest.bandsintown.com/artists/" + argTwo + "/events?app_id=codingbootcamp")
  .then(function(response) {

    for (var i = 0; i < response.data.length; i++) {

        var name = response.data[i].venue.name
        var city = response.data[i].venue.city
        var country = response.data[i].venue.country
        var date = response.data[i].datetime
        var dateTime = new Date(date)
        dateTime = moment(dateTime).format("L")
        console.log(`Venue Name: ${name}`)
        console.log(`Location: ${city}, ${country}`)
        console.log(`Date: ${dateTime}`)
        console.log(`-------------------------------------`)
        var array = []
        array.push('Venue: ' + name, 'City: ' + city, 'Country: ' + country, 'Date: ' + dateTime)
        fs.appendFile('log.txt', array + os.EOL, function(err) {
            if (err) {
                console.log(err)
            }
        })
    }
  })
  .catch(function(error) {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      console.log(error.request)
    } else {
      console.log("Error", error.message)
    }
    console.log(error.config)
  })
}

/*******************************************IMDB**********************************************/

if (argOne === 'movie-this') {

    if (argTwo === '' || argTwo === null) {
        argTwo = 'Mr. Nobody'
    }
    axios
  .get("http://www.omdbapi.com/?&t=" + argTwo + "&apikey=trilogy")
  .then(function(response) {
    var movie = response.data
    var rottenTomatoes = movie.Ratings.find(item => {
        return item.Source === 'Rotten Tomatoes'
    })
    console.log(`Title: ${movie.Title}`)
    console.log(`Release Year: ${movie.Year}`)
    console.log(`IMDB rating: ${movie.imdbRating}`)
    console.log(`Rotten Tomatoes: ${rottenTomatoes.Value}`)
    console.log(`Origin: ${movie.Country}`)
    console.log(`Language: ${movie.Language}`)
    console.log(`Plot: ${movie.Plot}`)
    console.log(`Actors: ${movie.Actors}`)

    var array = []
    array.push('Title: ' + movie.Title, 'Release Year: ' + movie.Year, 'IMDB Rating: ' + movie.imdbRating, 'Rotten Tomatoes: ' + rottenTomatoes.value, 'Origin: ' + movie.Country, 'Lanuage: ' + movie.Language, 'Plot: ' + movie.Plot, 'Actors: ' + movie.Actors)
    fs.appendFile('log.txt', array + os.EOL, function(err) {
        if (err) {
            console.log(err)
        }
    })
  })
  .catch(function(error) {
    if (error.response) {
      
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      console.log(error.request)
    } else {
      console.log("Error", error.message)
    }
    console.log(error.config)
  })
}
}
/************************************Do What It Says**********************************/

if (argOne === 'do-what-it-says') {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error)
        }
      
        var dataArr = data.split(",")
        argOne = dataArr[0]
        argTwo = dataArr[1]
        main()
      
      })
}





