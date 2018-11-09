const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stationSchema = new Schema({
    station: String,
    url: String,
}, { collection: 'stations' })

module.exports = mongoose.model('stations', stationSchema);