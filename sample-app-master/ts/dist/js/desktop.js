/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./ow-game-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games-events */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-hotkeys */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-window */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js"), exports);


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// Biometric Vars
var sufficientSleep;
var sufficientWater;

// Get minimum key to loop through localStorage properly since it's an associative array
var currentMinimumKey;
for (var key in localStorage){
  var keyToInt = parseInt(key);
  if (currentMinimumKey == undefined && !isNaN(keyToInt)) {
    currentMinimumKey = keyToInt;
  }

  if (keyToInt < currentMinimumKey) {
    currentMinimumKey = keyToInt;
  }
}

// Get maximum key to loop through localStorage properly since it's an associative array
var currentMaximumKey;
for (var key in localStorage){
  var keyToInt = parseInt(key);
  if (currentMaximumKey == undefined && !isNaN(keyToInt)) {
    currentMaximumKey = keyToInt;
  }

  if (keyToInt > currentMaximumKey) {
    currentMaximumKey = keyToInt;
  }
}

// Convert localStorage to array of correct values
var localStorageConverted = [];
for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
  var localStorageDataEntry = localStorage.getItem(i.toString());
  localStorageDataEntry = localStorageDataEntry.split(" ");
  var convertGameID = parseInt(localStorageDataEntry[0]);
  var convertKills = parseInt(localStorageDataEntry[1]);
  var convertDeaths = parseInt(localStorageDataEntry[2]);
  var convertAssists = parseInt(localStorageDataEntry[3]);
  var convertOutcome = localStorageDataEntry[4];
  // Convert match time to miliseconds
  var convertMatchLength = localStorageDataEntry[5].split(":");
  // convert hours to miliseconds
  var hours = parseInt(convertMatchLength[0]) * 360000;
  // convert minutes to miliseconds
  var minutes = parseInt(convertMatchLength[1]) * 60000;
  // convert seconds to miliseconds
  var seconds = parseInt(convertMatchLength[2]) * 1000;
  convertMatchLength = hours + minutes + seconds;
  // convert time of day to miliseconds
  var convertTimeofDay = localStorageDataEntry[6].split(":");
  // convert hours to miliseconds
  hours = parseInt(convertTimeofDay[0]) * 3600000;
  minutes = parseInt(convertTimeofDay[1]) * 60000;
  // convert minutes to miliseconds
  convertTimeofDay = hours + minutes;
  // Convert dates to day of week
  var convertDay = Date.parse(localStorageDataEntry[7]);
  convertDay = new Date(convertDay);
  convertDay = convertDay.toString();
  convertDay = convertDay.split(" ");
  convertDay = convertDay[0];
  // Add converted entry
  localStorageConverted[i] = [convertGameID, convertKills, convertDeaths, convertAssists, convertOutcome, convertMatchLength, convertTimeofDay, convertDay];
}

// sufficientSleep = true;
// sufficientWater = true;

if (sufficientSleep || sufficientWater)
{
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  localStorage.setItem("biometricsDate", mm + "/" + dd + "/" + yyyy);
}

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0");
var yyyy = today.getFullYear();
var today = mm + "/" + dd + "/" + yyyy

if (today != localStorage.getItem("biometricsDate"))
{
  sufficientSleep = false;
  sufficientWater = false;
}

// Convert dates to day of week
var today = Date.parse(today);
today = new Date(today);
today = today.toString();
today = today.split(" ");
today = today[0];

// League of Legends
var leagueGames = [];
for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
  var getGameID = localStorageConverted[i][0];
  if (getGameID == 5426) {
    leagueGames.push(localStorageConverted[i]);
  }
}

// Get league average game time
var leagueaverageGameTime = 0;
for (var i = 0; i < leagueGames.length; i++) {
  leagueaverageGameTime += leagueGames[i][5];
}
leagueaverageGameTime /= leagueGames.length;

// Arrays for each day of the week
var leaguesundayGames = [];
var leaguemondayGames = [];
var leaguetuesdayGames = [];
var leaguewednesdayGames = [];
var leaguethursdayGames = [];
var leaguefridayGames = [];
var leaguesaturdayGames = [];
for (i = 0; i < leagueGames.length; i++) {
  switch (leagueGames[i][7]) {
    case "Sun":
      leaguesundayGames.push(leagueGames[i]);
      break;
    case "Mon":
      leaguemondayGames.push(leagueGames[i]);
      break;
    case "Tue":
      leaguetuesdayGames.push(leagueGames[i]);
      break;
    case "Wed":
      leaguewednesdayGames.push(leagueGames[i]);
      break;
    case "Thu":
      leaguethursdayGames.push(leagueGames[i]);
      break;
    case "Fri":
      leaguefridayGames.push(leagueGames[i]);
      break;
    case "Sat":
      leaguesaturdayGames.push(leagueGames[i]);
      break;
    default:
      break;
  }
}

var leagueSundaySlot = getAverageTimeSlotforDay(leaguesundayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("LeagueSundaySlot", leagueSundaySlot);
var leagueMondaySlot = getAverageTimeSlotforDay(leaguemondayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("leagueMondaySlot", leagueMondaySlot);
var leagueTuesdaySlot = getAverageTimeSlotforDay(leaguetuesdayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("leagueTuesdaySlot", leagueTuesdaySlot);
var leagueWednesdaySlot = getAverageTimeSlotforDay(leaguewednesdayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("leagueWednesdaySlot", leagueWednesdaySlot);
var leagueThursdaySlot = getAverageTimeSlotforDay(leaguethursdayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("leagueThursdaySlot", leagueThursdaySlot);
var leagueFridaySlot = getAverageTimeSlotforDay(leaguefridayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("leagueFridaySlot", leagueFridaySlot);
var leagueSaturdaySlot = getAverageTimeSlotforDay(leaguesaturdayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("leagueSaturdaySlot", leagueSaturdaySlot);

var valorantGames = [];
for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
  var getGameID = localStorageConverted[i][0];
  if (getGameID == 21640) {
    valorantGames.push(localStorageConverted[i]);
  }
}

// Get Valorant average game time
var valorantaverageGameTime = 0;
for (var i = 0; i < valorantGames.length; i++) {
  valorantaverageGameTime += valorantGames[i][5];
}
valorantaverageGameTime /= valorantGames.length;

// Arrays for each day of the week
var valorantsundayGames = [];
var valorantmondayGames = [];
var valoranttuesdayGames = [];
var valorantwednesdayGames = [];
var valorantthursdayGames = [];
var valorantfridayGames = [];
var valorantsaturdayGames = [];
for (i = 0; i < valorantGames.length; i++) {
  switch (valorantGames[i][7]) {
    case "Sun":
      valorantsundayGames.push(valorantGames[i]);
      break;
    case "Mon":
      valorantmondayGames.push(valorantGames[i]);
      break;
    case "Tue":
      valoranttuesdayGames.push(valorantGames[i]);
      break;
    case "Wed":
      valorantwednesdayGames.push(valorantGames[i]);
      break;
    case "Thu":
      valorantthursdayGames.push(valorantGames[i]);
      break;
    case "Fri":
      valorantfridayGames.push(valorantGames[i]);
      break;
    case "Sat":
      valorantsaturdayGames.push(valorantGames[i]);
      break;
    default:
      break;
  }
}

var valorantSundaySlot = getAverageTimeSlotforDay(valorantsundayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("ValorantSundaySlot", valorantSundaySlot);
var valorantMondaySlot = getAverageTimeSlotforDay(valorantmondayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("ValorantMondaySlot", valorantMondaySlot);
var valorantTuesdaySlot = getAverageTimeSlotforDay(valoranttuesdayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("ValorantTuesdaySlot", valorantTuesdaySlot);
var valorantWednesdaySlot = getAverageTimeSlotforDay(valorantwednesdayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("ValorantWednesdaySlot", valorantWednesdaySlot);
var valorantThursdaySlot = getAverageTimeSlotforDay(valorantthursdayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("ValorantThursdaySlot", valorantThursdaySlot);
var valorantFridaySlot = getAverageTimeSlotforDay(valorantfridayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("ValorantFridaySlot", valorantFridaySlot);
var valorantSaturdaySlot = getAverageTimeSlotforDay(valorantsaturdayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("ValorantSaturdaySlot", valorantSaturdaySlot);

// Rainbow 6 Seige
var seigeGames = [];
for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
  var getGameID = localStorageConverted[i][0];
  if (getGameID == 10826) {
    seigeGames.push(localStorageConverted[i]);
  }
}

// Get Rainbow 6 Seige average game time
var seigeaverageGameTime = 0;
for (var i = 0; i < seigeGames.length; i++) {
  seigeaverageGameTime += seigeGames[i][5];
}
seigeaverageGameTime /= seigeGames.length;

// Arrays for each day of the week
var seigesundayGames = [];
var seigemondayGames = [];
var seigetuesdayGames = [];
var seigewednesdayGames = [];
var seigethursdayGames = [];
var seigefridayGames = [];
var seigesaturdayGames = [];
for (i = 0; i < seigeGames.length; i++) {
  switch (seigeGames[i][7]) {
    case "Sun":
      seigesundayGames.push(seigeGames[i]);
      break;
    case "Mon":
      seigemondayGames.push(seigeGames[i]);
      break;
    case "Tue":
      seigetuesdayGames.push(seigeGames[i]);
      break;
    case "Wed":
      seigewednesdayGames.push(seigeGames[i]);
      break;
    case "Thu":
      seigethursdayGames.push(seigeGames[i]);
      break;
    case "Fri":
      seigefridayGames.push(seigeGames[i]);
      break;
    case "Sat":
      seigesaturdayGames.push(seigeGames[i]);
      break;
    default:
      break;
  }
}

var seigeSundaySlot = getAverageTimeSlotforDay(seigesundayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("SeigeSundaySlot", seigeSundaySlot);
var seigeMondaySlot = getAverageTimeSlotforDay(seigemondayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("SeigeMondaySlot", seigeMondaySlot);
var seigeTuesdaySlot = getAverageTimeSlotforDay(seigetuesdayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("SeigeTuesdaySlot", seigeTuesdaySlot);
var seigeWednesdaySlot = getAverageTimeSlotforDay(seigewednesdayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("SeigeWednesdaySlot", seigeWednesdaySlot);
var seigeThursdaySlot = getAverageTimeSlotforDay(seigethursdayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("SeigeThursdaySlot", seigeThursdaySlot);
var seigeFridaySlot = getAverageTimeSlotforDay(seigefridayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("SeigeFridaySlot", seigeFridaySlot);
var seigeSaturdaySlot = getAverageTimeSlotforDay(seigesaturdayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
localStorage.setItem("SeigeSaturdaySlot", seigeSaturdaySlot);

document.getElementById("LeagueSundaySlot").innerHTML = localStorage.getItem("LeagueSundaySlot");
document.getElementById("leagueMondaySlot").innerHTML = localStorage.getItem("leagueMondaySlot");
document.getElementById("leagueTuesdaySlot").innerHTML = localStorage.getItem("leagueTuesdaySlot");
document.getElementById("leagueWednesdaySlot").innerHTML = localStorage.getItem("leagueWednesdaySlot");
document.getElementById("leagueThursdaySlot").innerHTML = localStorage.getItem("leagueThursdaySlot");
document.getElementById("leagueFridaySlot").innerHTML = localStorage.getItem("leagueFridaySlot");
document.getElementById("leagueSaturdaySlot").innerHTML = localStorage.getItem("leagueSaturdaySlot");
document.getElementById("ValorantSundaySlot").innerHTML = localStorage.getItem("ValorantSundaySlot");
document.getElementById("ValorantMondaySlot").innerHTML = localStorage.getItem("ValorantMondaySlot");
document.getElementById("ValorantTuesdaySlot").innerHTML = localStorage.getItem("ValorantTuesdaySlot");
document.getElementById("ValorantWednesdaySlot").innerHTML = localStorage.getItem("ValorantWednesdaySlot");
document.getElementById("ValorantThursdaySlot").innerHTML = localStorage.getItem("ValorantThursdaySlot");
document.getElementById("ValorantFridaySlot").innerHTML = localStorage.getItem("ValorantFridaySlot");
document.getElementById("ValorantSaturdaySlot").innerHTML = localStorage.getItem("ValorantSaturdaySlot");
document.getElementById("SeigeSundaySlot").innerHTML = localStorage.getItem("SeigeSundaySlot");
document.getElementById("SeigeMondaySlot").innerHTML = localStorage.getItem("SeigeMondaySlot");
document.getElementById("SeigeTuesdaySlot").innerHTML = localStorage.getItem("SeigeTuesdaySlot");
document.getElementById("SeigeWednesdaySlot").innerHTML = localStorage.getItem("SeigeWednesdaySlot");
document.getElementById("SeigeThursdaySlot").innerHTML = localStorage.getItem("SeigeThursdaySlot");
document.getElementById("SeigeFridaySlot").innerHTML = localStorage.getItem("SeigeFridaySlot");
document.getElementById("SeigeSaturdaySlot").innerHTML = localStorage.getItem("SeigeSaturdaySlot");

function getAverageTimeSlotforDay(array, gameAverageGameTime, sufficientWater, sufficientSleep, dayofWeek)
{
  var dayGamesWeight = [];
        for (var i = 0; i < array.length; i++) {
          var dayKills = array[i][1];
          var dayDeaths = array[i][2];
          var dayAssists = array[i][3];
          if (dayDeaths != 0) {
            var dayKDA = (dayKills + dayAssists) / dayDeaths;
          }
          else {
            var dayKDA = dayKills + dayAssists;
          }
          var gameWeight = dayKDA;
          if (array[i][4] == "win") {
            gameWeight += 5;
            if (array[i][5] <= gameAverageGameTime) {
              var tmpDayGameTime = array[i][5];
              while (tmpDayGameTime <= gameAverageGameTime) {
                tmpDayGameTime += 120000;
                if (tmpDayGameTime <= gameAverageGameTime) {
                  gameWeight++;
                }
              } 
            }
            else {
              var tmpDayGameTime = array[i][5];
              while (tmpDayGameTime > gameAverageGameTime) {
                tmpDayGameTime -= 120000;
                if (tmpDayGameTime > gameAverageGameTime) {
                  gameWeight--;
                }
              }
            }
          } else {
            gameWeight -= 5;
          }
          gameWeight = Math.round(gameWeight);
          if (gameWeight < 0) {
            gameWeight = 0;
          }
          dayGamesWeight.push(gameWeight);
        }
        
        var competingTimeSlots = []
        for (var i = 0; i < array.length; i++) {
          competingTimeSlots[i] = array[i][6] / 3600000;
        }

        var totalCompetingTimeSlots = 0;
        var avgCompetingTimeSlots;
        var totalGameWeight = 0;
        for (var i = 0; i < competingTimeSlots.length; i++) {
          totalCompetingTimeSlots += competingTimeSlots[i] * dayGamesWeight[i];
          totalGameWeight += dayGamesWeight[i];
        }
        avgCompetingTimeSlots = totalCompetingTimeSlots / totalGameWeight;
        var startTime = 0;
        var endTime = 0;
        if (avgCompetingTimeSlots - 1 < 0)
        {
          startTime = 0;
        }
        else
        {
          startTime = avgCompetingTimeSlots - 1;
        }

        if (avgCompetingTimeSlots + 1 > 23.99)
        {
          endTime = 23.99;
        }
        else
        {
          endTime = avgCompetingTimeSlots + 1;
        }

        if (array.length > 0)
        {
          if (array[0][7] == dayofWeek)
          {
            if (sufficientWater)
            {
              // Add 15 min to beginning
              if (startTime - 0.25 < 0)
              {
                startTime = 0;
              }
              else
              {
                startTime -= 0.25;
              }

              // Add 15 min to end
              if (endTime + 0.25 > 23.99)
              {
                endTime = 23.99;
              }
              else
              {
                endTime += 0.25;
              }
            }

            if (sufficientSleep)
            {
              // Add 15 min to beginning
              if (startTime - 0.25 < 0)
              {
                startTime = 0;
              }
              else
              {
                startTime -= 0.25;
              }

              // Add 15 min to end
              if (endTime + 0.25 > 23.99)
              {
                endTime = 23.99;
              }
              else
              {
                endTime += 0.25;
              }
            }
          }
        }

        var startTimeConverted = convertNumToTime(startTime);
        var endTimeConverted = convertNumToTime(endTime);

        var startTimeConvertedArray = startTimeConverted.split(":");
        var startTimeConvertedHours = startTimeConvertedArray[0];
        startTimeConvertedHours = parseInt(startTimeConvertedHours);
        var endTimeConvertedArray = endTimeConverted.split(":");
        var endTimeConvertedHours = endTimeConvertedArray[0];
        endTimeConvertedHours = parseInt(endTimeConvertedHours);

        startTimeConvertedHours = ((startTimeConvertedHours + 11) % 12 + 1);
        endTimeConvertedHours = ((endTimeConvertedHours + 11) % 12 + 1);

        var startTimeString = startTimeConvertedHours + ":" + startTimeConvertedArray[1];
        var endTimeString = endTimeConvertedHours + ":" + endTimeConvertedArray[1];

        if (startTime < 12)
        {
          startTimeString = startTimeString + " AM";
        }
        else
        {
          startTimeString = startTimeString + " PM";
        }

        if (endTime < 12)
        {
          endTimeString = endTimeString + " AM";
        }
        else
        {
          endTimeString = endTimeString + " PM";
        }

        return startTimeString + " - " + endTimeString;
}

function convertNumToTime(number) {
  // Check sign of given number
  var sign = (number >= 0) ? 1 : -1;

  // Set positive value of number of sign negative
  number = number * sign;

  // Separate the int from the decimal part
  var hour = Math.floor(number);
  var decpart = number - hour;

  var min = 1 / 60;
  // Round to nearest minute
  decpart = min * Math.round(decpart / min);

  var minute = Math.floor(decpart * 60) + '';

  // Add padding if need
  if (minute.length < 2) {
  minute = '0' + minute; 
  }

  // Add Sign in final result
  sign = sign == 1 ? '' : '-';

  // Concate hours and minutes
  var time = sign + hour + ':' + minute;

  return time;
}

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGameListener = void 0;
const ow_listener_1 = __webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js");
class OWGameListener extends ow_listener_1.OWListener {
    constructor(delegate) {
        super(delegate);
        this.onGameInfoUpdated = (update) => {
            if (!update || !update.gameInfo) {
                return;
            }
            if (!update.runningChanged && !update.gameChanged) {
                return;
            }
            if (update.gameInfo.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(update.gameInfo);
                }
            }
            else {
                if (this._delegate.onGameEnded) {
                    this._delegate.onGameEnded(update.gameInfo);
                }
            }
        };
        this.onRunningGameInfo = (info) => {
            if (!info) {
                return;
            }
            if (info.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(info);
                }
            }
        };
    }
    start() {
        super.start();
        overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated);
        overwolf.games.getRunningGameInfo(this.onRunningGameInfo);
    }
    stop() {
        overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated);
    }
}
exports.OWGameListener = OWGameListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js":
/*!************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGamesEvents = void 0;
const timer_1 = __webpack_require__(/*! ./timer */ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js");
class OWGamesEvents {
    constructor(delegate, requiredFeatures, featureRetries = 10) {
        this.onInfoUpdates = (info) => {
            this._delegate.onInfoUpdates(info.info);
        };
        this.onNewEvents = (e) => {
            this._delegate.onNewEvents(e);
        };
        this._delegate = delegate;
        this._requiredFeatures = requiredFeatures;
        this._featureRetries = featureRetries;
    }
    async getInfo() {
        return new Promise((resolve) => {
            overwolf.games.events.getInfo(resolve);
        });
    }
    async setRequiredFeatures() {
        let tries = 1, result;
        while (tries <= this._featureRetries) {
            result = await new Promise(resolve => {
                overwolf.games.events.setRequiredFeatures(this._requiredFeatures, resolve);
            });
            if (result.status === 'success') {
                console.log('setRequiredFeatures(): success: ' + JSON.stringify(result, null, 2));
                return (result.supportedFeatures.length > 0);
            }
            await timer_1.Timer.wait(3000);
            tries++;
        }
        console.warn('setRequiredFeatures(): failure after ' + tries + ' tries' + JSON.stringify(result, null, 2));
        return false;
    }
    registerEvents() {
        this.unRegisterEvents();
        overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.addListener(this.onNewEvents);
    }
    unRegisterEvents() {
        overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.removeListener(this.onNewEvents);
    }
    async start() {
        console.log(`[ow-game-events] START`);
        this.registerEvents();
        await this.setRequiredFeatures();
        const { res, status } = await this.getInfo();
        if (res && status === 'success') {
            this.onInfoUpdates({ info: res });
        }
    }
    stop() {
        console.log(`[ow-game-events] STOP`);
        this.unRegisterEvents();
    }
}
exports.OWGamesEvents = OWGamesEvents;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGames = void 0;
class OWGames {
    static getRunningGameInfo() {
        return new Promise((resolve) => {
            overwolf.games.getRunningGameInfo(resolve);
        });
    }
    static classIdFromGameId(gameId) {
        let classId = Math.floor(gameId / 10);
        return classId;
    }
    static async getRecentlyPlayedGames(limit = 3) {
        return new Promise((resolve) => {
            if (!overwolf.games.getRecentlyPlayedGames) {
                return resolve(null);
            }
            overwolf.games.getRecentlyPlayedGames(limit, result => {
                resolve(result.games);
            });
        });
    }
    static async getGameDBInfo(gameClassId) {
        return new Promise((resolve) => {
            overwolf.games.getGameDBInfo(gameClassId, resolve);
        });
    }
}
exports.OWGames = OWGames;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWHotkeys = void 0;
class OWHotkeys {
    constructor() { }
    static getHotkeyText(hotkeyId, gameId) {
        return new Promise(resolve => {
            overwolf.settings.hotkeys.get(result => {
                if (result && result.success) {
                    let hotkey;
                    if (gameId === undefined)
                        hotkey = result.globals.find(h => h.name === hotkeyId);
                    else if (result.games && result.games[gameId])
                        hotkey = result.games[gameId].find(h => h.name === hotkeyId);
                    if (hotkey)
                        return resolve(hotkey.binding);
                }
                resolve('UNASSIGNED');
            });
        });
    }
    static onHotkeyDown(hotkeyId, action) {
        overwolf.settings.hotkeys.onPressed.addListener((result) => {
            if (result && result.name === hotkeyId)
                action(result);
        });
    }
}
exports.OWHotkeys = OWHotkeys;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js":
/*!********************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWListener = void 0;
class OWListener {
    constructor(delegate) {
        this._delegate = delegate;
    }
    start() {
        this.stop();
    }
}
exports.OWListener = OWListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js":
/*!******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWWindow = void 0;
class OWWindow {
    constructor(name = null) {
        this._name = name;
        this._id = null;
    }
    async restore() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.restore(id, result => {
                if (!result.success)
                    console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`);
                resolve();
            });
        });
    }
    async minimize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.minimize(id, () => { });
            return resolve();
        });
    }
    async maximize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.maximize(id, () => { });
            return resolve();
        });
    }
    async hide() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.hide(id, () => { });
            return resolve();
        });
    }
    async close() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            const result = await this.getWindowState();
            if (result.success &&
                (result.window_state !== 'closed')) {
                await this.internalClose();
            }
            return resolve();
        });
    }
    dragMove(elem) {
        elem.className = elem.className + ' draggable';
        elem.onmousedown = e => {
            e.preventDefault();
            overwolf.windows.dragMove(this._name);
        };
    }
    async getWindowState() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.getWindowState(id, resolve);
        });
    }
    static async getCurrentInfo() {
        return new Promise(async (resolve) => {
            overwolf.windows.getCurrentWindow(result => {
                resolve(result.window);
            });
        });
    }
    obtain() {
        return new Promise((resolve, reject) => {
            const cb = res => {
                if (res && res.status === "success" && res.window && res.window.id) {
                    this._id = res.window.id;
                    if (!this._name) {
                        this._name = res.window.name;
                    }
                    resolve(res.window);
                }
                else {
                    this._id = null;
                    reject();
                }
            };
            if (!this._name) {
                overwolf.windows.getCurrentWindow(cb);
            }
            else {
                overwolf.windows.obtainDeclaredWindow(this._name, cb);
            }
        });
    }
    async assureObtained() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.obtain();
            return resolve();
        });
    }
    async internalClose() {
        let that = this;
        return new Promise(async (resolve, reject) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.close(id, res => {
                if (res && res.success)
                    resolve();
                else
                    reject(res);
            });
        });
    }
}
exports.OWWindow = OWWindow;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/timer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
class Timer {
    constructor(delegate, id) {
        this._timerId = null;
        this.handleTimerEvent = () => {
            this._timerId = null;
            this._delegate.onTimer(this._id);
        };
        this._delegate = delegate;
        this._id = id;
    }
    static async wait(intervalInMS) {
        return new Promise(resolve => {
            setTimeout(resolve, intervalInMS);
        });
    }
    start(intervalInMS) {
        this.stop();
        this._timerId = setTimeout(this.handleTimerEvent, intervalInMS);
    }
    stop() {
        if (this._timerId == null) {
            return;
        }
        clearTimeout(this._timerId);
        this._timerId = null;
    }
}
exports.Timer = Timer;


/***/ }),

/***/ "./src/AppWindow.ts":
/*!**************************!*\
  !*** ./src/AppWindow.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppWindow = void 0;
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
class AppWindow {
    constructor(windowName) {
        this.maximized = false;
        this.mainWindow = new overwolf_api_ts_1.OWWindow('background');
        this.currWindow = new overwolf_api_ts_1.OWWindow(windowName);
        const closeButton = document.getElementById('closeButton');
        const maximizeButton = document.getElementById('maximizeButton');
        const minimizeButton = document.getElementById('minimizeButton');
        const header = document.getElementById('header');
        this.setDrag(header);
        closeButton.addEventListener('click', () => {
            this.mainWindow.close();
        });
        minimizeButton.addEventListener('click', () => {
            this.currWindow.minimize();
        });
        maximizeButton.addEventListener('click', () => {
            if (!this.maximized) {
                this.currWindow.maximize();
            }
            else {
                this.currWindow.restore();
            }
            this.maximized = !this.maximized;
        });
    }
    async getWindowState() {
        return await this.currWindow.getWindowState();
    }
    async setDrag(elem) {
        this.currWindow.dragMove(elem);
    }
}
exports.AppWindow = AppWindow;


/***/ }),

/***/ "./src/consts.ts":
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.kHotkeys = exports.kWindowNames = exports.kGameClassIds = exports.kGamesFeatures = void 0;
exports.kGamesFeatures = new Map([
    [
        21216,
        [
            'kill',
            'killed',
            'killer',
            'revived',
            'death',
            'match',
            'match_info',
            'rank',
            'me',
            'phase',
            'location',
            'team',
            'items',
            'counters'
        ]
    ],
    [
        7764,
        [
            'match_info',
            'kill',
            'death',
            'assist',
            'headshot',
            'round_start',
            'match_start',
            'match_info',
            'match_end',
            'team_round_win',
            'bomb_planted',
            'bomb_change',
            'reloading',
            'fired',
            'weapon_change',
            'weapon_acquired',
            'info',
            'roster',
            'player_activity_change',
            'team_set',
            'replay',
            'counters',
            'mvp',
            'scoreboard',
            'kill_feed'
        ]
    ],
    [
        5426,
        [
            'live_client_data',
            'matchState',
            'match_info',
            'death',
            'respawn',
            'abilities',
            'kill',
            'assist',
            'gold',
            'minions',
            'summoner_info',
            'gameMode',
            'teams',
            'level',
            'announcer',
            'counters',
            'damage',
            'heal'
        ]
    ],
    [
        21634,
        [
            'match_info',
            'game_info'
        ]
    ],
    [
        8032,
        [
            'game_info',
            'match_info'
        ]
    ],
    [
        10844,
        [
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        10906,
        [
            'kill',
            'revived',
            'death',
            'killer',
            'match',
            'match_info',
            'rank',
            'counters',
            'location',
            'me',
            'team',
            'phase',
            'map',
            'roster'
        ]
    ],
    [
        10826,
        [
            'game_info',
            'match',
            'match_info',
            'roster',
            'kill',
            'death',
            'me',
            'defuser'
        ]
    ],
    [
        21404,
        [
            'game_info',
            'match_info',
            'player',
            'location',
            'match',
            'feed',
            'connection',
            'kill',
            'death',
            'portal',
            'assist'
        ]
    ],
    [
        7212,
        [
            'kill',
            'death',
            'me',
            'match_info'
        ]
    ],
    [
        21640,
        [
            'me',
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        7314,
        [
            'game_state_changed',
            'match_state_changed',
            'match_detected',
            'daytime_changed',
            'clock_time_changed',
            'ward_purchase_cooldown_changed',
            'match_ended',
            'kill',
            'assist',
            'death',
            'cs',
            'xpm',
            'gpm',
            'gold',
            'hero_leveled_up',
            'hero_respawned',
            'hero_buyback_info_changed',
            'hero_boughtback',
            'hero_health_mana_info',
            'hero_status_effect_changed',
            'hero_attributes_skilled',
            'hero_ability_skilled',
            'hero_ability_used',
            'hero_ability_cooldown_changed',
            'hero_ability_changed',
            'hero_item_cooldown_changed',
            'hero_item_changed',
            'hero_item_used',
            'hero_item_consumed',
            'hero_item_charged',
            'match_info',
            'roster',
            'party',
            'error',
            'hero_pool',
            'me',
            'game'
        ]
    ],
    [
        21626,
        [
            'match_info',
            'game_info',
            'kill',
            'death'
        ]
    ],
    [
        8954,
        [
            'game_info',
            'match_info'
        ]
    ],
]);
exports.kGameClassIds = Array.from(exports.kGamesFeatures.keys());
exports.kWindowNames = {
    inGame: 'in_game',
    desktop: 'desktop'
};
exports.kHotkeys = {
    toggle: 'sample_app_ts_showhide'
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./src/desktop/desktop.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const AppWindow_1 = __webpack_require__(/*! ../AppWindow */ "./src/AppWindow.ts");
const consts_1 = __webpack_require__(/*! ../consts */ "./src/consts.ts");
new AppWindow_1.AppWindow(consts_1.kWindowNames.desktop);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lLWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLWV2ZW50cy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1ob3RrZXlzLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LXdpbmRvdy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC90aW1lci5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vc3JjL0FwcFdpbmRvdy50cyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vc3JjL2NvbnN0cy50cyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9zcmMvZGVza3RvcC9kZXNrdG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNi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Q3ZCLDRCQUE0QjtZQUM1Qix5QkFBeUI7WUFDekIsc0JBQXNCO1lBQ3RCLG1CQUFtQjtZQUNuQiwrQkFBK0I7WUFDL0Isc0JBQXNCO1lBQ3RCLDRCQUE0QjtZQUM1QixtQkFBbUI7WUFDbkIsZ0JBQWdCO1lBQ2hCLG9CQUFvQjtZQUNwQixtQkFBbUI7WUFDbkIsWUFBWTtZQUNaLFFBQVE7WUFDUixPQUFPO1lBQ1AsT0FBTztZQUNQLFdBQVc7WUFDWCxJQUFJO1lBQ0osTUFBTTtTQUNQO0tBQ0Y7SUFFRDtRQUNFLEtBQUs7UUFDTDtZQUNFLFlBQVk7WUFDWixXQUFXO1lBQ1gsTUFBTTtZQUNOLE9BQU87U0FDUjtLQUNGO0lBRUQ7UUFDRSxJQUFJO1FBQ0o7WUFDRSxXQUFXO1lBQ1gsWUFBWTtTQUNiO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFVSxxQkFBYSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsc0JBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRWxELG9CQUFZLEdBQUc7SUFDMUIsTUFBTSxFQUFFLFNBQVM7SUFDakIsT0FBTyxFQUFFLFNBQVM7Q0FDbkIsQ0FBQztBQUVXLGdCQUFRLEdBQUc7SUFDdEIsTUFBTSxFQUFFLHdCQUF3QjtDQUNqQyxDQUFDOzs7Ozs7O1VDdFBGO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7Ozs7QUNyQkEsa0ZBQXlDO0FBQ3pDLHlFQUF5QztBQUt6QyxJQUFJLHFCQUFTLENBQUMscUJBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyIsImZpbGUiOiJqcy9kZXNrdG9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lLWxpc3RlbmVyXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWVzLWV2ZW50c1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lc1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1ob3RrZXlzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWxpc3RlbmVyXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LXdpbmRvd1wiKSwgZXhwb3J0cyk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lTGlzdGVuZXIgPSB2b2lkIDA7XHJcbmNvbnN0IG93X2xpc3RlbmVyXzEgPSByZXF1aXJlKFwiLi9vdy1saXN0ZW5lclwiKTtcclxuY2xhc3MgT1dHYW1lTGlzdGVuZXIgZXh0ZW5kcyBvd19saXN0ZW5lcl8xLk9XTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUpIHtcclxuICAgICAgICBzdXBlcihkZWxlZ2F0ZSk7XHJcbiAgICAgICAgdGhpcy5vbkdhbWVJbmZvVXBkYXRlZCA9ICh1cGRhdGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF1cGRhdGUgfHwgIXVwZGF0ZS5nYW1lSW5mbykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdXBkYXRlLnJ1bm5pbmdDaGFuZ2VkICYmICF1cGRhdGUuZ2FtZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXBkYXRlLmdhbWVJbmZvLmlzUnVubmluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKHVwZGF0ZS5nYW1lSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lRW5kZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVFbmRlZCh1cGRhdGUuZ2FtZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uUnVubmluZ0dhbWVJbmZvID0gKGluZm8pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQoaW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5vbkdhbWVJbmZvVXBkYXRlZC5hZGRMaXN0ZW5lcih0aGlzLm9uR2FtZUluZm9VcGRhdGVkKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8odGhpcy5vblJ1bm5pbmdHYW1lSW5mbyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLm9uR2FtZUluZm9VcGRhdGVkLnJlbW92ZUxpc3RlbmVyKHRoaXMub25HYW1lSW5mb1VwZGF0ZWQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lTGlzdGVuZXIgPSBPV0dhbWVMaXN0ZW5lcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVzRXZlbnRzID0gdm9pZCAwO1xyXG5jb25zdCB0aW1lcl8xID0gcmVxdWlyZShcIi4vdGltZXJcIik7XHJcbmNsYXNzIE9XR2FtZXNFdmVudHMge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUsIHJlcXVpcmVkRmVhdHVyZXMsIGZlYXR1cmVSZXRyaWVzID0gMTApIHtcclxuICAgICAgICB0aGlzLm9uSW5mb1VwZGF0ZXMgPSAoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkluZm9VcGRhdGVzKGluZm8uaW5mbyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uTmV3RXZlbnRzID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25OZXdFdmVudHMoZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMgPSByZXF1aXJlZEZlYXR1cmVzO1xyXG4gICAgICAgIHRoaXMuX2ZlYXR1cmVSZXRyaWVzID0gZmVhdHVyZVJldHJpZXM7XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMuZ2V0SW5mbyhyZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIHNldFJlcXVpcmVkRmVhdHVyZXMoKSB7XHJcbiAgICAgICAgbGV0IHRyaWVzID0gMSwgcmVzdWx0O1xyXG4gICAgICAgIHdoaWxlICh0cmllcyA8PSB0aGlzLl9mZWF0dXJlUmV0cmllcykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5zZXRSZXF1aXJlZEZlYXR1cmVzKHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMsIHJlc29sdmUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NldFJlcXVpcmVkRmVhdHVyZXMoKTogc3VjY2VzczogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQuc3VwcG9ydGVkRmVhdHVyZXMubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXdhaXQgdGltZXJfMS5UaW1lci53YWl0KDMwMDApO1xyXG4gICAgICAgICAgICB0cmllcysrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLndhcm4oJ3NldFJlcXVpcmVkRmVhdHVyZXMoKTogZmFpbHVyZSBhZnRlciAnICsgdHJpZXMgKyAnIHRyaWVzJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgMikpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyRXZlbnRzKCkge1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbkluZm9VcGRhdGVzMi5hZGRMaXN0ZW5lcih0aGlzLm9uSW5mb1VwZGF0ZXMpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbk5ld0V2ZW50cy5hZGRMaXN0ZW5lcih0aGlzLm9uTmV3RXZlbnRzKTtcclxuICAgIH1cclxuICAgIHVuUmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uSW5mb1VwZGF0ZXMyLnJlbW92ZUxpc3RlbmVyKHRoaXMub25JbmZvVXBkYXRlcyk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uTmV3RXZlbnRzLnJlbW92ZUxpc3RlbmVyKHRoaXMub25OZXdFdmVudHMpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc3RhcnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtvdy1nYW1lLWV2ZW50c10gU1RBUlRgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zZXRSZXF1aXJlZEZlYXR1cmVzKCk7XHJcbiAgICAgICAgY29uc3QgeyByZXMsIHN0YXR1cyB9ID0gYXdhaXQgdGhpcy5nZXRJbmZvKCk7XHJcbiAgICAgICAgaWYgKHJlcyAmJiBzdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICB0aGlzLm9uSW5mb1VwZGF0ZXMoeyBpbmZvOiByZXMgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW293LWdhbWUtZXZlbnRzXSBTVE9QYCk7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVzRXZlbnRzID0gT1dHYW1lc0V2ZW50cztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVzID0gdm9pZCAwO1xyXG5jbGFzcyBPV0dhbWVzIHtcclxuICAgIHN0YXRpYyBnZXRSdW5uaW5nR2FtZUluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbyhyZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjbGFzc0lkRnJvbUdhbWVJZChnYW1lSWQpIHtcclxuICAgICAgICBsZXQgY2xhc3NJZCA9IE1hdGguZmxvb3IoZ2FtZUlkIC8gMTApO1xyXG4gICAgICAgIHJldHVybiBjbGFzc0lkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldFJlY2VudGx5UGxheWVkR2FtZXMobGltaXQgPSAzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghb3ZlcndvbGYuZ2FtZXMuZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcyhsaW1pdCwgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LmdhbWVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0R2FtZURCSW5mbyhnYW1lQ2xhc3NJZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRHYW1lREJJbmZvKGdhbWVDbGFzc0lkLCByZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZXMgPSBPV0dhbWVzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XSG90a2V5cyA9IHZvaWQgMDtcclxuY2xhc3MgT1dIb3RrZXlzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBzdGF0aWMgZ2V0SG90a2V5VGV4dChob3RrZXlJZCwgZ2FtZUlkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLmdldChyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBob3RrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWVJZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3RrZXkgPSByZXN1bHQuZ2xvYmFscy5maW5kKGggPT4gaC5uYW1lID09PSBob3RrZXlJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0LmdhbWVzICYmIHJlc3VsdC5nYW1lc1tnYW1lSWRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3RrZXkgPSByZXN1bHQuZ2FtZXNbZ2FtZUlkXS5maW5kKGggPT4gaC5uYW1lID09PSBob3RrZXlJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvdGtleSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoaG90a2V5LmJpbmRpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgnVU5BU1NJR05FRCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBvbkhvdGtleURvd24oaG90a2V5SWQsIGFjdGlvbikge1xyXG4gICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMub25QcmVzc2VkLmFkZExpc3RlbmVyKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubmFtZSA9PT0gaG90a2V5SWQpXHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ocmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XSG90a2V5cyA9IE9XSG90a2V5cztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0xpc3RlbmVyID0gdm9pZCAwO1xyXG5jbGFzcyBPV0xpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlKSB7XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dMaXN0ZW5lciA9IE9XTGlzdGVuZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dXaW5kb3cgPSB2b2lkIDA7XHJcbmNsYXNzIE9XV2luZG93IHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgcmVzdG9yZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MucmVzdG9yZShpZCwgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LnN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW3Jlc3RvcmVdIC0gYW4gZXJyb3Igb2NjdXJyZWQsIHdpbmRvd0lkPSR7aWR9LCByZWFzb249JHtyZXN1bHQuZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbWluaW1pemUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm1pbmltaXplKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbWF4aW1pemUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm1heGltaXplKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaGlkZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuaGlkZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGNsb3NlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5nZXRXaW5kb3dTdGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgJiZcclxuICAgICAgICAgICAgICAgIChyZXN1bHQud2luZG93X3N0YXRlICE9PSAnY2xvc2VkJykpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW50ZXJuYWxDbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkcmFnTW92ZShlbGVtKSB7XHJcbiAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgZHJhZ2dhYmxlJztcclxuICAgICAgICBlbGVtLm9ubW91c2Vkb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5kcmFnTW92ZSh0aGlzLl9uYW1lKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0V2luZG93U3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldFdpbmRvd1N0YXRlKGlkLCByZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRDdXJyZW50SW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRDdXJyZW50V2luZG93KHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC53aW5kb3cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9idGFpbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYiA9IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5zdGF0dXMgPT09IFwic3VjY2Vzc1wiICYmIHJlcy53aW5kb3cgJiYgcmVzLndpbmRvdy5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gcmVzLndpbmRvdy5pZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHJlcy53aW5kb3cubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMud2luZG93KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3coY2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5vYnRhaW5EZWNsYXJlZFdpbmRvdyh0aGlzLl9uYW1lLCBjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGFzc3VyZU9idGFpbmVkKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5vYnRhaW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGludGVybmFsQ2xvc2UoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuY2xvc2UoaWQsIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5zdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV1dpbmRvdyA9IE9XV2luZG93O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlRpbWVyID0gdm9pZCAwO1xyXG5jbGFzcyBUaW1lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSwgaWQpIHtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhbmRsZVRpbWVyRXZlbnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vblRpbWVyKHRoaXMuX2lkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyB3YWl0KGludGVydmFsSW5NUykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBpbnRlcnZhbEluTVMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoaW50ZXJ2YWxJbk1TKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IHNldFRpbWVvdXQodGhpcy5oYW5kbGVUaW1lckV2ZW50LCBpbnRlcnZhbEluTVMpO1xyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGltZXJJZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVySWQpO1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuVGltZXIgPSBUaW1lcjtcclxuIiwiaW1wb3J0IHsgT1dXaW5kb3cgfSBmcm9tIFwiQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10c1wiO1xuXG4vLyBBIGJhc2UgY2xhc3MgZm9yIHRoZSBhcHAncyBmb3JlZ3JvdW5kIHdpbmRvd3MuXG4vLyBTZXRzIHRoZSBtb2RhbCBhbmQgZHJhZyBiZWhhdmlvcnMsIHdoaWNoIGFyZSBzaGFyZWQgYWNjcm9zcyB0aGUgZGVza3RvcCBhbmQgaW4tZ2FtZSB3aW5kb3dzLlxuZXhwb3J0IGNsYXNzIEFwcFdpbmRvdyB7XG4gIHByb3RlY3RlZCBjdXJyV2luZG93OiBPV1dpbmRvdztcbiAgcHJvdGVjdGVkIG1haW5XaW5kb3c6IE9XV2luZG93O1xuICBwcm90ZWN0ZWQgbWF4aW1pemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Iod2luZG93TmFtZSkge1xuICAgIHRoaXMubWFpbldpbmRvdyA9IG5ldyBPV1dpbmRvdygnYmFja2dyb3VuZCcpO1xuICAgIHRoaXMuY3VycldpbmRvdyA9IG5ldyBPV1dpbmRvdyh3aW5kb3dOYW1lKTtcblxuICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlQnV0dG9uJyk7XG4gICAgY29uc3QgbWF4aW1pemVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWF4aW1pemVCdXR0b24nKTtcbiAgICBjb25zdCBtaW5pbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtaW5pbWl6ZUJ1dHRvbicpO1xuXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlcicpO1xuXG4gICAgdGhpcy5zZXREcmFnKGhlYWRlcik7XG5cbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMubWFpbldpbmRvdy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgbWluaW1pemVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmN1cnJXaW5kb3cubWluaW1pemUoKTtcbiAgICB9KTtcblxuICAgIG1heGltaXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLm1heGltaXplZCkge1xuICAgICAgICB0aGlzLmN1cnJXaW5kb3cubWF4aW1pemUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycldpbmRvdy5yZXN0b3JlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWF4aW1pemVkID0gIXRoaXMubWF4aW1pemVkO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFdpbmRvd1N0YXRlKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmN1cnJXaW5kb3cuZ2V0V2luZG93U3RhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2V0RHJhZyhlbGVtKSB7XG4gICAgdGhpcy5jdXJyV2luZG93LmRyYWdNb3ZlKGVsZW0pO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3Qga0dhbWVzRmVhdHVyZXMgPSBuZXcgTWFwPG51bWJlciwgc3RyaW5nW10+KFtcbiAgLy8gRm9ydG5pdGVcbiAgW1xuICAgIDIxMjE2LFxuICAgIFtcbiAgICAgICdraWxsJyxcbiAgICAgICdraWxsZWQnLFxuICAgICAgJ2tpbGxlcicsXG4gICAgICAncmV2aXZlZCcsXG4gICAgICAnZGVhdGgnLFxuICAgICAgJ21hdGNoJyxcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdyYW5rJyxcbiAgICAgICdtZScsXG4gICAgICAncGhhc2UnLFxuICAgICAgJ2xvY2F0aW9uJyxcbiAgICAgICd0ZWFtJyxcbiAgICAgICdpdGVtcycsXG4gICAgICAnY291bnRlcnMnXG4gICAgXVxuICBdLFxuICAvLyBDU0dPXG4gIFtcbiAgICA3NzY0LFxuICAgIFtcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdraWxsJyxcbiAgICAgICdkZWF0aCcsXG4gICAgICAnYXNzaXN0JyxcbiAgICAgICdoZWFkc2hvdCcsXG4gICAgICAncm91bmRfc3RhcnQnLFxuICAgICAgJ21hdGNoX3N0YXJ0JyxcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdtYXRjaF9lbmQnLFxuICAgICAgJ3RlYW1fcm91bmRfd2luJyxcbiAgICAgICdib21iX3BsYW50ZWQnLFxuICAgICAgJ2JvbWJfY2hhbmdlJyxcbiAgICAgICdyZWxvYWRpbmcnLFxuICAgICAgJ2ZpcmVkJyxcbiAgICAgICd3ZWFwb25fY2hhbmdlJyxcbiAgICAgICd3ZWFwb25fYWNxdWlyZWQnLFxuICAgICAgJ2luZm8nLFxuICAgICAgJ3Jvc3RlcicsXG4gICAgICAncGxheWVyX2FjdGl2aXR5X2NoYW5nZScsXG4gICAgICAndGVhbV9zZXQnLFxuICAgICAgJ3JlcGxheScsXG4gICAgICAnY291bnRlcnMnLFxuICAgICAgJ212cCcsXG4gICAgICAnc2NvcmVib2FyZCcsXG4gICAgICAna2lsbF9mZWVkJ1xuICAgIF1cbiAgXSxcbiAgLy8gTGVhZ3VlIG9mIExlZ2VuZHNcbiAgW1xuICAgIDU0MjYsXG4gICAgW1xuICAgICAgJ2xpdmVfY2xpZW50X2RhdGEnLFxuICAgICAgJ21hdGNoU3RhdGUnLFxuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ2RlYXRoJyxcbiAgICAgICdyZXNwYXduJyxcbiAgICAgICdhYmlsaXRpZXMnLFxuICAgICAgJ2tpbGwnLFxuICAgICAgJ2Fzc2lzdCcsXG4gICAgICAnZ29sZCcsXG4gICAgICAnbWluaW9ucycsXG4gICAgICAnc3VtbW9uZXJfaW5mbycsXG4gICAgICAnZ2FtZU1vZGUnLFxuICAgICAgJ3RlYW1zJyxcbiAgICAgICdsZXZlbCcsXG4gICAgICAnYW5ub3VuY2VyJyxcbiAgICAgICdjb3VudGVycycsXG4gICAgICAnZGFtYWdlJyxcbiAgICAgICdoZWFsJ1xuICAgIF1cbiAgXSxcbiAgLy8gRXNjYXBlIEZyb20gVGFya292XG4gIFtcbiAgICAyMTYzNCxcbiAgICBbXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAnZ2FtZV9pbmZvJ1xuICAgIF1cbiAgXSxcbiAgLy8gTWluZWNyYWZ0XG4gIFtcbiAgICA4MDMyLFxuICAgIFtcbiAgICAgICdnYW1lX2luZm8nLFxuICAgICAgJ21hdGNoX2luZm8nXG4gICAgXVxuICBdLFxuICAvLyBPdmVyd2F0Y2hcbiAgW1xuICAgIDEwODQ0LFxuICAgIFtcbiAgICAgICdnYW1lX2luZm8nLFxuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ2tpbGwnLFxuICAgICAgJ2RlYXRoJ1xuICAgIF1cbiAgXSxcbiAgLy8gUFVCR1xuICBbXG4gICAgMTA5MDYsXG4gICAgW1xuICAgICAgJ2tpbGwnLFxuICAgICAgJ3Jldml2ZWQnLFxuICAgICAgJ2RlYXRoJyxcbiAgICAgICdraWxsZXInLFxuICAgICAgJ21hdGNoJyxcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdyYW5rJyxcbiAgICAgICdjb3VudGVycycsXG4gICAgICAnbG9jYXRpb24nLFxuICAgICAgJ21lJyxcbiAgICAgICd0ZWFtJyxcbiAgICAgICdwaGFzZScsXG4gICAgICAnbWFwJyxcbiAgICAgICdyb3N0ZXInXG4gICAgXVxuICBdLFxuICAvLyBSYWluYm93IFNpeCBTaWVnZVxuICBbXG4gICAgMTA4MjYsXG4gICAgW1xuICAgICAgJ2dhbWVfaW5mbycsXG4gICAgICAnbWF0Y2gnLFxuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ3Jvc3RlcicsXG4gICAgICAna2lsbCcsXG4gICAgICAnZGVhdGgnLFxuICAgICAgJ21lJyxcbiAgICAgICdkZWZ1c2VyJ1xuICAgIF1cbiAgXSxcbiAgLy8gU3BsaXRnYXRlOiBBcmVuYSBXYXJmYXJlXG4gIFtcbiAgICAyMTQwNCxcbiAgICBbXG4gICAgICAnZ2FtZV9pbmZvJyxcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdwbGF5ZXInLFxuICAgICAgJ2xvY2F0aW9uJyxcbiAgICAgICdtYXRjaCcsXG4gICAgICAnZmVlZCcsXG4gICAgICAnY29ubmVjdGlvbicsXG4gICAgICAna2lsbCcsXG4gICAgICAnZGVhdGgnLFxuICAgICAgJ3BvcnRhbCcsXG4gICAgICAnYXNzaXN0J1xuICAgIF1cbiAgXSxcbiAgLy8gUGF0aCBvZiBFeGlsZVxuICBbXG4gICAgNzIxMixcbiAgICBbXG4gICAgICAna2lsbCcsXG4gICAgICAnZGVhdGgnLFxuICAgICAgJ21lJyxcbiAgICAgICdtYXRjaF9pbmZvJ1xuICAgIF1cbiAgXSxcbiAgLy8gVmFsb3JhbnRcbiAgW1xuICAgIDIxNjQwLFxuICAgIFtcbiAgICAgICdtZScsXG4gICAgICAnZ2FtZV9pbmZvJyxcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdraWxsJyxcbiAgICAgICdkZWF0aCdcbiAgICBdXG4gIF0sXG4gIC8vIERvdGEgMlxuICBbXG4gICAgNzMxNCxcbiAgICBbXG4gICAgICAnZ2FtZV9zdGF0ZV9jaGFuZ2VkJyxcbiAgICAgICdtYXRjaF9zdGF0ZV9jaGFuZ2VkJyxcbiAgICAgICdtYXRjaF9kZXRlY3RlZCcsXG4gICAgICAnZGF5dGltZV9jaGFuZ2VkJyxcbiAgICAgICdjbG9ja190aW1lX2NoYW5nZWQnLFxuICAgICAgJ3dhcmRfcHVyY2hhc2VfY29vbGRvd25fY2hhbmdlZCcsXG4gICAgICAnbWF0Y2hfZW5kZWQnLFxuICAgICAgJ2tpbGwnLFxuICAgICAgJ2Fzc2lzdCcsXG4gICAgICAnZGVhdGgnLFxuICAgICAgJ2NzJyxcbiAgICAgICd4cG0nLFxuICAgICAgJ2dwbScsXG4gICAgICAnZ29sZCcsXG4gICAgICAnaGVyb19sZXZlbGVkX3VwJyxcbiAgICAgICdoZXJvX3Jlc3Bhd25lZCcsXG4gICAgICAnaGVyb19idXliYWNrX2luZm9fY2hhbmdlZCcsXG4gICAgICAnaGVyb19ib3VnaHRiYWNrJyxcbiAgICAgICdoZXJvX2hlYWx0aF9tYW5hX2luZm8nLFxuICAgICAgJ2hlcm9fc3RhdHVzX2VmZmVjdF9jaGFuZ2VkJyxcbiAgICAgICdoZXJvX2F0dHJpYnV0ZXNfc2tpbGxlZCcsXG4gICAgICAnaGVyb19hYmlsaXR5X3NraWxsZWQnLFxuICAgICAgJ2hlcm9fYWJpbGl0eV91c2VkJyxcbiAgICAgICdoZXJvX2FiaWxpdHlfY29vbGRvd25fY2hhbmdlZCcsXG4gICAgICAnaGVyb19hYmlsaXR5X2NoYW5nZWQnLFxuICAgICAgJ2hlcm9faXRlbV9jb29sZG93bl9jaGFuZ2VkJyxcbiAgICAgICdoZXJvX2l0ZW1fY2hhbmdlZCcsXG4gICAgICAnaGVyb19pdGVtX3VzZWQnLFxuICAgICAgJ2hlcm9faXRlbV9jb25zdW1lZCcsXG4gICAgICAnaGVyb19pdGVtX2NoYXJnZWQnLFxuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ3Jvc3RlcicsXG4gICAgICAncGFydHknLFxuICAgICAgJ2Vycm9yJyxcbiAgICAgICdoZXJvX3Bvb2wnLFxuICAgICAgJ21lJyxcbiAgICAgICdnYW1lJ1xuICAgIF1cbiAgXSxcbiAgLy8gQ2FsbCBvZiBEdXR5OiBXYXJ6b25lXG4gIFtcbiAgICAyMTYyNixcbiAgICBbXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAnZ2FtZV9pbmZvJyxcbiAgICAgICdraWxsJyxcbiAgICAgICdkZWF0aCdcbiAgICBdXG4gIF0sXG4gIC8vIFdhcmZyYW1lXG4gIFtcbiAgICA4OTU0LFxuICAgIFtcbiAgICAgICdnYW1lX2luZm8nLFxuICAgICAgJ21hdGNoX2luZm8nXG4gICAgXVxuICBdLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBrR2FtZUNsYXNzSWRzID0gQXJyYXkuZnJvbShrR2FtZXNGZWF0dXJlcy5rZXlzKCkpO1xuXG5leHBvcnQgY29uc3Qga1dpbmRvd05hbWVzID0ge1xuICBpbkdhbWU6ICdpbl9nYW1lJyxcbiAgZGVza3RvcDogJ2Rlc2t0b3AnXG59O1xuXG5leHBvcnQgY29uc3Qga0hvdGtleXMgPSB7XG4gIHRvZ2dsZTogJ3NhbXBsZV9hcHBfdHNfc2hvd2hpZGUnXG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBBcHBXaW5kb3cgfSBmcm9tIFwiLi4vQXBwV2luZG93XCI7XG5pbXBvcnQgeyBrV2luZG93TmFtZXMgfSBmcm9tIFwiLi4vY29uc3RzXCI7XG5cbi8vIFRoZSBkZXNrdG9wIHdpbmRvdyBpcyB0aGUgd2luZG93IGRpc3BsYXllZCB3aGlsZSBnYW1lIGlzIG5vdCBydW5uaW5nLlxuLy8gSW4gb3VyIGNhc2UsIG91ciBkZXNrdG9wIHdpbmRvdyBoYXMgbm8gbG9naWMgLSBpdCBvbmx5IGRpc3BsYXlzIHN0YXRpYyBkYXRhLlxuLy8gVGhlcmVmb3JlLCBvbmx5IHRoZSBnZW5lcmljIEFwcFdpbmRvdyBjbGFzcyBpcyBjYWxsZWQuXG5uZXcgQXBwV2luZG93KGtXaW5kb3dOYW1lcy5kZXNrdG9wKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=