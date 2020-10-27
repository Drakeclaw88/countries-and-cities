let myCityView = document.getElementById("cityView")
let myButtonVisited = document.getElementById("buttonVisited");
let visitedView = document.getElementById("visited")
let test = "";
let cityIdLocalStorage = [];

//fetches the json data and then calls countrydropdownmenu function
async function callCountryData() {

    const response = await fetch('land.json')
    const countryData = await response.json()
    countryDropDownMenu(countryData);
}
callCountryData();

//this function recives the json data as an argument, it then only takes the anme of the country and put it in an dynamik dropdownmenu
//the dropdownmenu creates one option per countryname in the array, onchange it sends that value/countryname to getcountryid function
function countryDropDownMenu(aCountryData) {
    let myCountrynames = aCountryData.map(function (item) { return item["countryname"]; });
    document.getElementById("country").innerHTML = `
    <select onchange="getCountryId(this.value)">
            <option>Countries</option>
            ${myCountrynames.map(function (myCountrynames) {
        return `<option>${myCountrynames}</option>`
    })}
        </select>
    `
}


//this function takes the countryname and gets its countryid with an for lop and then sends that value to callcitydata funtion
async function getCountryId(selectedCountry) {
    const response = await fetch('land.json')
    const countryData = await response.json()

    for (let i = 0; i < countryData.length; i++) {
        if (selectedCountry === countryData[i].countryname) {
            countryValue = countryData[i].id;
        }
    }

    callCityData(countryValue);

}

//this just fetches the json data about the cites, and then sends that value and the countryid to citydropdowmmenu
async function callCityData() {

    const response = await fetch('stad.json')
    const cityData = await response.json()
    cityDropdownMenu(cityData, countryValue)

}


//this function takes the countryid and find those cities that have that value in the json stad file. with a forloop it makes a new array of these
//cities, it then creates an dropdownmenu with the names of the cities that belong to that country id.
//onchange it send that city value to cityviews funtions
function cityDropdownMenu(aCityData) {

    let rightCity = []
    for (let i = 0; i < aCityData.length; i++) {
        if (countryValue === aCityData[i].countryid) {
            rightCity.push(aCityData[i].stadname);

        }
    }
    document.getElementById("city").innerHTML = `
<select onchange="cityViews(this.value)" >
        <option>Cities</option>
        ${rightCity.map(function (rightCity) {
        return `<option>${rightCity}</option>`
    })}
    </select>
`
}


//with a for loop it will fin d the right index for the selected city and it will write out the city name and population with innerhtml
//it will also add a button on the screen, with eventlistener with click on it. when you click it it will store that city id in 
// an array and stringify it to localstorage item citiesvisited
async function cityViews(selectedCity) {
    const response = await fetch('stad.json')
    const cityData = await response.json()
    let htmlString = "";


    for (let i = 0; i < cityData.length; i++) {
        if (selectedCity === cityData[i].stadname) {
            htmlString += "<p>" + "City name: " + cityData[i].stadname + "</p>"
            htmlString += "<P>" + "it has a population of " + cityData[i].population + "people" + "</p>"
            myCityView.innerHTML = htmlString;
            myCityView.insertAdjacentHTML("beforeend", "<div><button id='buttonVisited'>I have been here</button></div>");
            let myButtonVisited = document.getElementById("buttonVisited");
            myButtonVisited.addEventListener("click", function () {

                cityIdLocalStorage.push(cityData[i].id);
                localStorage.setItem("citiesVisited", JSON.stringify(cityIdLocalStorage));

            })
        }
    }
}

//this button will parse the string/array in localstorage and then write out the city names on the screen, it will also calculate the combined
//population in all the cities from localstorage
async function visitedViewButton() {
    const response = await fetch('stad.json')
    const cityData = await response.json()
    let visitedView = document.getElementById("visited")
    test = JSON.parse(localStorage.getItem("citiesVisited"))
    let htmlStringVisited = "";
    let allPopulation = 0;

    if (localStorage.getItem("citiesVisited") === null) {
        visitedView.innerHTML = "You have not pressed that you visited any cities yet"

    }
    else {
        for (let i = 0; i < test.length; i++) {
            let index = test[i] - 1;

            htmlStringVisited += "<p>" + "City name: " + cityData[index].stadname + "</p>"
            visitedView.innerHTML = htmlStringVisited;
            let population = cityData[index].population
            allPopulation += population
            visitedView.insertAdjacentHTML("beforeend", "<p>The combined population in all the cities you been to is</p>" + allPopulation)

        }
    }
}

//this will remove the item in localstorage
function clearVisitedViewButton() {

    localStorage.removeItem('citiesVisited');
    visitedView.innerHTML = "";
    cityIdLocalStorage = [];

}
