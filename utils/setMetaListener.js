var radio = require('radio-stream');
var parseMetaData = require('./parseMetaData');
var getListeners = require('./getListeners');
var Station = require('../server/models/station');
var Song = require('../server/models/song');

// find all stations from "stations collection, prepare event listener 
// and insert new data to "songs" collection
const setMetaListener = () => Station.find({}, function (err, stations) {
   if (err) return console.log(err);

   // append eventlistener
   const streams = stations.map(stream => {
      stream.readStream = radio.createReadStream(stream.url);
      return stream
   })

   // push changes to "songs" collection
   streams.forEach(({ name, url, _id, readStream }) => {
      readStream.on("metadata", function (data) {
         const metadata = parseMetaData(data)

         getListeners(url).then(active_listeners => {
            const song = new Song({
               stationId: _id,
               active_listeners,
               ...metadata
            })
            song.save((err, doc) => {
               if (err) return console.log(err);
               console.log(doc)
            })
         }).catch(e => console.log(e))
      })
   })
});

module.exports = setMetaListener;