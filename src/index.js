import './css/styles.css';

const DEBOUNCE_DELAY = 300;

import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce'; // instalacja w terminalu: npm install lodash.debounce
import Notiflix from 'notiflix'; //instalacja biblioteki w terminalu: npm install notiflix

//dostęp do elemntów HTML
const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

//Funkcja ta wywoływana jest za każdym razem, gdy użytkownik wprowadza dane
//1)usuwa białe znaki z tekstu wprowadzonego przez użytkownika
//2)sprawdza, czy jest on pusty
//3)jeśli jest pusty, program czyści wyniki wyszukiwania i kończy działanie
//4)jeśli nie jest pusty, funkcja wywołuje funkcję fetchCountries z tekstem wyszukiwania jako argumentem
const searchCountries = debounce(event => {
  const searchText = event.target.value.trim();
  if (searchText === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  //Funkcja fetchCountries pobiera listę krajów z API
  //Jeśli API zwraca 1 kraj,funkcja fetchCountryInfo jest wywoływana z nazwą kraju jako argumentem, a wyniki wyszukiwania są usuwane.
  //Jeśli API zwraca od 2 do 10 krajów, funkcja renderCountryList jest wywoływana, aby wyświetlić listę krajów użytkownikowi, a informacje o kraju są usuwane.
  //Jeśli API zwraca więcej niż 10 krajów, wyniki wyszukiwania i informacje o kraju są usuwane, a użytkownikowi wyświetone jest powiadomienie Notiflix "Too many matches found. Please enter a more specific name."
  //W przypadku błędu w żądaniu API, zostaje wyświetlone powiadomienie Notiflix z informacją o błędzie "Oops, there is no country with that name"
  fetchCountries(searchText)
    .then(countries => {
      if (countries.length === 1) {
        fetchCountryInfo(countries[0].name.official);
        countryList.innerHTML = '';
      } else if (countries.length > 1 && countries.length <= 10) {
        renderCountryList(countries);
        countryInfo.innerHTML = '';
      } else {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      console.log(error);
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}, 300);

searchBox.addEventListener('input', searchCountries);

//Funkcja renderCountryList przyjmuje tablicę krajów jako argument
//generuje listę nazw i flag krajów w HTML
function renderCountryList(countries) {
  const html = countries
    .map(
      country => `
      <li class="country-list">
        <img class="country-serach"  src="${country.flags.svg}" alt="${country.name.official} flag">
        <span>${country.name.official}</span>
      </li>
    `
    )
    .join('');
  countryList.innerHTML = `${html}`;
}

//Funkcja fetchCountryInfo pobiera info o kraju z API na podstawie jego nazwy
//wyświetla nazwę kraju, stolicę, liczbę ludności, języki,flagę
function fetchCountryInfo(countryName) {
  fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then(response => {
      if (response.status === 404) {
        throw new Error('Country not found');
      }
      return response.json();
    })
    .then(data => {
      const country = data[0];
      const languages = Array.isArray(country.languages)
        ? country.languages.map(language => language.name).join(', ')
        : Object.values(country.languages).join(', ');
      const html = `
        <h2>${country.name.official}</h2>
        <p>Capital: ${country.capital.join(', ')}</p>
        <p>Population: ${country.population}</p>
        <p>Languages: ${languages}</p>
        <img src="${country.flags.svg}" alt="${
        country.name.official
      } flag" width="200">
      `;
      countryInfo.innerHTML = html;
    });
}
