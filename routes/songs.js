const mongoose = require('mongoose');
const { Song } = require('../models/song');
const { authenticate } = require('../middleware/authenticate');

module.exports = (app) => {

	// entry point fetching stations
	app.get('/api/songs/:id', authenticate, (req, res) => {
      const { id } = req.params;

		Song.find({stationId: id}, function(err, docs){
         if (err) return res.status(500).send({error: 'no stations found'})
         res.status(200).send(docs)
      });
   })
}
