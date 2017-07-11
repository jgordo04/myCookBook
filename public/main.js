const express = require('express')
const request = require('request')
const cheerio = require('cheerio')

var searchForm = document.querySelector('.url-search')
searchForm.addEventListener('submit', function( e ) {
  e.preventDefault()

  var urlInput = document.querySelector('#urlValue')

  request(url, (error, response, html) => {
    if (!error){
      var $ = cheerio.load(html)
      console.log("here")
      $('.header').filter(function(){
        var data = $(this)
        console.log(data)
      })
    }
  })

})
