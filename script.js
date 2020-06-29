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
