import {nanoid} from 'nanoid';

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

export const getRoutePoint = () => ({
  basePrice: 500,
  dateFrom: new Date().toJSON(),
  dateTo: new Date().toJSON(),
  destination: 5,
  id: nanoid(),
  offers: [],
  type: 'taxi'
});


