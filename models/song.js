const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const songSchema = new Schema({
	artist: {
      type: String,
      required: true
   },
	title: {
      type: String,
      required: true
   },
	active_listeners: {
      type: Number,
      required: true
   },
   stationId: {
      type: String,
      required: true
   },
   time: {
      type: Date,
      default: Date.now
   }
}, { collection: 'songs' });

const Song = mongoose.model('songs', songSchema);

module.exports = { Song }