'use strict';

const axios = require('axios');

const getBeers = function() {
  const beerIds = Array.from({length: 5}, () => Math.floor(Math.random() * 234) + 1).join('|');
  return axios.get(`https://api.punkapi.com/v2/beers?ids=${beerIds}`)
  .then(response => {
    return response;
  })
  .catch(error => {
    console.log(error);
  });
};

const getRateLimit = function(data) {
  return data["x-ratelimit-remaining"];
};

const createBeerName = function(data) {
  const originalNames = Array.from(data, v => v.name).toString();
  // console.log(originalNames);
  let words = originalNames.replace(/,/g, ' ').replace(/-/g, '').replace(/\((.*?)\)/g, '');
  words = words.split(' ').filter(v => v !== '');

  let beerName = '';


  // Shuffle the words array
  for (let w = words.length - 1; w >= 0; w--) {
    var randomIndex = Math.floor(Math.random() * (w + 1));
    var itemAtIndex = words[randomIndex];
    words[randomIndex] = words[w];
    words[w] = itemAtIndex;
  }

  // console.log(words);

  // Use the first 3 words in the shuffled array for the name
  for(let i = 0; i < 3; i++) {
    beerName += `${words[i]} `;
  }

  return beerName;

};

const createBeerDescription = function() {
  return '🤷';
};

getBeers().then((response) => {
  console.log(`Requests left: ${getRateLimit(response.headers)}`);
  console.log(`Name: ${createBeerName(response.data)}`);
  console.log(`Description: ${createBeerDescription()}`);
});
