const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
	_id: userOneId,
	username: 'userOne',
	first_name: 'Test',
	last_name: 'Testis',
	email: 'test1@test.com',
	password: 'userOnePass',
	stationIds: [
		 "5be570329d81dab4e445172b",
		 "5be5705d9d81dab4e4451aa4",
		 "5be570829d81dab4e4451dce"
	],
	tokens: [{
		access: 'auth',
		token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth' }, 'secret').toString()
	}]
}, {
	_id: userTwoId,
	username: 'userTwo',
	first_name: 'Testina',
	last_name: 'Testisara',
	email: 'test2@test.com',
	password: 'userTwoPass',
	stationIds: [
		 "5be570329d81dab4e445172b",
		 "5be5705d9d81dab4e4451aa4",
		 "5be570829d81dab4e4451dce"
	],
	tokens: [{
		access: 'auth',
		token: jwt.sign({ _id: userTwoId.toHexString(), access: 'auth' }, 'secret').toString()
	}]
}];

const populateUsers = (done) => {
	User.deleteMany({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() => done());
};

module.exports = { populateUsers, users };