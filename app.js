const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');


// Connect To Database (NEW) But not working!!!!!!!!!! (because of secret in db.js!!!!!)
//const db = require('./config/database');
// Map global promise - get rid of warning
//mongoose.Promise = global.Promise;
// Connect to mongoose
//mongoose.connect(db.mongoURI, {
    //useMongoClient: true
//})
//.then(() => console.log('MongoDB Connected...'))
//.catch(err => console.log(err));


// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true});
// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to Database '+config.database);
});
// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error '+err);
});

const app = express();

const users = require('./routes/users');
const admins = require('./routes/admin');
// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());



// Create a custom middleware function
const checkUserType = function (req, res, next) {
    const userType = req.originalUrl.split('/')[2];
    // Bring in the passport authentication starategy
    require('./config/passport')(userType, passport);
    next();
};

app.use(checkUserType);


app.use('/users', users);
app.use('/api/admins',admins);

// Index Route
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
