const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new Schema({
  name: String,
  user: String,
  description: String,
  category: String,
  ingredients: Array,
  directions: Array,
  comments: Array
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
