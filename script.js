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
    const liEl = $('<li>');
    liEl.text(cityList[i]);
    $('.list-group').append(liEl);
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

function displayCurrent(inputCity) {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&apikey=3335d3205dc42ddae4cd11cb452c07fd`;

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

    // Appending Temp, Humidity, Wind-speed to the card
    $('#main-temp').html(`${response.main.temp}`);
    $('#main-humidity').html(` ${response.main.humidity}`);
    $('#main-wind-speed').html(` ${response.wind.speed}`);

    // API call for UV Index
    const uvURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=3335d3205dc42ddae4cd11cb452c07fd`;
    $.ajax({
      url: uvURL,
      method: 'GET',
    }).then((UVresponse) => {
      $('#main-UV').html(`${UVresponse.value}`);
    });
  });
}

function displayForecast(inputCity) {
  // Generating 5-Day Forecast data
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&apikey=3335d3205dc42ddae4cd11cb452c07fd`;

  // API call for forecast data
  $.ajax({
    url: forecastURL,
    method: 'GET',
  }).then((forecastResponse) => {
    for (let i = 6; i < forecastResponse.list.length; i += 8) {
      const colCardDiv = $('<div>');
      $('#dayforecast').append(colCardDiv);
      colCardDiv.addClass('col-sm');

      const cardDiv = $('<div>');
      cardDiv.appendTo(colCardDiv);
      cardDiv.addClass('card forecastCard');

      const cardBodyDiv = $('<div>');
      cardBodyDiv.appendTo(cardDiv);
      cardBodyDiv.addClass('card-body');

      const hTag = $('</p>');
      const forecastdt = forecastResponse.list[i].dt;
      const forecastDate = moment.unix(forecastdt).format('L');
      hTag.html(`${forecastDate}`);
      hTag.appendTo(cardBodyDiv);

      const weatherSymbol = forecastResponse.list[i].weather[0].icon;
      const iconUrl2 = `http://openweathermap.org/img/w/${weatherSymbol}.png`;
      const imgDiv2 = $('<img>');
      imgDiv2.attr('src', iconUrl2);
      imgDiv2.attr('title', forecastResponse.list[i].weather[0].main);

      imgDiv2.appendTo(cardBodyDiv);

      const p2Tag = $('</p>');
      p2Tag.appendTo(cardBodyDiv);
      p2Tag.text(`Temp: ${forecastResponse.list[i].main.temp}`);

      const p3Tag = $('</p>');
      p3Tag.appendTo(cardBodyDiv);
      p3Tag.text(`Humidity: ${forecastResponse.list[i].main.humidity}`);
    }
  });
}

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

$(document).ready(() => {
  renderCity();

  const cityList = fetchCity();
  const defaultCity = cityList[0] || 'Toronto';
  fetchAndRenderData(defaultCity);

  $('.input-group-append').click(() => {
    const inputCity = $('#input-value').val();
    fetchAndRenderData(inputCity);
  });
});