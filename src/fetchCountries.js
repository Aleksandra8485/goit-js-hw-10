export const fetchCountries = name => {
  return fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;
    });
};

// Napisz funkcję fetchCountries(name)
//która tworzy żądanie HTTP do endpointa /name i
//przekazuje obietnicę której wynikiem będzie tablica krajów
// będącą wynikiem żądania.
//Przenieś ją do oddzielnego pliku fetchCountries.js i
//eksportuj ją przy pomocy jej nazwy (named export).

// funkcja pobierająca dane dotyczące krajów z API
