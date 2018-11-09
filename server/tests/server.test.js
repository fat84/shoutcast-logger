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
				expect(res.body.error).toBe("invalid token")
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