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
  return data['x-ratelimit-remaining'];
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

const getPh = function(data) {
  let Phs = Array.from(data, v => v.ph);
  Phs = shuffleArray(Phs);
  let Ph = Phs[0];
  return Ph;
};

const getMash = function(data) {
  let mashes = Array.from(data, v => v.method.mash_temp);
  // console.log(mashes);
  mashes = shuffleArray(mashes);
  let mash = mashes[0];
  // console.log(mash);
  return mash;
};

const getBoilAndBatchVolumes = function(data) {
  let volumes = Array.from(data, v => v.volume);
  let boilVolumes = Array.from(data, v => v.boil_volume);
  volumes = shuffleArray(volumes);
  boilVolumes = shuffleArray(boilVolumes);
  let volume = volumes[0];
  let boilVolume = boilVolumes[0];

  return [volume, boilVolume];
};

getBeers().then((response) => {
  console.log(`Requests left: ${getRateLimit(response.headers)}`);

  // Create recipe
  let r = new brauhaus.Recipe({
    name: createBeerName(response.data),
    description: '🤷‍',
    batchSize: getBoilAndBatchVolumes(response.data)[0].value,
    boilSize: getBoilAndBatchVolumes(response.data)[1].value
  });

  // Add malts
  r.add('fermentable', {
    name: getMalt(response.data, 0).name,
    weight: getMalt(response.data, 0).amount.value
  });

  let secondaryMalt = getMalt(response.data, 1);

  if (typeof secondaryMalt !== 'undefined') {
    r.add('fermentable', {
      name: getMalt(response.data, 1).name,
      weight: getMalt(response.data, 1).amount.value
    });
  }

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

  let secondaryHop = getHop(response.data, 1);

  if (typeof secondaryHop !== 'undefined') {
    r.add('hop', {
      name: secondaryHop.name,
      weight: secondaryHop.amount.value,
      time: 15
    });
  }

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

  r.mash = new brauhaus.Mash({
    name: 'The mash',
    ph: getPh(response.data)
  });

  r.mash.addStep({
      name: 'Saccharification',
      type: 'Infusion',
      time: 60,
      temp: getMash(response.data)[0].temp.value,
      waterRatio: 2.5
  });

  console.log(r)
  r.calculate();

  console.log(' ');
  console.log('Original Gravity: ' + r.og.toFixed(3));
  console.log('Final Gravity: ' + r.fg.toFixed(3));
  console.log('Color: ' + r.color.toFixed(1) + '° SRM (' + r.colorName() + ')');
  console.log('IBU: ' + r.ibu.toFixed(1));
  console.log('Alcohol: ' + r.abv.toFixed(1) + '%');
  console.log('Calories: ' + Math.round(r.calories) + ' kcal');




});
