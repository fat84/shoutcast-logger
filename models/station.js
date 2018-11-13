const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stationSchema = new Schema({
    name: {
       type: String,
       required: true
    },
    url: {
       type: String,
       required: true,
       unique: true
    }
}, { collection: 'stations' })

const Station = mongoose.model('stations', stationSchema);

module.exports = { Station }