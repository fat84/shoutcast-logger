const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const songSchema = new Schema({
	artist: String,
	title: String,
   time: {
      type: String
   },
   stationIds: [String]
}, { collection: 'songs' });

module.exports = mongoose.model('songs', songSchema);