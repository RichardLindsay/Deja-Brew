'use strict';

const axios = require('axios');

const getBeers = function() {
  const beerIds = Array.from({length: 5}, () => Math.floor(Math.random() * 234) + 1).join('|');
  console.log(beerIds);
  return axios.get(`https://api.punkapi.com/v2/beers?ids=${beerIds}`)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.log(error);
  });
};

const createBeerName = function(data) {
  var originalNames = Array.from(data, v => v.name).toString();
  console.log(originalNames);
  var words = Array.from(new Set(originalNames))
  console.log(words);

  var beerName;

  for(var i = 0; i < 3; i++) {
    var x = Math.floor(Math.random() * words.length);
    console.log(x);
    beerName += `${words[x]} `;
  }

  return beerName;

};

const createBeerDescription = function() {
  return '🤷';
};

getBeers().then((data) => {
  console.log(`Name: ${createBeerName(data)}`);
  console.log(createBeerDescription());
});
