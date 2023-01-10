import './css/styles.css';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { DEBOUNCE_DELAY } from './constants';
import { fetchCountriesByName } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import notiflix from 'notiflix';

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  infoWrapEl: document.querySelector('.country-info'),
};

const isShowed = {
  countriesList: false,
  country: false,
};

const makeCountriesListMarkup = countries => {
  return countries
    .map(
      ({ name, flag }) =>
        `<li><img src="${flag}" alt="flag of ${name}" width="30" /><p>${name}</p></li>`
    )
    .join('');
};

const updateMarkup = (markup, el) => {
  el.innerHTML = markup;
};

const makeCountryMarkup = ({ name, flag, capital, population, languages }) => {
  return `<p>Country: <span>${name}</span></p>
  <div>
    <p>Flag: </p>
    <img src="${flag}" alt="flag of ${name}" width="100" />
  </div><p>Capital: <span>${capital}</span></p>
  <p>Population: <span>${population}</span></p>
  <p>Languages: ${Object.values(languages)
    .map(lang => `<span>${lang}</span>`)
    .join(', ')}</p>`;
};

const onChangeInput = e => {
  const sanitizedName = e.target.value.toLowerCase().trim();

  fetchCountriesByName(sanitizedName)
    .then(data => {
      return data.map(({ name, capital, population, flags, languages }) => ({
        name: name?.official,
        capital: capital[0],
        population,
        languages,
        flag: flags?.svg,
      }));
    })
    .then(data => {
      if (data?.length > 10) {
        notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data?.length <= 10 && data?.length >= 2) {
        const countriesListMarkup = makeCountriesListMarkup(data);

        if (isShowed.country) {
          updateMarkup('', refs.infoWrapEl);
          isShowed.country = false;
        }

        updateMarkup(countriesListMarkup, refs.listEl);
        isShowed.countriesList = true;
      } else {
        const countryMarkup = makeCountryMarkup(data[0]);

        if (isShowed.countriesList) {
          updateMarkup('', refs.listEl);
          isShowed.countriesList = false;
        }

        updateMarkup(countryMarkup, refs.infoWrapEl);

        isShowed.country = true;
      }
    })
    .catch(err => {
      console.log(err);
      notiflix.Notify.failure(`Oops, there is no country with that name`);
    });
};

refs.inputEl.addEventListener('input', debounce(onChangeInput, DEBOUNCE_DELAY));
