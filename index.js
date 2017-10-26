'use strict';

const axios = require('axios');

const getBeers = function() {
  const beerIds = Array.from({length: 5}, () => Math.floor(Math.random() * 234) + 1).join('|');
  return axios.get(`https://api.punkapi.com/v2/beers?ids=${beerIds}`)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.log(error);
  });
};

const createBeerName = function(data) {
  const originalNames = Array.from(data, v => v.name).toString();
  let words = originalNames.replace(/,/g, ' ').replace(/-/g, '').replace(/\((.*?)\)/g, '');
  words = words.split(' ').filter(v => v !== '');

  let beerName = '';

  for(let i = 0; i < 3; i++) {
    let x = Math.floor(Math.random() * words.length);
    beerName += `${words[x]} `;
  }

  return beerName;

};

const createBeerDescription = function() {
  return '🤷';
};

getBeers().then((data) => {
  console.log(`Name: ${createBeerName(data)}`);
  console.log(`Description: ${createBeerDescription()}`);
});
