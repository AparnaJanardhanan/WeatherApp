var forecastData = [];
var cardElements = [];

let weather = {
  apiKey: "5a6fb62dc5bb9eff567d55bdb69efcb4",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=metric&appid=" +
      this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  fetchForecast: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" +
      this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No forecast found.");
          throw new Error("No forecast found.");
        }
        return response.json();
      })
      .then((data) => {
        for (let i = 5; i < data.list.length; i = i + 9) {
          forecastData.push(data.list[i]);
        }
        this.displayData(forecastData);
      });
  },

  displayData: function (forecastData) {
    for (let i = 0; i < 5; i++) {
      let datas = {
        id: forecastData[i].dt,
        date: forecastData[i].dt_txt,
        temp: forecastData[i].main.temp,
        icon: forecastData[i].weather[0].icon,
        description: forecastData[i].weather[0].description,
        humidity: forecastData[i].main.humidity,
        wind: forecastData[i].wind.speed,
      };
      createCardElement(datas);
    }
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + data.name + "')";
  },
  search: function () {
    deleteCardElements();
    forecastData = [];
    this.fetchWeather(document.querySelector(".search-bar").value);
    this.fetchForecast(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

function createCardElement(datas) {
  const cardContainer = document.getElementById("cardContainer");
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = datas.id;

  const cardTitle = document.createElement("h3");

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var d = new Date(datas.date);
  var dayName = days[d.getDay()];
  cardTitle.textContent = dayName;

  const cardTemp = document.createElement("p");
  cardTemp.textContent = datas.temp + "°C";
  const cardIcon = document.createElement("img");
  cardIcon.src = "https://openweathermap.org/img/wn/" + datas.icon + ".png";
  cardIcon.style.marginLeft = "-15px";
  const cardDescript = document.createElement("p");

  const cardDescription = document.createElement("p");
  cardDescription.appendChild(cardIcon);
  cardDescription.appendChild(cardDescript);
  cardDescription.style.display = "flex";

  cardDescript.textContent = datas.description;
  const cardHumidity = document.createElement("p");
  cardHumidity.textContent = "Humidity : " + datas.humidity + "%";
  const cardWind = document.createElement("p");
  cardWind.textContent = "Wind Speed : " + datas.wind + "km/h";

  card.appendChild(cardTitle);
  card.appendChild(cardTemp);
  card.appendChild(cardDescription);
  card.appendChild(cardHumidity);
  card.appendChild(cardWind);

  cardContainer.appendChild(card);
  cardElements.push(card);
}

function deleteCardElements() {
  const cardContainer = document.getElementById("cardContainer");
  cardElements.forEach(card => {
    cardContainer.removeChild(card);
  });
  cardElements = [];
}

weather.fetchWeather("Bengaluru");
weather.fetchForecast("Bengaluru");
