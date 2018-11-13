const mongoose = require('mongoose');
const axios = require('axios');
const request = require('request');
const { Station } = require('../models/station');
const { authenticate } = require('../middleware/authenticate');

module.exports = (app) => {

	// entry point fetching stations
	app.get('/api/stations', authenticate, (req, res) => {
		Station.find({ '_id': { $in: req.user.stationIds } }, function (err, docs) {
			if (err) return res.status(500).send({ error: 'no stations found' })
			res.status(200).send(docs)
		});
	})

	// entry point deleting stations from user
	app.delete('/api/stations/:id', authenticate, (req, res) => {
		const { id } = req.params;
		let { user } = req;
		const stationIds = user.stationIds.filter(_id => _id != id)

		user.stationIds = stationIds
		user.save()
			.then(user => res.status(200).send(user))
			.catch(e => res.status(500).send({ error: "something happend when saving user" }))
	})

	// entry point to add a new station if provided url contains a stream
	app.post('/api/stations/add', authenticate, (req, res) => {
		const { url, name } = req.body;
		request.head(url, function (error, response, body) {
			const contentType = response.headers['content-type'];
			if(contentType.includes('audio')){
				const station = new Station({url, name})
				station.save()
					.then(doc => req.user.addStation(doc._id))
					.then(user => res.send(user))
					.catch(e => {
						if (e.code === 11000) {
							Station.findOne({ url }, {'_id': 1}).then(id => req.user.addStation(id).then(user => res.send(user)))
						}
					})
			} else {
				res.send({error: "URL provided is not a stream source"})
			}
		});
	})
}

/* TODO
 *
 * app.post new station
 * 1.) check if url is a stream (DONE)
 * 2.) if stream, save station to stations db and get _id (DONE)
 * 2.1) if url present, find station and get id (DONE)
 * 3.) push id to user stationIds array and update user (DONE)
 * 4.) error handling if url invalid
 */