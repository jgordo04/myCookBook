const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const passport = require('passport')

const cookbookController = express.Router()

const Recipe = require('../models/Recipe.js')
const User = require('../models/user')

cookbookController.get('/new', (req,res) => {
  res.render('cookbook/new',{user: req.user })
})

cookbookController.get('/', (req,res) => {
  Recipe.find({ 'user': req.user.username },(err, recipes) => {

    cats = []
    existingCats = {}
    recipes.forEach( (element) => {
      if ( !existingCats[element.category] ){
        existingCats[element.category] = true
        cats.push(element.category)
      }
    })
    res.render('cookbook/show',{user:req.user, recipes, cats})
  })
})

module.exports = cookbookController
