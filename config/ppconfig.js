const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

//Database
const db = require('../models');

// Passport 'serialized' info to be able to login
passport.serializeUser((user, cb) => {
    cb(null, user.id);
})

passport.deserializeUser((id, cb) => {
    db.user.findByPk(id)
        .then(user => {
            if (user) {
                cb(null, user)
            }
        })
        .catch(error => {
            console.log('yo... There is an error');
            console.log(error); did
        })
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb) => {
    db.user.findOne({
        where: { email }
    })
        .then(user => {
            if (!user || !user.validPassword) {
                cb(null, false);
            } else {
                cb(null, user)
            }
        })
        .catch(error => {
            console.log('******************************* ERROR');
            console.log(error)
        })
}))

module.exports = passport