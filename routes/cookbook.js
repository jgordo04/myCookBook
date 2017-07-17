const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const passport = require('passport')
const fs = require('fs');
const searchFunction = require('../public/searchFunction.js')
// const scrapeResults = require('../public/scrapeResults.js')

const cookbookController = express.Router()

const Recipe = require('../models/Recipe.js')
const User = require('../models/user')


cookbookController.get('/new', (req,res) => {
  res.render('cookbook/new',{user: req.user })
})

cookbookController.get('/', (req,res) => {
  if ( req.user ){
    Recipe.find({})
      .distinct('category')
      .exec( (err, distCats ) => {

        Recipe.find({'user' : req.user.username}, (err,recipes) => {
          tableOfContents = {}
          distCats.forEach((category,i) => {
            tableOfContents[category] = recipes.filter((recipe, j) => {
              return recipe.category === category
            })
          })
          res.render('cookbook/show',{user:req.user, tableOfContents})
        })

      })
  } else {
    res.redirect('/')
  }

  // Recipe.find({ 'user': req.user.username },(err, recipes) => {
  //
  //   cats = []
  //   existingCats = {}
  //   recipes.forEach( (element) => {
  //     if ( !existingCats[element.category] ){
  //       existingCats[element.category] = true
  //       cats.push(element.category)
  //     }
  //   })
  //   res.render('cookbook/show',{user:req.user, recipes, cats})
  // })
})

cookbookController.post('/new/scrape', (req,res) => {
  var urlInput = req.body.url
  let recipe = new Recipe()
  request(urlInput, (error, response, html) => {
    if (!error){
      var $ = cheerio.load(html)
      // var temp = $.html()
      if ( $.html()) {
        let j = 1
        if ($('.ingredients')) {
          console.log("here1")
          let singleIngredient = $('.ingredients').children().first()
          while ( singleIngredient.text()){
            if ( singleIngredient.text().trim() !== "" ){
              console.log("ingredients: " + j)
              j++
              recipe.ingredients.push(singleIngredient.text().trim())
            }
            singleIngredient = singleIngredient.next()
          }
        }
        if ($('.listIngredients')) {
          let singleIngredient = $('.listIngredients').children().first()
          console.log(singleIngredient.text())
          while ( singleIngredient.text()){
            if ( singleIngredient.text().trim() !== "" ){
              recipe.ingredients.push(singleIngredient.text().trim())
            }
            singleIngredient = singleIngredient.next()
          }
        }

        let i = 1
        if ($(".instructions")) {
          let singleInstruction = $('.instructions').children().first()
          while ( singleInstruction.text()){
            if ( singleInstruction.text().trim() !== "" ){
              console.log("instructions: " + i)
              i++
              recipe.directions.push(singleInstruction.text().trim())
            }
            singleInstruction = singleInstruction.next()
          }
        }
        else if ($(".directions")){
          let singleInstruction = $('.directions').children().first()
          while ( singleInstruction.text()){
            if ( singleInstruction.text().trim() !== "" ){
              recipe.directions.push(singleInstruction.text().trim())
            }
            singleInstruction = singleInstruction.next()
          }
          //////////////////////////
          // if ($(".directions")){
            let instructions = $(".directions").filter(function (){
              let a = $(this)
              let singleInstruction = a.children().first()
              while ( singleInstruction.text()){
                if ( singleInstruction.text().trim() !== "" ){
                  recipe.directions.push(singleInstruction.text().trim())
                }
                singleInstruction = singleInstruction.next()
              }
            })
          // }
          ///////////////////////////////
        }
        if ($(".recipeDsList")) {
          let singleInstruction = $('.instructions').children().first()
          while ( singleInstruction.text()){
            if ( singleInstruction.text().trim() !== "" ){
              console.log("instructions: " + i)
              i++
              recipe.directions.push(singleInstruction.text().trim())
            }
            singleInstruction = singleInstruction.next()
          }
        }
      }
      else {
        if ($(".ingredient-list")){
          let ingredients = $(".ingredient-list").filter(function (){
            let a = $(this)
            let singleIngredient = a.children().first()
            while ( singleIngredient.text()){
              if ( singleIngredient.text().trim() !== "" ){
                recipe.ingredients.push(singleIngredient.text().trim())
              }
              singleIngredient = singleIngredient.next()
            }
          })
        }
        else if ($(".ingredients")) {
          console.log("here2")
          let ingredients = $(".ingredients").filter(function (){
            let a = $(this)
            let singleIngredient = a.children().first()
            while ( singleIngredient.text()){
              if ( singleIngredients.text().trim() !== "" ){
                recipe.ingredients.push(singleIngredient.text().trim())
              }
              singleIngredient = singleIngredient.next()
            }
          })
        }

        if ($(".directions")){
          let instructions = $(".directions").filter(function (){
            let a = $(this)
            let singleInstruction = a.children().first()
            while ( singleInstruction.text()){
              if ( singleInstruction.text().trim() !== "" ){
                recipe.directions.push(singleInstruction.text().trim())
              }
              singleInstruction = singleInstruction.next()
            }
          })
        }
        else if ($(".instructions")) {
          let instructions = $(".directions").filter(function (){
            let a = $(this)
            let singleInstruction = a.children().first()
            while ( singleInstruction.text()){
              if ( singleInstruction.text().trim() !== "" ){
                recipe.directions.push(singleInstruction.text().trim())
              }
              singleInstruction = singleInstruction.next()
            }
          })
        }
      }

      recipe.user = req.user.username
      recipe.category = req.body.category

      res.render('cookbook/recipe',{user: req.user, recipe})


    } else {
      console.log("We’ve encountered an error: " + error);
      res.redirect('/cookbook/new')
    }

  })


})

cookbookController.post('/new/api', (req,res) => {

  let recipe = new Recipe()
  recipe.name = req.body.name
  recipe.user = req.user.username
  req.body.ingredients.split('\n').forEach((ingredient,i) => {
    recipe.ingredients.push(ingredient)
  })
  recipe.image = req.body.imageUrl
  recipe.directions.push(req.body.url)

  res.render('cookbook/recipe', {user:req.user, recipe})
})

cookbookController.post('/new/save', (req,res) => {
  let recipe = new Recipe()
  recipe.name = req.body.title
  recipe.category = req.body.category
  recipe.description = req.body.description
  recipe.user = req.user.username
  recipe.image = req.body.image
  req.body.ingredients.split('\n').forEach((ingredient,i) => {
    if ( ingredient.trim() !== "" ){
      recipe.ingredients.push(ingredient.trim())
    }
  })
  req.body.directions.split('\n').forEach((direction,i) => {
    if ( direction.trim() !== "" ){
      recipe.directions.push(direction.trim())
    }
  })
  console.log(recipe)
  recipe.save()
  res.redirect('/')
})

cookbookController.get('/:id', (req,res) => {
  Recipe.findOne({'_id': req.params.id}, (err, recipe) =>{
    res.render('cookbook/single', recipe)
  })
})

cookbookController.post('/delete/:id', (req,res) => {
  Recipe.findOne({'_id':req.params.id}, (err,recipe) => {
    recipe.remove()
    res.redirect('/cookbook')
  })
})

cookbookController.post('/:id',(req,res) => {
  let date = new Date()
  let month = date.getMonth()
  let day = date.getDay()
  let year = date.getFullYear()
  let fullDate = month + "/" + day + "/" + year
  Recipe.findOne({'_id':req.params.id}, (err,recipe) => {
    let newCmnt = {
      comment: req.body.comment,
      date: fullDate
    }
    recipe.comments.push(newCmnt)
    recipe.save()
    res.render('cookbook/single',recipe)
  })
})

module.exports = cookbookController
