const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { User } = require('../models/user');

const { app } = require('../index');
const { populateUsers, users } = require('./seed/seed');

beforeEach(populateUsers);

describe('GET /api/auth/user', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/api/auth/user')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done)
	})

	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/api/auth/user')
			.expect(401)
			.expect((res) => {
				expect(res.body.error).toBeTruthy()
			})
			.end(done)
	})
})

describe('POST /api/auth/user', () => {

	it('should create a user', (done) => {
		const user = {
			first_name: "Dino",
			last_name: "Kraljeta",
			username: "gazda",
			email: "pockshocks@gmail.com",
			password: "gazda.321"
		}
		request(app)
			.post('/api/auth/user')
			.send(user)
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(user.email);
			})
			.end((err) => {
				if (err) {
					return done(err)
				}

				User.findOne({email: user.email }).then(doc => {
					expect(doc).toBeTruthy();
					expect(doc.password).not.toBe(user.password);
					done();
				})
			});
	})
	it('should return validation errors if request invalid', (done) => {
		const user = {
			first_name: "Dino",
			last_name: "Kraljeta",
			username: "gazda",
			email: "invalid mail",
			password: "gazda.321"
		}

		request(app)
			.post('/api/auth/user')
			.send(user)
			.expect(400)
			.expect((res) => {
				expect(res.body.errors).toBeTruthy();
			})
			.end(done);
	})
	it('should not create user if email in use', (done) => {
		const user = {
			first_name: "Dino",
			last_name: "Kraljeta",
			username: "gazda",
			email: "test1@test.com", // taken from users[0] seed data
			password: "gazda.321"
		}

		request(app)
			.post('/api/auth/user')
			.send(user)
			.expect(400)
			.expect((res) => {
				expect(res.body.errmsg).toBeTruthy();
				expect(res.body.name).toBe("MongoError");
			})
			.end(done);
	})
})

describe('POST /api/auth/login', () => {
	it('should login user and return auth token in header', (done) => {
		const { email, password } = users[0];
		request(app)
			.post('/api/auth/login')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then(doc => {
					expect(doc.tokens[1]).toMatchObject({
						access: 'auth',
						token: res.headers['x-auth']
					})
					done();
				}).catch(e => done(e))
			});
	})

	it('should reject invalid login', (done) => {
		const fakeUser = {
			email: users[1].email,
			password: users[1].password + '1'
		}

		request(app)
			.post('/api/auth/login')
			.send(fakeUser)
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then(doc => {
					expect(users[1].tokens.length).toBe(1)
					done();
				}).catch(e => done(e))
			})
	})
})


describe('DELETE /api/auth/logout', () => {
	it('should remove auth token on logout', (done) => {
		request(app)
			.delete('/api/auth/logout')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeFalsy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then(doc => {
					expect(doc.tokens.length).toBe(0)
					done();
				}).catch(e => done(e))
			})
	})
})

describe('GET /api/stations', () => {
	it('should return stations of active user', (done) => {
		request(app)
			.get('/api/stations')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.length).toBeGreaterThan(0);
				expect(res.body[0]._id).toBe(users[0].stationIds[0]);
				expect(res.body[0]._id).not.toBe(users[1].stationIds[0]);
			})
			.end(done)
	})
	
	it('should return 401 if user not authenticated', (done) => {
		request(app)
			.get('/api/stations')
			.expect(401)
			.end(done)
	})
})

describe('DELETE /api/stations', () => {
	it('should remove station id from user stations array', (done) => {
		request(app)
			.delete(`/api/stations/${users[0].stationIds[0]}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.email).toBe(users[0].email);
				expect(res.body.stationIds).toHaveLength(2);
				expect(res.body.stationIds).not.toEqual(users[0].stationIds);
				expect(res.body.stationIds).toEqual(
					expect.not.arrayContaining([users[0].stationIds[0]]),
				)
			})
			.end(done)
	})
	
	it('should return 401 if user not authenticated', (done) => {
		request(app)
			.delete(`/api/stations/${users[0].stationIds[0]}`)
			.expect(401)
			.end(done)
	})
})



describe('GET /api/songs', () => {
	it('should return songs from station', (done) => {
		request(app)
			.get(`/api/songs/${users[0].stationIds[0]}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.length).toBeGreaterThan(0);
				expect(res.body[0].stationId).toBe(users[0].stationIds[0]);
			})
			.end(done)
	})
	
	it('should return 401 if user not authenticated', (done) => {
		request(app)
			.get(`/api/songs/${users[0].stationIds[0]}`)
			.expect(401)
			.end(done)
	})
})