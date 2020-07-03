const API_KEY = '480043a2eae8e0c801509c9dd861f526';

// Retrieving from local storage
function fetchCity() {
  let cities = [];
  const getCity = localStorage.getItem('City');
  if (getCity) cities = JSON.parse(getCity);
  return cities;
}

// Appending cities to Search history
function renderCity() {
  $('.list-group').empty();
  const cityList = fetchCity();
  for (let i = 0; i < cityList.length; i++) {
    const btn = $('<button>');
    const liEl = $('<li>');
    liEl.css('font-size', '12px');
    btn.addClass('btn-responsive m-1');
    btn.html(liEl);
    btn.on('click', () => {
      fetchAndRenderData(cityList[i]);
    });
    liEl.text(cityList[i]);
    $('.list-group').append(btn);
  }
}

// Storing into local storage
function saveCity(city) {
  const cityList = fetchCity();
  for (let i = 0; i < cityList.length; i += 1) {
    if (cityList[i] === city) {
      cityList.splice(i, 1);
      i -= 1;
    }
  }
  cityList.unshift(city);
  localStorage.setItem('City', JSON.stringify(cityList));
}

// Display current weather conditions for the selected city
function displayCurrent(inputCity) {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${API_KEY}`;

  // Creating an AJAX call for the entered city button
  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then((response) => {
    saveCity(inputCity);
    renderCity();
    // Generating images for icon codes
    const iconCode = response.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    const imgDiv = $('<img>');
    imgDiv.attr('src', iconUrl);
    imgDiv.attr('title', response.weather[0].main);

    // Converting unix dates into MM/DD/YYYY
    const date = moment.unix(response.dt).format('L');
    $('#city-name').html(`${response.name} (${date})`);
    $('#city-name').append(imgDiv);

    // Temperature conversion to F
    const tempK = parseInt(273.15);
    const tempinF = parseInt(((response.main.temp - tempK) * 9) / 5 + 32);

    // Appending Temp, Humidity, Wind-speed to the card
    $('#main-temp').html(` ${tempinF} &#8457`);
    $('#main-humidity').html(` ${response.main.humidity} %`);
    $('#main-wind-speed').html(` ${response.wind.speed} MPH`);

    // API call for UV Index
    const uvURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${API_KEY}`;
    $.ajax({
      url: uvURL,
      method: 'GET',
    }).then((UVresponse) => {
      $('#main-UV').html(`${UVresponse.value}`);
    });
  });
}

// Display Forecasted weather conditions for the selected city
function displayForecast(inputCity) {
  // Generating 5-Day Forecast data
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&appid=${API_KEY}`;

  // API call for forecast data
  $.ajax({
    url: forecastURL,
    method: 'GET',
  }).then((forecastResponse) => {
    // forecastResponse.list.forEach((element) => {
    //   console.log(moment.unix(element.dt).format('L'), Math.random() element.weather[0].main);

    for (let i = 6; i < forecastResponse.list.length; i += 8) {
      // creating card divs
      const colCardDiv = $('<div>');
      $('#dayforecast').append(colCardDiv);
      colCardDiv.addClass('col-lg col-sm-12 col-md-12 col-xl mb-1');

      const cardDiv = $('<div>');
      cardDiv.appendTo(colCardDiv);
      cardDiv.addClass('card forecastCard');

      const cardBodyDiv = $('<div>');
      cardBodyDiv.appendTo(cardDiv);
      cardBodyDiv.addClass('card-body');

      // creating <h> tags in cards
      const hTag = $('</p>');
      const forecastdt = forecastResponse.list[i].dt;
      const forecastDate = moment.unix(forecastdt).format('L');
      hTag.html(`${forecastDate}`);
      hTag.appendTo(cardBodyDiv);

      // calling weather forcast API
      const weatherSymbol = forecastResponse.list[i].weather[0].icon;
      const iconUrl2 = `http://openweathermap.org/img/w/${weatherSymbol}.png`;
      const imgDiv2 = $('<img>');
      imgDiv2.attr('src', iconUrl2);
      imgDiv2.attr('title', forecastResponse.list[i].weather[0].main);

      imgDiv2.appendTo(cardBodyDiv);

      const p2Tag = $('</p>');
      p2Tag.appendTo(cardBodyDiv);
      const tempK = parseInt(273.15, 10);
      const forecastTempF = parseInt((((forecastResponse.list[i].main.temp - tempK) * 9) / 5 + 32), 10);
      p2Tag.html(`Temp: ${forecastTempF} &#8457`);

      const p3Tag = $('</p>');
      p3Tag.appendTo(cardBodyDiv);
      p3Tag.text(`Humidity: ${forecastResponse.list[i].main.humidity} %`);
    }
  });
}

// To empty the data and render again after a different city is selected
function fetchAndRenderData(city) {
  $('#dayforecast').html('');
  $('#city-name').html('');
  $('#main-temp').html('');
  $('#main-humidity').html('');
  $('#main-wind-speed').html('');
  $('#main-UV').html('');
  displayCurrent(city);
  displayForecast(city);
}

// To get lat, long and city from Geolocation API
function fetchCityFromGeoLocation(latitude, longitude) {
  const cityURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  $.ajax({
    url: cityURL,
    method: 'GET',
  }).then((response) => {
    fetchAndRenderData(response.name);
  });
}

// To add the user's current location to the initial landing page
function geoFindMe() {
  function success(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    fetchCityFromGeoLocation(latitude, longitude);
  } function error() {
    // return nothing if location is incorrect or does not exist
  } if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

// Logic to display  last searched city forecast on page load
$(document).ready(() => {
  renderCity();
  const cityList = fetchCity();
  const lastCity = cityList[0];
  if (lastCity) {
    fetchAndRenderData(lastCity);
  } else {
    geoFindMe();
  }
  $('.input-group-append').click(() => {
    const inputCity = $('#input-value').val();
    fetchAndRenderData(inputCity);
  });
  $('.btnClass').on('click', () => {
    console.log('Hi');
  });
});
