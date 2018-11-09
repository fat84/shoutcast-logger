const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stationSchema = new Schema({
    name: {
       type: String,
       required: true
    },
    url: {
       type: String,
       required: true
    },
}, { collection: 'stations' })

module.exports = mongoose.model('stations', stationSchema);