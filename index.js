'use strict';

const axios = require('axios');

const getBeers = function() {
  const beerIds = Array.from({length: 5}, () => Math.floor(Math.random() * 200) + 1).join('|');
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
  var words = originalNames.replace(/,/g, ' ').replace(/-/g, '').split(' ');
  var beerName;

  for(var i = 2; i < 5; i++) {
    var x = Math.floor(Math.random() * words.length) + 1;
    console.log(x);
    beerName += `${words[x]} `;
  }

  return beerName;

};

const createBeerDescription = function() {
  return '🤷';
};

getBeers().then((data) => {
  console.log(createBeerName(data));
  console.log(createBeerDescription());
});
