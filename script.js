// initial default city name
// المدينة الافتراضية هي لندن
let city = "London";

// let's define our HTML elements here
// تعريف عناصر الصفحة التى نحتاجها هنا
const searchForm = document.querySelector("#search"),
    resultCard = document.querySelector('#result'),
    cityOut_elem = document.querySelector('#cityOut'),
    mainIcon_elem = document.querySelector('#mainIcon'),
    mainTemp_elem = document.querySelector('#mainTemp'),
    mainDescription_elem = document.querySelector('#mainDescription'),
    minTemp_elem = document.querySelector('#minTemp'),
    maxTemp_elem = document.querySelector('#maxTemp'),
    humidity_elem = document.querySelector('#humidity'),
    windSpeed_elem = document.querySelector('#windSpeed'),
    time = document.querySelector('footer > time'),
    submitButton = document.querySelector("#searchButton"),
    inputCityName = document.querySelector('#cityIn');


// When the page is fully loaded, fetch weather data for the default city name
// استدعاء الدالة الأساسية للحصول على معلومات الطقس عندما يتم تحميل جميع عناصر الصفحة
document.addEventListener("DOMContentLoaded", function () {
    // استدهاء الدالة الأساسية مع دالة رد
    loadWeatherData(function () {
        // show results card when finished
        resultCard.style.display = "block";
    });
  //fetch background image for the default city name
  loadBackgroundImage();
});


// attach submit event to our search form to get weather data and background image
// استدعاء الدالة الأساسية للحصول على معلومات الطقس والخلفية  عندما يتم الضغط على زر التحديث
searchForm.addEventListener('submit', function (e) {
    // منع السلوك الافتراضي لإرسال النموذج
    e.preventDefault();
    // التأكد أن النموذج صالح
    if (this.checkValidity()) {
        // disable submit button to prevent multi clicks until we get a response
        submitButton.disabled = true;
        submitButton.value = "Loading...";
        city = inputCityName.value;
        // استدعاء الدالة الأساسية مع دالة رد
        loadWeatherData(function () {
            // reset input value
            inputCityName.value = null;
        });
      loadBackgroundImage(function () {
            // reset input value
            inputCityName.value = null;
        });
    }
});



// function to fetch weather data from external server by using it's API
// الدالة الأساسية التي تقوم بالاتصال بالواجهة البرمجية للحصول على معلومات الطقس بحسب المدينة
function loadWeatherData(callbackFunction) {

    const request = new XMLHttpRequest();

    // for more info about openWeatherMap API
    // https://openweathermap.org/current

    const key = "eb9ba4d5906d3eecd90f0bb03297ec8b";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric" +
        "&APPID=" + key;

    request.onreadystatechange = function () {
        // to check we've got a valid response
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText);
            // استدعاء الدالة الخاصة بتحديث معلومات الصفحة
            updateWeatherData(response, callbackFunction);
        }

        // إذا لم يتم الحصول على نتائج. مثلا اسم المدينة غير موجود
        else if (this.readyState === 4 && this.status === 404) {
            alert('No results found for "' + city + '", please check the city name.');
            submitButton.disabled = false;
            submitButton.value = "Update";
            inputCityName.value = null;
        }
    };

    request.open("GET", url, true);
    request.send();
}

// الدالة الخاصة بتحديث معلومات الصفحة
function updateWeatherData(data, callbackFunction = null) {
    // to see what we've got from the API
    // console.log(data);

    // define some variables that we need to show in the card
    const cityName = data.name,
        icon = data.weather[0].icon,
        icon_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png",
        description = data.weather[0].description,
        temp = data.main.temp,
        temp_max = data.main.temp_max,
        temp_min = data.main.temp_min,
        humidity = data.main.humidity,
        windSpeed = data.wind.speed,
        deg = "°",
        percent = "%";

    // set values on the card
    cityOut_elem.innerHTML = cityName;
    mainIcon_elem.setAttribute("src", icon_url);
    mainIcon_elem.setAttribute("alt", description);
    mainTemp_elem.innerHTML = Math.round(temp) + deg;
    mainDescription_elem.innerHTML = description;
    maxTemp_elem.innerHTML = Math.round(temp_max) + deg;
    minTemp_elem.innerHTML = Math.round(temp_min) + deg;
    humidity_elem.innerHTML = humidity + percent;
    windSpeed_elem.innerHTML = windSpeed;

    // الحصول على تاريخ ووقت تسجيل حالة الطقس
    let date = new Date(data.dt * 1000);

    // تعديل نسق التاريخ بحسب المطلوب
    time.innerHTML = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
    }).replace(",", " ").replace(/ /, "/").replace(/ /, "/");

    submitButton.disabled = false;
    submitButton.value = "Get Weather";

    // التأكد أنه تم تمرير دالة ضمنية
    if (callbackFunction) {
        // استدعاء الدالة التي ستنفذ عند انتهاء تنفيذ الكود
        callbackFunction();
    }
}

// =========================================
// 2nd part to get dynamic background image from external server API
// =========================================

function loadBackgroundImage() {
  const requestImage = new XMLHttpRequest();
  const key = "947acf658be88481c212bf99e6314cf6a0c4942b1c7bbbf79ac2416d6a1ed5f0";
  const url = "https://api.unsplash.com/photos/random/?client_id=" + 
        key + 
        "&query=" + 
        city + 
        "&orientation=landscape&w=1920";
  
  requestImage.onreadystatechange = function () {
        // to check we've got a valid response
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText);
            // استدعاء الدالة الخاصة بتحديث معلومات الصفحة
            updateBackgroundImage(response);
        }
    // إذا لم يتم الحصول على نتائج. مثلا اسم المدينة غير موجود
        else if (this.readyState === 4 && this.status === 404) {
            alert('No results found for "' + city + '", please check the city name.');
            submitButton.disabled = false;
            submitButton.value = "Update";
            inputCityName.value = null;
        }
    };
  
   requestImage.open("GET", url, true);
    requestImage.send();
}

function updateBackgroundImage(image) {
  const myImage = image.urls.regular;
 //console.log(myImage);
  
  //set value on body
  document.body.style.background =  "url('" + myImage  + "')";
  document.body.style.backgroundSize = "cover";
  submitButton.disabled = false;
  submitButton.value = "Get Weather";
};