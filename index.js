'use strict';

const axios = require('axios');
const brauhaus = require('brauhaus');

const getBeers = function() {
  const beerIds = Array.from({length: 5}, () => Math.floor(Math.random() * 234) + 1).join('|');
  console.log(beerIds);
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
  let words = originalNames.replace(/,/g, ' ').replace(/-/g, '').replace(/\((.*?)\)/g, '');
  words = words.split(' ').filter(v => v !== '');

  let beerName = '';


  // Shuffle the words array
  for (let w = words.length - 1; w >= 0; w--) {
    let randomIndex = Math.floor(Math.random() * (w + 1));
    let itemAtIndex = words[randomIndex];
    words[randomIndex] = words[w];
    words[w] = itemAtIndex;
  }

  // Use the first 3 words in the shuffled array for the name
  for(let i = 0; i < 3; i++) {
    beerName += `${words[i]} `;
  }

  return beerName;

};

const getFermentables = function(data) {
  // console.log(data[0].ingredients.malt);
  const baseMalt = Array.from(data, v => v.ingredients.malt[0]);
  const secondaryMalt = Array.from(data, v => v.ingredients.malt[1]);
  const tertiaryMalt = Array.from(data, v => v.ingredients.malt[2]);


  console.log(baseMalt[0]);
  console.log(secondaryMalt[0]);
  console.log(tertiaryMalt[0]);


};

getBeers().then((response) => {
  console.log(`Requests left: ${getRateLimit(response.headers)}`);
  console.log(`Name: ${createBeerName(response.data)}`);
  console.log(`Fermentables: ${getFermentables(response.data)}`);


  // Create recipe
  // let r = new brauhaus.Recipe({
  //   name: createBeerName(response.data),
  //   description: '🤷‍',
  //   batchSize: 20.0,
  //   boilSize: 10.0
  // });
  //
  // console.log(r);


});
