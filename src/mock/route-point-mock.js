import {getRandomInteger} from '../utils.js';

const generateDate = () => {
  const dates = [
    ['2019-07-10T22:55:56.845Z', '2019-07-11T11:22:13.375Z'],
    ['2019-06-23T23:51:56.845Z', '2019-06-24T10:22:43.375Z'],
    ['2019-09-12T21:45:56.845Z', '2019-09-13T09:22:15.375Z'],
    ['2019-08-15T20:36:56.845Z', '2019-08-16T08:22:23.375Z'],
    ['2019-11-16T23:28:56.845Z', '2019-11-17T07:22:19.375Z'],
  ];

  const randomIndex = getRandomInteger(0, dates.length - 1);

  return dates[randomIndex];
};

const generateDestination = () => {
  const destinations = ['London', 'Paris', 'Berlin', 'Moscow', 'Rome', 'Instanbul', 'Madrid', 'Budapest'];

  const randomIndex = getRandomInteger(0, destinations.length - 1);

  return destinations[randomIndex];
};

const generateOffers = () => {
  const offers = [
    {
      id: 1,
      title: 'Add luggage',
      price: 30
    },
    {
      id: 2,
      title: 'Switch to comfort class',
      price: 100
    },
    {
      id: 3,
      title: 'Add meal',
      price: 15
    },
    {
      id: 4,
      title: 'Choose seats',
      price: 5
    },
    {
      id: 5,
      title: 'Travel by train',
      price: 40
    }
  ];

  const randomIndex = getRandomInteger(0, offers.length - 2);

  return [offers[randomIndex],offers[randomIndex + 1]];
};

const generateType = () => {
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

export const comparePointsByPriceHihgLow = (a, b) => {
  if ( a.basePrice < b.basePrice ){
    return -1;
  }
  if ( a.basePrice > b.basePrice ){
    return 1;
  }
  return 0;
};

export const comparePointsByPriceLowHigh = (a, b) => comparePointsByPriceHihgLow(b, a);

export const comparePointsByDateHighLow = (a, b) => {
  if ( a.dateFrom < b.dateFrom ){
    return -1;
  }
  if ( a.dateFrom > b.dateFrom ){
    return 1;
  }
  return 0;
};

export const comparePointsByDateLowHigh = (a, b) => comparePointsByDateHighLow(b, a);

export const filterToCurrentDate = (a) => {
  const curDate = new Date().toJSON();
  if ( curDate > a.dateFrom ){
    return -1;
  }
  if ( curDate < a.dateFrom ){
    return 1;
  }
  return 0;
};

export const getRoutePoint = () => {
  const date = generateDate();
  return ({
    basePrice: getRandomInteger(1100, 1900),
    dateFrom: date[0],
    dateTo: date[1],
    destination: generateDestination(),
    id: getRandomInteger(1, 100),
    offers: generateOffers(),
    type: generateType()
  });
};


