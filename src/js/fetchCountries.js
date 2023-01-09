import { COUNTRIES_URL } from '../constants';

const nameFields = ['name', 'capital', 'flags', 'population', 'languages'];

export const fetchCountriesByName = name => {
  return fetch(COUNTRIES_URL + `/name/${name}?fields=${nameFields.join(',')}`);
};
