const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const setMetaListener= require('./utils/setMetaListener');


//set up mongoDB
require('./models/user');
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongoUri, { useNewUrlParser: true });

//start listenintg for meta-data changes in stations
//setMetaListener();

// set up server
const corsOptions = {
  exposedHeaders: 'Authorization',
};
const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors(corsOptions));

require('./routes/auth')(app);
require('./routes/stations')(app);
require('./routes/songs')(app);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))

	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

app.listen(PORT);
console.log("[SERVER] port => " + PORT);

module.exports = { app };