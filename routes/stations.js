const mongoose = require('mongoose');
const { Station } = require('../models/station');
const { authenticate } = require('../middleware/authenticate');

module.exports = (app) => {

	// entry point fetching stations
	app.get('/api/stations', authenticate, (req, res) => {
		Station.find({'_id': { $in: req.user.stationIds}}, function(err, docs){
         if (err) return res.status(500).send({error: 'no stations found'})
         res.status(200).send(docs)
      });
   })
}
