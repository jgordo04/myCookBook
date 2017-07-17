
var searchForm = document.querySelector('.new-recipe-search')
searchForm.addEventListener('submit', function( e ) {
  e.preventDefault()

  var searchCriteria = document.querySelector('input[name="searchCriteria"]').value
  var APP_ID = '165369b9'
  var APP_KEY = 'fbd97c5348c33d3ef13c0922c0222cb0'
  var url = `https://api.edamam.com/search?q=${searchCriteria}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=3&calories=gte%20591,%20lte%20722&health=alcohol-free`

  var request = new XMLHttpRequest()

  request.addEventListener('load', handleRequest)
  request.open('GET' ,url)
  request.send()

  function handleRequest(){
    var response = JSON.parse(request.response)
    console.log(response)
    var results = {
      recipes: []
    }
    for ( let i = 0; i < response.hits.length; i++ ){
      var singleRecipe = {
         name: response.hits[i].recipe.label,
         ingredients: response.hits[i].recipe.ingredients,
         //directions
         image: response.hits[i].recipe.image,
         url: response.hits[i].recipe.url
      }
      console.log(singleRecipe)
      results.recipes.push(singleRecipe)
    }

    var app = document.querySelector('.searchResultsApp')
    var list = document.createElement('div')
    list.class = 'row'

    for (let i = 0; i < results.recipes.length; i++ ){
      var item = document.createElement('div')
      item.class = 'col-xs-2 col-md-1'
      list.appendChild(item)

      var form = document.createElement('form')
      form.method= 'post'
      form.action = '/cookbook/new/api'
      item.appendChild(form)

      var thumbnail = document.createElement('p')
      thumbnail.class = 'thumbnail'
      form.appendChild(thumbnail)

      var image = document.createElement('img')
      image.src = results.recipes[i].image
      image.name = 'image'
      thumbnail.appendChild(image)
      var imageUrl = document.createElement('input')
      imageUrl.type = 'hidden'
      imageUrl.name = 'imageUrl'
      imageUrl.value = results.recipes[i].image
      thumbnail.appendChild(imageUrl)

      var h4 = document.createElement('h4')

      var label = document.createElement('span')
      label.innerHTML = results.recipes[i].name
      h4.appendChild(label)

      var nameInput = document.createElement('input')
      nameInput.type = 'hidden'
      nameInput.class = 'recipe-link'
      nameInput.name = 'name'
      nameInput.value = results.recipes[i].name
      thumbnail.appendChild(nameInput)
      thumbnail.appendChild(h4)

      var url = document.createElement('input')
      url.type = 'hidden'
      url.class = 'recipe-url'
      url.name = 'url'
      url.value = results.recipes[i].url
      thumbnail.appendChild(url)

      var ingredients = document.createElement('input')
      ingredients.type = 'hidden'
      ingredients.name = 'ingredients'
      let ingVal = ""
      for ( let j = 0; j < results.recipes[i].ingredients.length; j++){
        ingVal += results.recipes[i].ingredients[j].text + "\n"
      }
      ingredients.value = ingVal//results.recipes[i].ingredients
      thumbnail.appendChild(ingredients)

      var viewButton = document.createElement('button')
      viewButton.type = 'submit'
      viewButton.name = 'submit'
      viewButton.innerHTML = 'View'
      thumbnail.appendChild(viewButton)

      var br = document.createElement('br')
      item.appendChild(br)

      list.appendChild(item)

    }

    app.appendChild( list )

  }

})
