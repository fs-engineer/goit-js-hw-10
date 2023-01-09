import './css/styles.css';
import { DEBOUNCE_DELAY } from './constants';
import { fetchCountriesByName } from './js/fetchCountries';
import debounce from 'lodash.debounce';
console.log('debounce', debounce);

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  infoWrapEl: document.querySelector('.country-info'),
};

const onChangeInput = e => {
  fetchCountriesByName('ukraine')
    .then(res => res.json())
    .then(data =>
      data.map(({ name, capital, population, flags, languages }) => ({
        name: name?.official,
        capital: capital[0],
        population,
        languages,
        flag: flags?.svg,
      }))
    )
    .then(data => {
      console.log('data', data);
    })
    .catch(err => {
      console.log('err', err);
    });
};

refs.inputEl.addEventListener('input', debounce(onChangeInput, DEBOUNCE_DELAY));
