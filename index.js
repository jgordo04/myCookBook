const express = require('express')
const hbs = require('express-handlebars')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// mongoose.connect('mongodb://admin:admin1234!@cluster0-shard-00-00-sdhmz.mongodb.net:27017,cluster0-shard-00-01-sdhmz.mongodb.net:27017,cluster0-shard-00-02-sdhmz.mongodb.net:27017/myCookBook>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')

mongoose.connect('mongodb://admin:admin1234@ds163232.mlab.com:63232/mycookbook')

const app = express()
const appController = require('./routes/index.js')
const cookbookController = require('./routes/cookbook.js')

const Recipe = require('./models/Recipe.js')

app.engine('handlebars', hbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const User = require('./models/user')
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use( express.static('public') )

app.use('/', appController)
app.use('/cookbook', cookbookController)

// var firstRecipe = new Recipe({
//   name: 'Test Recipe',
//   user: 'admin',
//   description: 'This is a test recipe',
//   category: 'another cat',
//   ingredients: ['one','two','three'],
//   directions: ['first','second','third'],
//   comments: ['some comment']
// })
//
// firstRecipe.save()

let port = process.env.PORT || 3000
app.listen( port, () => {

  console.log( 'listening on ' + port )

})
