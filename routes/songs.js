const mongoose = require('mongoose');
const { Song } = require('../models/song');
const { authenticate } = require('../middleware/authenticate');

module.exports = (app) => {

	// entry point fetching stations
	app.post('/api/songs', authenticate, (req, res) => {
      const { _id } = req.body;

		Song.find({stationId: _id}, function(err, docs){
         if (err) return res.status(500).send({error: 'no stations found'})
         res.status(200).send(docs)
      });
   })
}
