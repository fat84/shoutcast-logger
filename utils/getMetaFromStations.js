var radio = require('radio-stream');
var parseMetaData = require('./parseMetaData');

// set up dbs
var Stations = require('../server/models/stations');
var Songs = require('./server/models/songs');

// find all stations from "stations collection, prepare event listener and 
// push song changes to subdocument in "songs" collection on metadata event
const getMetaFromStations = () => Stations.find({}, function (err, stations) {
    if (err) { return console.log(err); }

    // append eventlistener
    var streams = stations.map(stream => {
        stream.readStream = radio.createReadStream(stream.url);
        return stream
    })

    // push changes to corresponding document in "songs" collection
    streams.forEach(({ station, readStream }) => {
        readStream.on("metadata", function(data){
            var metadata = parseMetaData(data)
            Songs.findOneAndUpdate({ station }, 
                {$push: { song_list: metadata }}, 
                function(err, song){
                    if (err) { return console.log(err) };
                    var { artist, title } = metadata;
                    console.log(`${date()} ==> ${station} => ${artist} - ${title}`)
            });
        })
    })
});

module.exports = getMetaFromStations;