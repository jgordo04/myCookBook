const express = require('express')
const passport = require('passport')

const appController = express.Router()

const Recipe = require('../models/Recipe.js')
const User = require('../models/user')

appController.get("/", function( req, res ) {
  if ( req.user ){
    // res.render('cookbook/show', { user: req.user })
    res.redirect('/cookbook')
  }
  else {
    res.render('index', { user: req.user })
  }
})

// Signing up as a new user
appController.get('/signup', function( req, res ) {

  res.render('signup', {})

}).post('/signup', function( req, res ) {

  User.register(new User({
    username: req.body.username
  }), req.body.password, function( err, account ) {
    if ( err ) {
      return res.render('register', { account: account })
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/')
    })

  })

})

// Loging in as an existing user
appController.get('/login', function( req, res ) {

  res.render('login', { user: req.user })

}).post('/login',
  passport.authenticate('local'),
  function( req, res ) {
    res.redirect('/')
  }
)

// Logging out
appController.get('/logout', function ( req, res ) {
  req.logout()
  res.redirect('/')
})

appController.get('/about', ( req, res ) => {
  // res.render('about')
})

module.exports = appController
