'use strict';

const axios = require('axios');
const brauhaus = require('brauhaus');

const shuffleArray = function(array) {
  for (let x = array.length - 1; x >= 0; x--) {
    let randomIndex = Math.floor(Math.random() * (x + 1));
    let itemAtIndex = array[randomIndex];
    array[randomIndex] = array[x];
    array[x] = itemAtIndex;
  }

  return array;
};

const getBeers = function() {
  const beerIds = Array.from({length: 5}, () => Math.floor(Math.random() * 234) + 1).join('|');
  console.log(beerIds);
  return axios.get(`https://api.punkapi.com/v2/beers?ids=${beerIds}`)
  // return axios.get(`https://api.punkapi.com/v2/beers?ids=109`)
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

  words = shuffleArray(words);

  // Use the first 3 words in the shuffled array for the name
  for(let i = 0; i < 3; i++) {
    beerName += `${words[i]} `;
  }

  return beerName;

};

const getMalt = function(data, idx) {
  let malts = Array.from(data, v => v.ingredients.malt[idx]);
  malts = shuffleArray(malts);
  let malt = malts[0];
  return malt;
};

const getHop = function(data, idx) {
  let hops = Array.from(data, v => v.ingredients.hops[idx]);
  hops = shuffleArray(hops);
  let hop = hops[0];
  return hop;
};

const getYeast = function(data) {
  let yeasts = Array.from(data, v => v.ingredients.yeast);
  yeasts = shuffleArray(yeasts);
  let yeast = yeasts[0];
  return yeast;
};

getBeers().then((response) => {
  console.log(`Requests left: ${getRateLimit(response.headers)}`);

  console.log(getMalt(response.data, 2));

  // Create recipe
  let r = new brauhaus.Recipe({
    name: createBeerName(response.data),
    description: '🤷‍',
    batchSize: 20.0,
    boilSize: 10.0
  });

  // Add malts
  r.add('fermentable', {
    name: getMalt(response.data, 0).name,
    weight: getMalt(response.data, 0).amount.value
  });

  r.add('fermentable', {
    name: getMalt(response.data, 1).name,
    weight: getMalt(response.data, 1).amount.value
  });

  let tertiaryMalt = getMalt(response.data, 2);

  if (typeof tertiaryMalt !== 'undefined') {
    r.add('fermentable', {
      name: tertiaryMalt.name,
      weight: tertiaryMalt.amount.value
    });
  }

  // Add hops
  r.add('hop', {
    name: getHop(response.data, 0).name,
    weight: getHop(response.data, 0).amount.value,
    time: 60
  });

  r.add('hop', {
    name: getHop(response.data, 1).name,
    weight: getHop(response.data, 1).amount.value,
    time: 30
  });

  let tertiaryHop = getHop(response.data, 2);

  if (typeof tertiaryHop !== 'undefined') {
    r.add('hop', {
      name: tertiaryHop.name,
      weight: tertiaryHop.amount.value,
      time: 0
    });
  }

  // Add yeast
  r.add('yeast', {
    name: getYeast(response.data)
  });

  console.log(r);

});
