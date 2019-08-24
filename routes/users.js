const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

// Load User Model
const User = require('../models/user');


//Login Page 
router.get('/login', function (req, res) {
    res.render('login');
});


// Register Page
router.get('/register', function (req ,res) {
    res.render('register');
});


// Register
router.post('/register', function (req, res) {
    const {name, email, password, password2} = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please enter all fields'});
    }
    if (password != password2) {
        errors.push({msg: 'Password do not match'});
    }
    if (password.length < 6) {
        if (!name || !email || !password || !password2) {
            errors.push();
        } else {
            errors.push({msg: 'Password must be at least 6 charcters'});
        }
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({email: email}).then(user => {
            if (user) {
                errors.push({msg: 'Email already exists'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash(
                                'success_msg', 
                                'You are now register and can log in'
                            );
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});


module.exports = router;