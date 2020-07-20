# Weather-dashboard

## Website URL: https://sushmakaluva.github.io/Weather-dashboard/

### Description

* Weather dashboard is an app that allows the user to search for a city and displays the current weather conditions as well as a 5-day forecast. 
 This app also uses local storage to save a history of cities for which the user has previously searched.

### How does it work?
 
* Displays the following under current weather conditions:
  * City name
  * Date
  * Temperature
  * Humidity
  * Wind speed
  * UV Index
  * Weather icon
* It has a search history so that users can access their past search terms. Clicking on the city name should perform a new search that returns current and future conditions for that city.
* Includes a 5-Day Forecast for the cities
* Application stores previously searched for cities in localstorage and displays them to the user.
* Application loads last searched city forecast on page load.
* Initial loading of page takes some time to retrieve the current city weather conditions.

### Technologies used to build this site:

* HTML5  
* CSS
* Bootstrap
* Javascript
* Jquery
* JSON
* AJAX
* Web - API's : OpenWeather API & Geolocation API
* Local Storage

### API's used:

* OpenWeather API 
* Geolocation API


### Components used to build this quiz:

+ Moment.js library
+ JSON - Stringify and Parse
+ Bootstrap components - containers,buttons,cards,jumbotrons
+ Bootstrap grids - rows and columns 
+ Javascript functions
+ Local Storage variables
+ Strings, Arrays, Loops, Objects

### Challenges, Opportunities for Improvement
 + This app was created using the Open Weather Map API. In order to get all the information needed, a good deal of manipulation of the response from the get request was needed, including taking information from one response to generate a new request. 
 + For example, the initial search based on city name returns latitude and longitude coordinates, and these coordinates were used to get the UV Index.
 + One improvement with the app is to display the 'city not found error' if the Open Weather Map API fails to find a city that matches what the user typed.


![Screenshot](assets/website_img.png)

