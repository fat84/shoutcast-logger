const mongoose = require('mongoose');
const { Station } = require('../models/station');
const { authenticate } = require('../middleware/authenticate');

module.exports = (app) => {

	// entry point fetching stations
	app.post('/api/stations', authenticate, (req, res) => {
      console.log(req.body.stationIds)
		Station.find({'_id': { $in: req.body.stationIds}}, function(err, docs){
         if (err) return res.status(500).send({error: 'no stations found'})
         res.status(200).send(docs)
      });
   })
}
