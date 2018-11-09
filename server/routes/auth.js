const mongoose = require('mongoose');
const _ = require('lodash');
const { User } = require('../models/user');
const { authenticate } = require('../middleware/authenticate');

module.exports = (app) => {

	// entry point for creating new user
	app.post('/api/auth/user', (req, res) => {
		const data = _.pick(req.body, [
			'first_name', 'last_name', 'username', 'joined', 'active', 'email', 'password'
		]);
		let user = new User(data);

		user.save()
			.then(() => user.generateAuthToken())
			.then(token => res.header('x-auth', token).send(user))
			.catch(e => res.status(400).send(e))
	})

	app.post('/api/auth/login', (req, res) => {
		const { email, password } = req.body;

		return User.findByCredentials(email, password).then(doc => {
			return doc.generateAuthToken().then(token => {

				res.header('x-auth', token).send(doc)
			})
		}).catch(e => res.status(400).send(e))
	})

	app.delete('/api/auth/logout', authenticate, (req, res) => {
		req.user.removeToken(req.token)
			.then(() => res.status(200).send({ message: "user logged out" }))
			.catch(e => res.status(400).send({ error: "something happend when logging out user" }))
	})

	app.get('/api/auth/user', authenticate, (req, res) => {
		res.send(req.user)
	})

	app.get('/api/auth/users', authenticate, (req, res) => {
		User.find({})
			.then(users => res.status(200).send(users))
			.catch(error => res.status(400).send({error}));
	})
}

