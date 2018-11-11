const _ = require('lodash');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const UserSchema = new Schema({
	first_name: {
		type: String,
		required: false,
		minlength: 2
	},
	last_name: {
		type: String,
		required: false,
		minlength: 2
	},
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 2
	},
	joined: {
		type: Date,
		default: Date.now
	},
	active: {
		type: String,
		default: false
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid e-mail!'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	stationIds: [ String ],
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			requred: true
		}
	}]
})

// method that returns a filtered user object
UserSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email', 'first_name', 'last_name', 'username', 'stationIds'])
}

// method that generates token that is used to validate auth
UserSchema.methods.generateAuthToken = function () {
	let user = this;
	const access = 'auth';
	const token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();

	user.tokens = user.tokens.concat([{ access, token }]);
	return user.save().then(() => token)
}

// method that removes tokend that is used to validate auth
UserSchema.methods.removeToken = function(token) {
	let user = this;

	return user.updateOne({
		$pull: {
			tokens: { token }
		}
	})
}

// method that finds user by token property
UserSchema.statics.findByToken = function (token) {
	let User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, 'secret')
	} catch (e) {
		return Promise.reject({ "error": "invalid token" })
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
}

UserSchema.pre('save', function (next) {
	let user = this;
	const { password } = user;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				user.password = hash;
				next();
			})
		})
	} else {
		next();
	}
})

UserSchema.statics.findByCredentials = function (email, password) {
	let User = this;

	return User.findOne({ email }).then(doc => {
		if (!doc) {
			Promise.reject({ error: "no user found" })
		}
	
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, doc.password, (err, res) => {
				if (res) {
					resolve(doc)
				} else {
					reject({ error: "password invalid" })
				}
			})
		})
	})
}

const User = mongoose.model('user', UserSchema);

module.exports = { User }

