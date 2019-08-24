const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');


// Init App
const app = express();


// Connect Database
mongoose.connect(config.database);

let db = mongoose.connection;


// Check Error Database
db.on('error', function (err) {
    console.log(err);
});
// Check Connect Database
db.once('open', function () {
    console.log('MongoDB is connect with server....');
});


// Ejs 
app.use(expressLayouts);
app.set('view engine', 'ejs');



// Express body parcer
app.use(express.urlencoded({ extended : true}));


// Express Session 
app.use(
    session({
      secret: 'secrte',
      resave: true,
      saveUninitialized: true
    })
  );



// Connect Flash 
app.use(flash());




// Passport Middlwar
app.use(passport.initialize());
app.use(passport.session());




// Routes 
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users'));



// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    next();
});




// Started Server
const PORT = process.env.Port || 5000;

app.listen(PORT, console.log('Server started on....' + PORT));