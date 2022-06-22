// George: global variables to store information to later store in localstorage db
var gameID = undefined;
var kills = undefined;
var deaths = undefined;
var assists = undefined;
var matchStart = undefined;
var matchEnd = undefined;
var matchLength = undefined;
var date = undefined;
var gameTime = undefined;
var gameMode = undefined;
var ranked = undefined;
var roundsCompleted = undefined;
var matchResult = undefined;
var enterData = undefined;

// League specific vars
var gameClassic = undefined;
var hasBots = undefined;
var isLol = undefined;

// Rainbow 6 specific vars
var roundTime;
var roundStart;
var roundEnd;
var rkills;
var rdeaths;
var rassists;
var endLog;

// Biometric Vars
var sufficientSleep;
var sufficientWater;
var bioInputDate;

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

  // function getGamesFromPreviousWeek(array, weeks)
  // {
  //   // Get maximum key to loop through array properly since it's an associative array
  //   var currentMaximumKey;
  //   for (var key in array){
  //     var keyToInt = parseInt(key);
  //     if (currentMaximumKey == undefined) {
  //       currentMaximumKey = keyToInt;
  //     }

  //     if (keyToInt > currentMaximumKey) {
  //       currentMaximumKey = keyToInt;
  //     }
  //   }

  //   // Get minimum key to loop through array properly since it's an associative array
  //   var currentMinimumKey;
  //   for (var key in localStorage){
  //     var keyToInt = parseInt(key);
  //     if (currentMinimumKey == undefined) {
  //       currentMinimumKey = keyToInt;
  //     }

  //     if (keyToInt < currentMinimumKey) {
  //       currentMinimumKey = keyToInt;
  //     }
  //   }

  //   var today = new Date();
  //   var dd = String(today.getDate()).padStart(2, "0");
  //   var mm = String(today.getMonth() + 1).padStart(2, "0");
  //   var yyyy = today.getFullYear();
  //   today = new Date(mm + "/" + dd + "/" + yyyy);
  //   var yesterday = today - 86400000;
  //   var lastWeek = yesterday - 604800000;
  //   var gamesFromPreviousWeek = [];
  //   for (var i = currentMinimumKey; i <= currentMaximumKey; i++)
  //   {
  //     if (array[i][7] <= array[currentMaximumKey][7] && array[i][7] >= lastWeek) {
  //       gamesFromPreviousWeek.push(array[i]);
  //     }
  //   }
  //   // convert previous week dates to days
  //   for (var i = 0; i < gamesFromPreviousWeek.length ; i++) {
  //     gamesFromPreviousWeek[i][7] = new Date(gamesFromPreviousWeek[i][7]);
  //     gamesFromPreviousWeek[i][7] = gamesFromPreviousWeek[i][7].toString();
  //     gamesFromPreviousWeek[i][7] = gamesFromPreviousWeek[i][7].split(" ");
  //     gamesFromPreviousWeek[i][7] = gamesFromPreviousWeek[i][7][0];
  //   }
  //   return gamesFromPreviousWeek;
  // }

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
          if (result && result.name === hotkeyId) action(result);

          localStorage.clear();

          // All day active gamer data set
          // Day 30
          localStorage.setItem("0", "5426 3 2 6 win 00:19:32 10:00 05/21/2022");
          localStorage.setItem("1", "21640 25 9 2 win 00:31:12 11:30 05/21/2022");
          localStorage.setItem("2", "10826 4 4 0 loss 00:14:28 13:00 05/21/2022");
          localStorage.setItem("3", "5426 3 4 11 loss 00:35:11 14:30 05/21/2022");
          localStorage.setItem("4", "21640 11 14 3 loss 00:35:14 16:00 05/21/2022");
          localStorage.setItem("5", "10826 8 4 3 win 00:14:46 17:30 05/21/2022");
          localStorage.setItem("6", "5426 1 5 3 loss 00:29:13 19:00 05/21/2022");
          localStorage.setItem("7", "21640 4 7 1 loss 00:10:37 20:30 05/21/2022");
          localStorage.setItem("8", "10826 3 4 0 loss 00:12:39 22:00 05/21/2022");
          // Day 29
          localStorage.setItem("9", "5426 5 8 21 loss 00:47:01 10:00 05/22/2022");
          localStorage.setItem("10", "21640 5 8 1 loss 00:15:06 11:30 05/22/2022");
          localStorage.setItem("11", "10826 12 5 2 win 00:23:06 13:00 05/22/2022");
          localStorage.setItem("12", "5426 7 7 16 loss 00:37:42 14:30 05/22/2022");
          localStorage.setItem("13", "21640 26 16 4 loss 00:39:37 16:00 05/22/2022");
          localStorage.setItem("14", "10826 3 4 1 loss 00:15:21 17:30 05/22/2022");
          localStorage.setItem("15", "5426 2 7 12 win 00:30:32 19:00 05/22/2022");
          localStorage.setItem("16", "21640 17 10 4 win 00:30:32 20:30 05/22/2022");
          localStorage.setItem("17", "10826 7 5 1 loss 00:11:00 22:00 05/22/2022");
          // Day 28
          localStorage.setItem("18", "5426 4 2 18 win 00:22:32 10:00 05/23/2022");
          localStorage.setItem("19", "21640 15 19 5 loss 00:28:27 11:30 05/23/2022");
          localStorage.setItem("20", "10826 7 0 0 loss 00:17:37 13:00 05/23/2022");
          localStorage.setItem("21", "5426 1 10 14 win 00:38:35 14:30 05/23/2022");
          localStorage.setItem("22", "21640 21 14 6 win 00:31:33 16:00 05/23/2022");
          localStorage.setItem("23", "10826 11 6 3 win 00:12:09 17:30 05/23/2022");
          localStorage.setItem("24", "5426 3 4 13 win 00:27:20 19:00 05/23/2022");
          localStorage.setItem("25", "21640 15 16 2 loss 00:27:43 20:30 05/23/2022");
          localStorage.setItem("26", "10826 6 1 2 win 00:26:15 22:00 05/23/2022");
          // Day 27
          localStorage.setItem("27", "5426 12 13 18 loss 00:35:33 10:00 05/24/2022");
          localStorage.setItem("28", "21640 17 20 8 win 00:35:11 11:30 05/24/2022");
          localStorage.setItem("29", "10826 9 2 2 win 00:07:45 13:00 05/24/2022");
          localStorage.setItem("30", "5426 5 4 5 loss 00:23:42 14:30 05/24/2022");
          localStorage.setItem("31", "21640 11 12 4 win 00:31:12 16:00 05/24/2022");
          localStorage.setItem("32", "10826 3 4 1 win 00:08:48 17:30 05/24/2022");
          localStorage.setItem("33", "5426 4 13 12 loss 00:31:59 19:00 05/24/2022");
          localStorage.setItem("34", "21640 10 19 5 loss 00:35:14 20:30 05/24/2022");
          localStorage.setItem("35", "10826 7 3 1 loss 00:14:28 22:00 05/24/2022");
          // Day 26
          localStorage.setItem("36", "5426 15 7 25 win 00:46:27 10:00 05/25/2022");
          localStorage.setItem("37", "21640 2 7 1 loss 00:10:37 11:30 05/25/2022");
          localStorage.setItem("38", "10826 2 4 0 win 00:14:46 13:00 05/25/2022");
          localStorage.setItem("39", "5426 2 8 21 loss 00:35:21 14:30 05/25/2022");
          localStorage.setItem("40", "21640 4 9 3 loss 00:15:06 16:00 05/25/2022");
          localStorage.setItem("41", "10826 6 4 4 loss 00:12:39 17:30 05/25/2022");
          localStorage.setItem("42", "5426 5 8 2 loss 00:27:20 19:00 05/25/2022");
          localStorage.setItem("43", "21640 10 17 2 loss 00:39:37 20:30 05/25/2022");
          localStorage.setItem("44", "10826 2 5 1 win 00:23:06 22:00 05/25/2022");
          // Day 25
          localStorage.setItem("45", "5426 5 2 1 win 00:20:04 10:00 05/26/2022");
          localStorage.setItem("46", "21640 16 13 4 win 00:30:32 11:30 05/26/2022");
          localStorage.setItem("47", "10826 3 4 0 loss 00:15:21 13:00 05/26/2022");
          localStorage.setItem("48", "5426 6 10 1 loss 00:27:41 14:30 05/26/2022");
          localStorage.setItem("49", "21640 3 17 4 loss 00:28:27 16:00 05/26/2022");
          localStorage.setItem("50", "10826 7 5 0 loss 00:11:00 17:30 05/26/2022");
          localStorage.setItem("51", "5426 11 0 2 win 00:23:41 19:00 05/26/2022");
          localStorage.setItem("52", "21640 12 13 3 win 00:31:33 20:30 05/26/2022");
          localStorage.setItem("53", "10826 4 1 0 loss 00:17:37 22:00 05/26/2022");
          // Day 24
          localStorage.setItem("54", "5426 11 0 2 win 00:23:41 10:00 05/27/2022");
          localStorage.setItem("55", "21640 6 17 4 loss 00:27:43 11:30 05/27/2022");
          localStorage.setItem("56", "10826 7 6 1 win 00:12:09 13:00 05/27/2022");
          localStorage.setItem("57", "5426 8 5 14 win 00:46:13 14:30 05/27/2022");
          localStorage.setItem("58", "21640 14 19 5 win 00:35:11 16:00 05/27/2022");
          localStorage.setItem("59", "10826 5 1 1 win 00:26:15 17:30 05/27/2022");
          localStorage.setItem("60", "5426 9 4 9 loss 00:25:54 19:00 05/27/2022");
          localStorage.setItem("61", "21640 2 7 3 loss 00:15:06 20:30 05/27/2022");
          localStorage.setItem("62", "10826 6 1 2 win 00:07:45 22:00 05/27/2022");
          // Day 23
          localStorage.setItem("63", "5426 14 4 2 win 00:30:53 10:00 05/28/2022");
          localStorage.setItem("64", "21640 22 17 5 loss 00:39:37 11:30 05/28/2022");
          localStorage.setItem("65", "10826 2 5 1 win 00:08:48 13:00 05/28/2022");
          localStorage.setItem("66", "5426 8 5 6 loss 00:34:35 14:30 05/28/2022");
          localStorage.setItem("67", "21640 23 12 2 win 00:30:32 16:00 05/28/2022");
          localStorage.setItem("68", "10826 5 3 1 loss 00:14:28 17:30 05/28/2022");
          localStorage.setItem("69", "5426 2 6 7 loss 00:32:34 19:00 05/28/2022");
          localStorage.setItem("70", "21640 23 16 5 loss 00:28:27 20:30 05/28/2022");
          localStorage.setItem("71", "10826 2 4 0 win 00:14:46 22:00 05/28/2022");
          // Day 22
          localStorage.setItem("72", "5426 4 0 3 win 00:16:27 10:00 05/29/2022");
          localStorage.setItem("73", "21640 23 14 6 win 00:31:33 11:30 05/29/2022");
          localStorage.setItem("74", "10826 6 5 4 loss 00:12:39 13:00 05/29/2022");
          localStorage.setItem("75", "5426 7 4 20 loss 00:34:51 14:30 05/29/2022");
          localStorage.setItem("76", "21640 9 16 1 loss 00:27:43 16:00 05/29/2022");
          localStorage.setItem("77", "10826 3 5 0 win 00:23:06 17:30 05/29/2022");
          localStorage.setItem("78", "5426 3 5 19 loss 00:32:16 19:00 05/29/2022");
          localStorage.setItem("79", "21640 19 18 4 win 00:35:11 20:30 05/29/2022");
          localStorage.setItem("80", "10826 1 4 1 loss 00:15:21 22:00 05/29/2022");
          // Day 21
          localStorage.setItem("81", "5426 3 4 9 win 00:29:01 10:00 05/30/2022");
          localStorage.setItem("82", "21640 21 15 2 loss 00:31:12 11:30 05/30/2022");
          localStorage.setItem("83", "10826 2 4 0 loss 00:11:00 13:00 05/30/2022");
          localStorage.setItem("84", "5426 3 0 15 win 00:25:14 14:30 05/30/2022");
          localStorage.setItem("85", "21640 21 15 1 loss 00:35:14 16:00 05/30/2022");
          localStorage.setItem("86", "10826 0 1 2 loss 00:17:37 17:30 05/30/2022");
          localStorage.setItem("87", "5426 5 3 5 loss 00:28:39 19:00 05/30/2022");
          localStorage.setItem("88", "21640 4 6 1 loss 00:10:37 20:30 05/30/2022");
          localStorage.setItem("89", "10826 4 7 0 win 00:12:09 22:00 05/30/2022");
          // Day 20
          localStorage.setItem("90", "5426 10 0 16 win 00:28:23 10:00 05/31/2022");
          localStorage.setItem("91", "21640 12 6 1 win 00:15:06 11:30 05/31/2022");
          localStorage.setItem("92", "10826 4 2 1 win 00:26:15 13:00 05/31/2022");
          localStorage.setItem("93", "5426 1 8 5 loss 00:22:50 14:30 05/31/2022");
          localStorage.setItem("94", "21640 24 14 9 win 00:28:27 16:00 05/31/2022");
          localStorage.setItem("95", "10826 2 3 0 win 00:07:45 17:30 05/31/2022");
          localStorage.setItem("96", "5426 6 6 9 loss 00:27:45 19:00 05/31/2022");
          localStorage.setItem("97", "21640 18 16 3 loss 00:31:33 20:30 05/31/2022");
          localStorage.setItem("98", "10826 2 3 0 win 00:08:48 22:00 05/31/2022");
          // Day 19
          localStorage.setItem("99", "5426 8 1 12 win 00:24:06 10:00 06/01/2022");
          localStorage.setItem("100", "21640 16 18 2 loss 00:27:43 11:30 06/01/2022");
          localStorage.setItem("101", "10826 1 5 0 loss 00:14:28 13:00 06/01/2022");
          localStorage.setItem("102", "5426 1 5 7 loss 00:29:02 14:30 06/01/2022");
          localStorage.setItem("103", "21640 32 15 7 loss 00:35:11 16:00 06/01/2022");
          localStorage.setItem("104", "10826 2 6 1 win 00:14:46 17:30 06/01/2022");
          localStorage.setItem("105", "5426 1 6 6 loss 00:25:37 19:00 06/01/2022");
          localStorage.setItem("106", "21640 12 17 1 loss 00:31:12 20:30 06/01/2022");
          localStorage.setItem("107", "10826 1 4 1 loss 00:12:39 22:00 06/01/2022");
          // Day 18
          localStorage.setItem("108", "5426 8 8 14 loss 00:30:22 10:00 06/02/2022");
          localStorage.setItem("109", "21640 20 16 3 loss 00:35:14 11:30 06/02/2022");
          localStorage.setItem("110", "10826 7 5 1 win 00:23:06 13:00 06/02/2022");
          localStorage.setItem("111", "5426 4 2 20 win 00:32:44 14:30 06/02/2022");
          localStorage.setItem("112", "21640 3 7 2 loss 00:10:37 16:00 06/02/2022");
          localStorage.setItem("113", "10826 2 4 0 loss 00:15:21 17:30 06/02/2022");
          localStorage.setItem("114", "5426 9 4 19 win 00:33:42 19:00 06/02/2022");
          localStorage.setItem("115", "21640 8 4 0 win 00:15:06 20:30 06/02/2022");
          localStorage.setItem("116", "10826 1 4 1 loss 00:11:00 22:00 06/02/2022");
          // Day 17
          localStorage.setItem("117", "5426 5 1 10 win 00:19:47 10:00 06/03/2022");
          localStorage.setItem("118", "21640 21 9 12 win 00:28:27 11:30 06/03/2022");
          localStorage.setItem("119", "10826 2 1 1 win 00:12:09 13:00 06/03/2022");
          localStorage.setItem("120", "5426 8 8 24 loss 00:43:36 14:30 06/03/2022");
          localStorage.setItem("121", "21640 16 17 2 loss 00:31:33 16:00 06/03/2022");
          localStorage.setItem("122", "10826 5 7 0 win 00:26:15 17:30 06/03/2022");
          localStorage.setItem("123", "5426 8 0 12 win 00:33:40 19:00 06/03/2022");
          localStorage.setItem("124", "21640 18 21 7 loss 00:35:11 20:30 06/03/2022");
          localStorage.setItem("125", "10826 1 1 1 win 00:07:45 22:00 06/03/2022");
          // Day 16
          localStorage.setItem("126", "5426 1 0 11 win 00:20:08 10:00 06/04/2022");
          localStorage.setItem("127", "21640 10 18 4 loss 00:31:12 11:30 06/04/2022");
          localStorage.setItem("128", "10826 2 2 0 win 00:08:48 13:00 06/04/2022");
          localStorage.setItem("129", "5426 7 0 12 win 00:34:32 14:30 06/04/2022");
          localStorage.setItem("130", "21640 7 6 2 win 00:15:06 16:00 06/04/2022");
          localStorage.setItem("131", "10826 0 4 0 loss 00:14:28 17:30 06/04/2022");
          localStorage.setItem("132", "5426 4 6 8 loss 00:28:58 19:00 06/04/2022");
          localStorage.setItem("133", "21640 12 20 9 loss 00:39:37 20:30 06/04/2022");
          localStorage.setItem("134", "10826 3 3 0 win 00:14:46 22:00 06/04/2022");
          // Day 15
          localStorage.setItem("135", "5426 7 7 8 loss 00:27:08 10:00 06/05/2022");
          localStorage.setItem("136", "21640 20 13 3 win 00:28:27 11:30 06/05/2022");
          localStorage.setItem("137", "10826 2 0 1 win 00:23:06 13:00 06/05/2022");
          localStorage.setItem("138", "5426 7 17 7 loss 00:35:55 14:30 06/05/2022");
          localStorage.setItem("139", "21640 18 16 3 loss 00:31:33 16:00 06/05/2022");
          localStorage.setItem("140", "10826 0 5 1 loss 00:15:21 17:30 06/05/2022");
          localStorage.setItem("141", "5426 2 3 10 win 00:27:08 19:00 06/05/2022");
          localStorage.setItem("142", "21640 17 19 4 loss 00:35:11 20:30 06/05/2022");
          localStorage.setItem("143", "10826 0 4 2 loss 00:11:00 22:00 06/05/2022");
          // Day 14
          localStorage.setItem("144", "5426 10 23 22 win 00:37:03 10:00 06/06/2022");
          localStorage.setItem("145", "21640 3 2 6 win 00:19:32 11:30 06/06/2022");
          localStorage.setItem("146", "10826 1 2 0 win 00:12:09 13:00 06/06/2022");
          localStorage.setItem("147", "5426 1 8 19 loss 00:26:13 14:30 06/06/2022");
          localStorage.setItem("148", "21640 3 2 6 win 00:19:32 16:00 06/06/2022");
          localStorage.setItem("149", "10826 2 6 1 win 00:26:15 17:30 06/06/2022");
          localStorage.setItem("150", "5426 7 6 9 loss 00:29:23 19:00 06/06/2022");
          localStorage.setItem("151", "21640 3 2 6 win 00:19:32 20:30 06/06/2022");
          localStorage.setItem("152", "10826 1 2 0 win 00:07:45 22:00 06/06/2022");
          // Day 13
          localStorage.setItem("153", "5426 5 2 18 win 00:29:22 10:00 06/07/2022");
          localStorage.setItem("154", "21640 3 2 6 win 00:19:32 11:30 06/07/2022");
          localStorage.setItem("155", "10826 0 2 2 win 00:08:48 13:00 06/07/2022");
          localStorage.setItem("156", "5426 9 2 20 win 00:32:18 14:30 06/07/2022");
          localStorage.setItem("157", "21640 3 2 6 win 00:19:32 16:00 06/07/2022");
          localStorage.setItem("158", "10826 7 1 2 win 00:14:28 17:30 06/07/2022");
          localStorage.setItem("159", "5426 15 9 24 loss 00:36:20 19:00 06/07/2022");
          localStorage.setItem("160", "21640 3 2 6 win 00:19:32 20:30 06/07/2022");
          localStorage.setItem("161", "10826 7 4 1 win 00:14:46 22:00 06/07/2022");
          // Day 12
          localStorage.setItem("162", "5426 2 5 12 loss 00:27:31 10:00 06/08/2022");
          localStorage.setItem("163", "21640 6 17 7 loss 00:31:12 11:30 06/08/2022");
          localStorage.setItem("164", "10826 7 2 0 win 00:12:39 13:00 06/08/2022");
          localStorage.setItem("165", "5426 3 5 24 win 00:33:43 14:30 06/08/2022");
          localStorage.setItem("166", "21640 3 7 2 loss 00:10:37 16:00 06/08/2022");
          localStorage.setItem("167", "10826 9 5 1 loss 00:23:06 17:30 06/08/2022");
          localStorage.setItem("168", "5426 3 2 6 win 00:19:32 19:00 06/08/2022");
          localStorage.setItem("169", "21640 5 6 4 win 00:15:06 20:30 06/08/2022");
          localStorage.setItem("170", "10826 5 3 3 win 00:15:21 22:00 06/08/2022");
          // Day 11
          localStorage.setItem("171", "5426 4 6 21 win 00:35:09 10:00 06/09/2022");
          localStorage.setItem("172", "21640 12 15 7 win 00:30:32 11:30 06/09/2022");
          localStorage.setItem("173", "10826 6 1 3 win 00:11:00 13:00 06/09/2022");
          localStorage.setItem("174", "5426 3 7 8 loss 00:31:34 14:30 06/09/2022");
          localStorage.setItem("175", "21640 12 14 7 win 00:28:27 16:00 06/09/2022");
          localStorage.setItem("176", "10826 7 3 3 win 00:17:37 17:30 06/09/2022");
          localStorage.setItem("177", "5426 4 2 11 win 00:27:29 19:00 06/09/2022");
          localStorage.setItem("178", "21640 9 18 5 loss 00:31:33 20:30 06/09/2022");
          localStorage.setItem("179", "10826 2 4 0 loss 00:12:09 22:00 06/09/2022");
          // Day 10
          localStorage.setItem("180", "5426 7 2 12 win 00:30:34 10:00 06/10/2022");
          localStorage.setItem("181", "21640 14 22 5 loss 00:35:11 11:30 06/10/2022");
          localStorage.setItem("182", "10826 13 7 1 loss 00:26:15 13:00 06/10/2022");
          localStorage.setItem("183", "5426 4 6 15 loss 00:28:08 14:30 06/10/2022");
          localStorage.setItem("184", "21640 5 4 0 loss 00:31:12 16:00 06/10/2022");
          localStorage.setItem("185", "10826 2 4 0 loss 00:07:45 17:30 06/10/2022");
          localStorage.setItem("186", "5426 6 1 14 win 00:24:14 19:00 06/10/2022");
          localStorage.setItem("187", "21640 7 14 4 loss 00:35:14 20:30 06/10/2022");
          localStorage.setItem("188", "10826 4 4 1 loss 00:08:48 22:00 06/10/2022");
          // Day 9
          localStorage.setItem("189", "5426 14 2 18 win 00:33:09 10:00 06/11/2022");
          localStorage.setItem("190", "21640 3 5 5 win 00:15:06 11:30 06/11/2022");
          localStorage.setItem("191", "10826 4 3 2 win 00:14:28 13:00 06/11/2022");
          localStorage.setItem("192", "5426 4 1 17 win 00:26:17 14:30 06/11/2022");
          localStorage.setItem("193", "21640 10 17 0 loss 00:39:17 16:00 06/11/2022");
          localStorage.setItem("194", "10826 6 5 0 loss 00:14:46 17:30 06/11/2022");
          localStorage.setItem("195", "5426 4 1 17 win 00:27:08 19:00 06/11/2022");
          localStorage.setItem("196", "21640 9 14 7 win 00:30:32 20:30 06/11/2022");
          localStorage.setItem("197", "10826 5 0 0 win 00:12:39 22:00 06/11/2022");
          // Day 8
          localStorage.setItem("198", "5426 4 7 9 loss 00:29:06 10:00 06/12/2022");
          localStorage.setItem("199", "21640 11 15 3 win 00:28:27 11:30 06/12/2022");
          localStorage.setItem("200", "10826 3 7 2 loss 00:23:06 13:00 06/12/2022");
          localStorage.setItem("201", "5426 16 4 20 win 00:41:43 14:30 06/12/2022");
          localStorage.setItem("202", "21640 6 19 4 loss 00:31:33 16:00 06/12/2022");
          localStorage.setItem("203", "10826 6 1 2 loss 00:15:21 17:30 06/12/2022");
          localStorage.setItem("204", "5426 9 12 31 loss 00:39:42 19:00 06/12/2022");
          localStorage.setItem("205", "21640 8 14 4 loss 00:27:43 20:30 06/12/2022");
          localStorage.setItem("206", "10826 7 0 0 win 00:11:00 22:00 06/12/2022");
          // Day 7
          localStorage.setItem("207", "5426 4 0 14 win 00:21:25 10:00 06/13/2022");
          localStorage.setItem("208", "21640 13 19 10 loss 00:35:11 11:30 06/13/2022");
          localStorage.setItem("209", "10826 3 3 1 win 00:17:37 13:00 06/13/2022");
          localStorage.setItem("210", "5426 5 5 30 win 00:35:35 14:30 06/13/2022");
          localStorage.setItem("211", "21640 24 13 4 win 00:35:14 16:00 06/13/2022");
          localStorage.setItem("212", "10826 1 4 1 loss 00:12:09 17:30 06/13/2022");
          localStorage.setItem("213", "5426 2 7 5 loss 00:29:01 19:00 06/13/2022");
          localStorage.setItem("214", "21640 10 5 1 loss 00:15:06 20:30 06/13/2022");
          localStorage.setItem("215", "10826 5 8 2 loss 00:26:15 22:00 06/13/2022");
          // Day 6
          localStorage.setItem("216", "5426 2 1 8 win 00:29:14 10:00 06/14/2022");
          localStorage.setItem("217", "21640 23 17 3 win 00:39:37 11:30 06/14/2022");
          localStorage.setItem("218", "10826 1 4 0 loss 00:07:45 13:00 06/14/2022");
          localStorage.setItem("219", "5426 0 1 12 win 00:30:39 14:30 06/14/2022");
          localStorage.setItem("220", "21640 22 13 4 loss 00:30:32 16:00 06/14/2022");
          localStorage.setItem("221", "10826 3 4 0 loss 00:08:48 17:30 06/14/2022");
          localStorage.setItem("222", "5426 1 0 4 loss 00:20:50 19:00 06/14/2022");
          localStorage.setItem("223", "21640 10 5 5 win 00:10:37 20:30 06/14/2022");
          localStorage.setItem("224", "10826 5 2 1 win 00:14:28 22:00 06/14/2022");
          // Day 5
          localStorage.setItem("225", "5426 9 1 3 win 00:26:05 10:00 06/15/2022");
          localStorage.setItem("226", "21640 25 11 5 win 00:27:43 11:30 06/15/2022");
          localStorage.setItem("227", "10826 5 5 0 loss 00:14:46 13:00 06/15/2022");
          localStorage.setItem("228", "5426 19 4 13 loss 00:46:19 14:30 06/15/2022");
          localStorage.setItem("229", "21640 33 20 3 win 00:35:11 16:00 06/15/2022");
          localStorage.setItem("230", "10826 3 4 1 win 00:12:39 17:30 06/15/2022");
          localStorage.setItem("231", "5426 9 4 7 loss 00:33:03 19:00 06/15/2022");
          localStorage.setItem("232", "21640 12 10 10 win 00:31:12 20:30 06/15/2022");
          localStorage.setItem("233", "10826 5 8 1 loss 00:23:06 22:00 06/15/2022");
          // Day 4
          localStorage.setItem("234", "5426 8 5 18 loss 00:50:14 10:00 06/16/2022");
          localStorage.setItem("235", "21640 21 15 3 win 00:35:14 11:30 06/16/2022");
          localStorage.setItem("236", "10826 5 2 2 win 00:15:21 13:00 06/16/2022");
          localStorage.setItem("237", "5426 4 8 9 loss 00:27:58 14:30 06/16/2022");
          localStorage.setItem("238", "21640 9 2 1 win 00:10:37 16:00 06/16/2022");
          localStorage.setItem("239", "10826 4 1 3 win 00:11:00 17:30 06/16/2022");
          localStorage.setItem("240", "5426 2 3 27 win 00:35:14 19:00 06/16/2022");
          localStorage.setItem("241", "21640 21 15 4 win 00:39:37 20:30 06/16/2022");
          localStorage.setItem("242", "10826 3 2 1 loss 00:17:37 22:00 06/16/2022");
          // Day 3
          localStorage.setItem("243", "5426 3 9 11 loss 00:35:25 10:00 06/17/2022");
          localStorage.setItem("244", "21640 12 15 7 loss 00:30:32 11:30 06/17/2022");
          localStorage.setItem("245", "10826 2 4 0 loss 00:12:09 13:00 06/17/2022");
          localStorage.setItem("246", "5426 1 4 7 win 00:20:08 14:30 06/17/2022");
          localStorage.setItem("247", "21640 19 8 1 win 00:27:43 16:00 06/17/2022");
          localStorage.setItem("248", "10826 6 7 2 loss 00:26:15 17:30 06/17/2022");
          localStorage.setItem("249", "5426 4 6 10 loss 00:37:25 19:00 06/17/2022");
          localStorage.setItem("250", "21640 13 10 5 win 00:31:12 20:30 06/17/2022");
          localStorage.setItem("251", "10826 0 4 1 loss 00:08:48 22:00 06/17/2022");
          // Day 2
          localStorage.setItem("252", "5426 3 1 13 win 00:23:26 10:00 06/18/2022");
          localStorage.setItem("253", "21640 18 14 3 loss 00:35:14 11:30 06/18/2022");
          localStorage.setItem("254", "10826 5 2 1 win 00:14:28 13:00 06/18/2022");
          localStorage.setItem("255", "5426 4 3 6 win 00:24:16 14:30 06/18/2022");
          localStorage.setItem("256", "21640 7 3 2 win 00:10:37 16:00 06/18/2022");
          localStorage.setItem("257", "10826 1 5 0 loss 00:14:46 17:30 06/18/2022");
          localStorage.setItem("258", "5426 1 3 9 loss 00:21:21 19:00 06/18/2022");
          localStorage.setItem("259", "21640 6 6 3 loss 00:15:06 20:30 06/18/2022");
          localStorage.setItem("260", "10826 2 2 0 win 00:12:39 22:00 06/18/2022");
          // Day 1
          localStorage.setItem("261", "5426 10 4 23 win 00:39:51 10:00 06/19/2022");
          localStorage.setItem("262", "21640 18 18 5 win 00:39:37 11:30 06/19/2022");
          localStorage.setItem("263", "10826 2 7 0 loss 00:23:06 13:00 06/19/2022");
          localStorage.setItem("264", "5426 6 2 7 win 00:19:43 14:30 06/19/2022");
          localStorage.setItem("265", "21640 9 16 3 loss 00:30:32 16:00 06/19/2022");
          localStorage.setItem("266", "10826 4 1 0 win 00:15:21 17:30 06/19/2022");
          localStorage.setItem("267", "5426 10 4 14 win 00:30:30 19:00 06/19/2022");
          localStorage.setItem("268", "21640 13 17 2 loss 00:28:27 20:30 06/19/2022");
          localStorage.setItem("269", "10826 3 3 2 win 00:11:00 22:00 06/19/2022");

          // Data for testing biometrics
          //localStorage.setItem("261", "5426 10 4 23 win 00:39:51 01:20 06/19/2022");
          //localStorage.setItem("262", "21640 18 18 5 win 00:39:37 01:00 06/19/2022");
          //localStorage.setItem("263", "10826 4 1 0 win 00:15:21 22:45 06/19/2022");

          console.log("LocalStorage");
          console.log(localStorage);
          
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

          console.log("LocalStorageConverted");
          console.log(localStorageConverted);

          sufficientSleep = true;
          sufficientWater = true;

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
          console.log("League of Legends Games from converted LocalStorage");
          var leagueGames = [];
          for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
            var getGameID = localStorageConverted[i][0];
            if (getGameID == 5426) {
              leagueGames.push(localStorageConverted[i]);
            }
          }
          console.log(leagueGames);

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

          console.log("League recommended time slots for each day!");
          var leagueSundaySlot = getAverageTimeSlotforDay(leaguesundayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("LeagueSundaySlot", leagueSundaySlot);
          console.log("League Sunday Slot");
          console.log(leagueSundaySlot);
          var leagueMondaySlot = getAverageTimeSlotforDay(leaguemondayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("leagueMondaySlot", leagueMondaySlot);
          console.log("League Monday Slot");
          console.log(leagueMondaySlot);
          var leagueTuesdaySlot = getAverageTimeSlotforDay(leaguetuesdayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("leagueTuesdaySlot", leagueTuesdaySlot);
          console.log("League Tuesday Slot");
          console.log(leagueTuesdaySlot);
          var leagueWednesdaySlot = getAverageTimeSlotforDay(leaguewednesdayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("leagueWednesdaySlot", leagueWednesdaySlot);
          console.log("League Wednesday Slot");
          console.log(leagueWednesdaySlot);
          var leagueThursdaySlot = getAverageTimeSlotforDay(leaguethursdayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("leagueThursdaySlot", leagueThursdaySlot);
          console.log("League Thursday Slot");
          console.log(leagueThursdaySlot);
          var leagueFridaySlot = getAverageTimeSlotforDay(leaguefridayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("leagueFridaySlot", leagueFridaySlot);
          console.log("League Friday Slot");
          console.log(leagueFridaySlot);
          var leagueSaturdaySlot = getAverageTimeSlotforDay(leaguesaturdayGames, leagueaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("leagueSaturdaySlot", leagueSaturdaySlot);
          console.log("League Saturday Slot");
          console.log(leagueSaturdaySlot);

          console.log("Valorant Games from converted LocalStorage");
          var valorantGames = [];
          for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
            var getGameID = localStorageConverted[i][0];
            if (getGameID == 21640) {
              valorantGames.push(localStorageConverted[i]);
            }
          }
          console.log(valorantGames);

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

          console.log("Valorant recommended time slots for each day!");
          var valorantSundaySlot = getAverageTimeSlotforDay(valorantsundayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("ValorantSundaySlot", valorantSundaySlot);
          console.log("Valorant Sunday Slot");
          console.log(valorantSundaySlot);
          var valorantMondaySlot = getAverageTimeSlotforDay(valorantmondayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("ValorantMondaySlot", valorantMondaySlot);
          console.log("Valorant Monday Slot");
          console.log(valorantMondaySlot);
          var valorantTuesdaySlot = getAverageTimeSlotforDay(valoranttuesdayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("ValorantTuesdaySlot", valorantTuesdaySlot);
          console.log("Valorant Tuesday Slot");
          console.log(valorantTuesdaySlot);
          var valorantWednesdaySlot = getAverageTimeSlotforDay(valorantwednesdayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("ValorantWednesdaySlot", valorantWednesdaySlot);
          console.log("Valorant Wednesday Slot");
          console.log(valorantWednesdaySlot);
          var valorantThursdaySlot = getAverageTimeSlotforDay(valorantthursdayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("ValorantThursdaySlot", valorantThursdaySlot);
          console.log("Valorant Thursday Slot");
          console.log(valorantThursdaySlot);
          var valorantFridaySlot = getAverageTimeSlotforDay(valorantfridayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("ValorantFridaySlot", valorantFridaySlot);
          console.log("Valorant Friday Slot");
          console.log(valorantFridaySlot);
          var valorantSaturdaySlot = getAverageTimeSlotforDay(valorantsaturdayGames, valorantaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("ValorantSaturdaySlot", valorantSaturdaySlot);
          console.log("Valorant Saturday Slot");
          console.log(valorantSaturdaySlot);

          // Rainbow 6 Seige
          console.log("Rainbow 6 Seige Games from converted LocalStorage");
          var seigeGames = [];
          for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
            var getGameID = localStorageConverted[i][0];
            if (getGameID == 10826) {
              seigeGames.push(localStorageConverted[i]);
            }
          }
          console.log(seigeGames);

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

          console.log("Rainbow 6 Seige recommended time slots for each day!");
          var seigeSundaySlot = getAverageTimeSlotforDay(seigesundayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("SeigeSundaySlot", seigeSundaySlot);
          console.log("Rainbow 6 Seige Sunday Slot");
          console.log(seigeSundaySlot);
          var seigeMondaySlot = getAverageTimeSlotforDay(seigemondayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("SeigeMondaySlot", seigeMondaySlot);
          console.log("Rainbow 6 Seige Monday Slot");
          console.log(seigeMondaySlot);
          var seigeTuesdaySlot = getAverageTimeSlotforDay(seigetuesdayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("SeigeTuesdaySlot", seigeTuesdaySlot);
          console.log("Rainbow 6 Seige Tuesday Slot");
          console.log(seigeTuesdaySlot);
          var seigeWednesdaySlot = getAverageTimeSlotforDay(seigewednesdayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("SeigeWednesdaySlot", seigeWednesdaySlot);
          console.log("Rainbow 6 Seige Wednesday Slot");
          console.log(seigeWednesdaySlot);
          var seigeThursdaySlot = getAverageTimeSlotforDay(seigethursdayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("SeigeThursdaySlot", seigeThursdaySlot);
          console.log("Rainbow 6 Seige Thursday Slot");
          console.log(seigeThursdaySlot);
          var seigeFridaySlot = getAverageTimeSlotforDay(seigefridayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("SeigeFridaySlot", seigeFridaySlot);
          console.log("Rainbow 6 Seige Friday Slot");
          console.log(seigeFridaySlot);
          var seigeSaturdaySlot = getAverageTimeSlotforDay(seigesaturdayGames, seigeaverageGameTime, sufficientWater, sufficientSleep, today);
          localStorage.setItem("SeigeSaturdaySlot", seigeSaturdaySlot);
          console.log("Rainbow 6 Seige Saturday Slot");
          console.log(seigeSaturdaySlot);

          // // League of Legends
          // console.log("League of Legends Games from converted LocalStorage");
          // var leagueGames = [];
          // for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
          //   var getGameID = localStorageConverted[i][0];
          //   if (getGameID == 5426) {
          //     leagueGames.push(localStorageConverted[i]);
          //   }
          // }
          // console.log(leagueGames);

          // // Get League of Legends Games from previous week
          // var leagueGamesFromPreviousWeek = getGamesFromPreviousWeek(leagueGames, 1);
          // console.log("All League of Legends games from previous week");
          // console.log(leagueGamesFromPreviousWeek);

          // // Get league average game time
          // var leagueaverageGameTime = 0;
          // for (var i = 0; i < leagueGamesFromPreviousWeek.length; i++) {
          //   leagueaverageGameTime += leagueGamesFromPreviousWeek[i][5];
          // }
          // leagueaverageGameTime /= leagueGamesFromPreviousWeek.length;

          // // Arrays for each day of the week
          // var leaguesundayGames = [];
          // var leaguemondayGames = [];
          // var leaguetuesdayGames = [];
          // var leaguewednesdayGames = [];
          // var leaguethursdayGames = [];
          // var leaguefridayGames = [];
          // var leaguesaturdayGames = [];
          // for (i = 0; i < leagueGamesFromPreviousWeek.length; i++) {
          //   switch (leagueGamesFromPreviousWeek[i][7]) {
          //     case "Sun":
          //       leaguesundayGames.push(leagueGamesFromPreviousWeek[i]);
          //       break;
          //     case "Mon":
          //       leaguemondayGames.push(leagueGamesFromPreviousWeek[i]);
          //       break;
          //     case "Tue":
          //       leaguetuesdayGames.push(leagueGamesFromPreviousWeek[i]);
          //       break;
          //     case "Wed":
          //       leaguewednesdayGames.push(leagueGamesFromPreviousWeek[i]);
          //       break;
          //     case "Thu":
          //       leaguethursdayGames.push(leagueGamesFromPreviousWeek[i]);
          //       break;
          //     case "Fri":
          //       leaguefridayGames.push(leagueGamesFromPreviousWeek[i]);
          //       break;
          //     case "Sat":
          //       leaguesaturdayGames.push(leagueGamesFromPreviousWeek[i]);
          //       break;
          //     default:
          //       break;
          //   }
          // }

          // console.log("League recommended time slots for each day!");
          // var leagueSundaySlot = getAverageTimeSlotforDay(leaguesundayGames, leagueaverageGameTime);
          // localStorage.setItem("LeagueSundaySlot", leagueSundaySlot);
          // console.log("League Sunday Slot");
          // console.log(leagueSundaySlot);
          // var leagueMondaySlot = getAverageTimeSlotforDay(leaguemondayGames, leagueaverageGameTime);
          // localStorage.setItem("leagueMondaySlot", leagueMondaySlot);
          // console.log("League Monday Slot");
          // console.log(leagueMondaySlot);
          // var leagueTuesdaySlot = getAverageTimeSlotforDay(leaguetuesdayGames, leagueaverageGameTime);
          // localStorage.setItem("leagueTuesdaySlot", leagueTuesdaySlot);
          // console.log("League Tuesday Slot");
          // console.log(leagueTuesdaySlot);
          // var leagueWednesdaySlot = getAverageTimeSlotforDay(leaguewednesdayGames, leagueaverageGameTime);
          // localStorage.setItem("leagueWednesdaySlot", leagueWednesdaySlot);
          // console.log("League Wednesday Slot");
          // console.log(leagueWednesdaySlot);
          // var leagueThursdaySlot = getAverageTimeSlotforDay(leaguethursdayGames, leagueaverageGameTime);
          // localStorage.setItem("leagueThursdaySlot", leagueThursdaySlot);
          // console.log("League Thursday Slot");
          // console.log(leagueThursdaySlot);
          // var leagueFridaySlot = getAverageTimeSlotforDay(leaguefridayGames, leagueaverageGameTime);
          // localStorage.setItem("leagueFridaySlot", leagueFridaySlot);
          // console.log("League Friday Slot");
          // console.log(leagueFridaySlot);
          // var leagueSaturdaySlot = getAverageTimeSlotforDay(leaguesaturdayGames, leagueaverageGameTime);
          // localStorage.setItem("leagueSaturdaySlot", leagueSaturdaySlot);
          // console.log("League Saturday Slot");
          // console.log(leagueSaturdaySlot);

          // console.log("Valorant Games from converted LocalStorage");
          // var valorantGames = [];
          // for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
          //   var getGameID = localStorageConverted[i][0];
          //   if (getGameID == 21640) {
          //     valorantGames.push(localStorageConverted[i]);
          //   }
          // }
          // console.log(valorantGames);

          // // Get Valorant games from previous week
          // var valorantGamesFromPreviousWeek = getGamesFromPreviousWeek(valorantGames);
          // console.log("All Valorant games from previous week");
          // console.log(valorantGamesFromPreviousWeek);

          // // Get Valorant average game time
          // var valorantaverageGameTime = 0;
          // for (var i = 0; i < valorantGamesFromPreviousWeek.length; i++) {
          //   valorantaverageGameTime += valorantGamesFromPreviousWeek[i][5];
          // }
          // valorantaverageGameTime /= valorantGamesFromPreviousWeek.length;

          // // Arrays for each day of the week
          // var valorantsundayGames = [];
          // var valorantmondayGames = [];
          // var valoranttuesdayGames = [];
          // var valorantwednesdayGames = [];
          // var valorantthursdayGames = [];
          // var valorantfridayGames = [];
          // var valorantsaturdayGames = [];
          // for (i = 0; i < valorantGamesFromPreviousWeek.length; i++) {
          //   switch (valorantGamesFromPreviousWeek[i][7]) {
          //     case "Sun":
          //       valorantsundayGames.push(valorantGamesFromPreviousWeek[i]);
          //       break;
          //     case "Mon":
          //       valorantmondayGames.push(valorantGamesFromPreviousWeek[i]);
          //       break;
          //     case "Tue":
          //       valoranttuesdayGames.push(valorantGamesFromPreviousWeek[i]);
          //       break;
          //     case "Wed":
          //       valorantwednesdayGames.push(valorantGamesFromPreviousWeek[i]);
          //       break;
          //     case "Thu":
          //       valorantthursdayGames.push(valorantGamesFromPreviousWeek[i]);
          //       break;
          //     case "Fri":
          //       valorantfridayGames.push(valorantGamesFromPreviousWeek[i]);
          //       break;
          //     case "Sat":
          //       valorantsaturdayGames.push(valorantGamesFromPreviousWeek[i]);
          //       break;
          //     default:
          //       break;
          //   }
          // }

          // console.log("Valorant recommended time slots for each day!");
          // var valorantSundaySlot = getAverageTimeSlotforDay(valorantsundayGames, valorantaverageGameTime);
          // localStorage.setItem("ValorantSundaySlot", valorantSundaySlot);
          // console.log("Valorant Sunday Slot");
          // console.log(valorantSundaySlot);
          // var valorantMondaySlot = getAverageTimeSlotforDay(valorantmondayGames, valorantaverageGameTime);
          // localStorage.setItem("ValorantMondaySlot", valorantMondaySlot);
          // console.log("Valorant Monday Slot");
          // console.log(valorantMondaySlot);
          // var valorantTuesdaySlot = getAverageTimeSlotforDay(valoranttuesdayGames, valorantaverageGameTime);
          // localStorage.setItem("ValorantTuesdaySlot", valorantTuesdaySlot);
          // console.log("Valorant Tuesday Slot");
          // console.log(valorantTuesdaySlot);
          // var valorantWednesdaySlot = getAverageTimeSlotforDay(valorantwednesdayGames, valorantaverageGameTime);
          // localStorage.setItem("ValorantWednesdaySlot", valorantWednesdaySlot);
          // console.log("Valorant Wednesday Slot");
          // console.log(valorantWednesdaySlot);
          // var valorantThursdaySlot = getAverageTimeSlotforDay(valorantthursdayGames, valorantaverageGameTime);
          // localStorage.setItem("ValorantThursdaySlot", valorantThursdaySlot);
          // console.log("Valorant Thursday Slot");
          // console.log(valorantThursdaySlot);
          // var valorantFridaySlot = getAverageTimeSlotforDay(valorantfridayGames, valorantaverageGameTime);
          // localStorage.setItem("ValorantFridaySlot", valorantFridaySlot);
          // console.log("Valorant Friday Slot");
          // console.log(valorantFridaySlot);
          // var valorantSaturdaySlot = getAverageTimeSlotforDay(valorantsaturdayGames, valorantaverageGameTime);
          // localStorage.setItem("ValorantSaturdaySlot", valorantSaturdaySlot);
          // console.log("Valorant Saturday Slot");
          // console.log(valorantSaturdaySlot);

          // // Rainbow 6 Seige
          // console.log("Rainbow 6 Seige Games from converted LocalStorage");
          // var seigeGames = [];
          // for (var i = currentMinimumKey; i <= currentMaximumKey; i++) {
          //   var getGameID = localStorageConverted[i][0];
          //   if (getGameID == 10826) {
          //     seigeGames.push(localStorageConverted[i]);
          //   }
          // }
          // console.log(seigeGames);

          // // Get Rainbow 6 Seige games from previous week
          // var seigeGamesFromPreviousWeek = getGamesFromPreviousWeek(seigeGames);
          // console.log("All Rainbow 6 Seige games from previous week");
          // console.log(seigeGamesFromPreviousWeek);

          // // Get Rainbow 6 Seige average game time
          // var seigeaverageGameTime = 0;
          // for (var i = 0; i < seigeGamesFromPreviousWeek.length; i++) {
          //   seigeaverageGameTime += seigeGamesFromPreviousWeek[i][5];
          // }
          // seigeaverageGameTime /= seigeGamesFromPreviousWeek.length;

          // // Arrays for each day of the week
          // var seigesundayGames = [];
          // var seigemondayGames = [];
          // var seigetuesdayGames = [];
          // var seigewednesdayGames = [];
          // var seigethursdayGames = [];
          // var seigefridayGames = [];
          // var seigesaturdayGames = [];
          // for (i = 0; i < seigeGamesFromPreviousWeek.length; i++) {
          //   switch (seigeGamesFromPreviousWeek[i][7]) {
          //     case "Sun":
          //       seigesundayGames.push(seigeGamesFromPreviousWeek[i]);
          //       break;
          //     case "Mon":
          //       seigemondayGames.push(seigeGamesFromPreviousWeek[i]);
          //       break;
          //     case "Tue":
          //       seigetuesdayGames.push(seigeGamesFromPreviousWeek[i]);
          //       break;
          //     case "Wed":
          //       seigewednesdayGames.push(seigeGamesFromPreviousWeek[i]);
          //       break;
          //     case "Thu":
          //       seigethursdayGames.push(seigeGamesFromPreviousWeek[i]);
          //       break;
          //     case "Fri":
          //       seigefridayGames.push(seigeGamesFromPreviousWeek[i]);
          //       break;
          //     case "Sat":
          //       seigesaturdayGames.push(seigeGamesFromPreviousWeek[i]);
          //       break;
          //     default:
          //       break;
          //   }
          // }

          // console.log("Rainbow 6 Seige recommended time slots for each day!");
          // var seigeSundaySlot = getAverageTimeSlotforDay(seigesundayGames, seigeaverageGameTime);
          // localStorage.setItem("SeigeSundaySlot", seigeSundaySlot);
          // console.log("Rainbow 6 Seige Sunday Slot");
          // console.log(seigeSundaySlot);
          // var seigeMondaySlot = getAverageTimeSlotforDay(seigemondayGames, seigeaverageGameTime);
          // localStorage.setItem("SeigeMondaySlot", seigeMondaySlot);
          // console.log("Rainbow 6 Seige Monday Slot");
          // console.log(seigeMondaySlot);
          // var seigeTuesdaySlot = getAverageTimeSlotforDay(seigetuesdayGames, seigeaverageGameTime);
          // localStorage.setItem("SeigeTuesdaySlot", seigeTuesdaySlot);
          // console.log("Rainbow 6 Seige Tuesday Slot");
          // console.log(seigeTuesdaySlot);
          // var seigeWednesdaySlot = getAverageTimeSlotforDay(seigewednesdayGames, seigeaverageGameTime);
          // localStorage.setItem("SeigeWednesdaySlot", seigeWednesdaySlot);
          // console.log("Rainbow 6 Seige Wednesday Slot");
          // console.log(seigeWednesdaySlot);
          // var seigeThursdaySlot = getAverageTimeSlotforDay(seigethursdayGames, seigeaverageGameTime);
          // localStorage.setItem("SeigeThursdaySlot", seigeThursdaySlot);
          // console.log("Rainbow 6 Seige Thursday Slot");
          // console.log(seigeThursdaySlot);
          // var seigeFridaySlot = getAverageTimeSlotforDay(seigefridayGames, seigeaverageGameTime);
          // localStorage.setItem("SeigeFridaySlot", seigeFridaySlot);
          // console.log("Rainbow 6 Seige Friday Slot");
          // console.log(seigeFridaySlot);
          // var seigeSaturdaySlot = getAverageTimeSlotforDay(seigesaturdayGames, seigeaverageGameTime);
          // localStorage.setItem("SeigeSaturdaySlot", seigeSaturdaySlot);
          // console.log("Rainbow 6 Seige Saturday Slot");
          // console.log(seigeSaturdaySlot);
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
  !*** ./src/in_game/in_game.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
const AppWindow_1 = __webpack_require__(/*! ../AppWindow */ "./src/AppWindow.ts");
const consts_1 = __webpack_require__(/*! ../consts */ "./src/consts.ts");
class InGame extends AppWindow_1.AppWindow {
    constructor() {
        super(consts_1.kWindowNames.inGame);
        this._eventsLog = document.getElementById('eventsLog');
        this._infoLog = document.getElementById('infoLog');
        this.setToggleHotkeyBehavior();
        this.setToggleHotkeyText();
    }
    static instance() {
        if (!this._instance) {
            this._instance = new InGame();
        }
        return this._instance;
    }
    async run() {
        const gameClassId = await this.getCurrentGameClassId();
        const gameFeatures = consts_1.kGamesFeatures.get(gameClassId);
        if (gameFeatures && gameFeatures.length) {
            this._gameEventsListener = new overwolf_api_ts_1.OWGamesEvents({
                onInfoUpdates: this.onInfoUpdates.bind(this),
                onNewEvents: this.onNewEvents.bind(this)
            }, gameFeatures);
            this._gameEventsListener.start();
        }
    }
    onInfoUpdates(info) {
        // Check if Valorant ranked or Unranked
        if (info.match_info !== undefined) {
          if (
            info.match_info.game_mode !== undefined &&
            info.match_info.game_mode !== null
          ) {
            // Reset enterData and ranked
            this.enterData = undefined;
            this.ranked = undefined;

            var gameModeArr = info.match_info.game_mode.split(",");
            if (
              gameModeArr[0].includes("bomb") &&
              !gameModeArr[1].includes("true")
            ) {
              this.enterData = true;
              if (gameModeArr[2].includes("1")) {
                this.ranked = true;
              } else {
                this.ranked = false;
              }
            } else if (
              gameModeArr[0].includes("bomb") &&
              gameModeArr[1].includes("true") &&
              gameModeArr[2].includes("2")
            ) {
              this.enterData = false;
              this.ranked = false;
            }
          }
        }
        // End Check if Valorant ranked or Unranked

        // Increment completed rounds
        if (info.match_info !== undefined) {
          if (info.match_info.round_phase == "end") {
            if (this.roundsCompleted == undefined) {
              this.roundsCompleted = 0;
            }
            this.roundsCompleted += 1;
          }
        }
        // End increment completed rounds

        // Get Match Outcome
        if (info.match_info !== undefined) {
          if (
            info.match_info.match_outcome !== undefined &&
            info.match_info.match_outcome !== null
          ) {
            if (info.match_info.match_outcome == "victory") {
              this.matchResult = "win";
            }
            if (info.match_info.match_outcome == "defeat") {
              this.matchResult = "loss";
            }
            // get match_end, matchLength, and print data, store in local storage
            this.matchEnd = new Date();
            var mLength = this.matchEnd - this.matchStart;
            // 1- Convert to seconds:
            var timeseconds = mLength / 1000;
            // 2- Extract hours:
            var timehours = parseInt(timeseconds / 3600); // 3,600 seconds in 1 hour
            timeseconds = timeseconds % 3600; // seconds remaining after extracting hours
            // 3- Extract minutes:
            var timeminutes = parseInt(timeseconds / 60); // 60 seconds in 1 minute
            // 4- Keep only seconds not extracted to minutes:
            timeseconds = timeseconds % 60;
            // 5- Ensure each num will have 2 digits
            timeseconds = Math.round(timeseconds);
            timeminutes = Math.round(timeminutes);
            timehours = Math.round(timehours);
            timeseconds = String(timeseconds).padStart(2, "0");
            timeminutes = String(timeminutes).padStart(2, "0");
            timehours = String(timehours).padStart(2, "0");
            mLength = timehours + ":" + timeminutes + ":" + timeseconds;

            // Expire: Test code for expiring data
            var keysToDelete = [];
            for (var i = 0; i < localStorage.length; i++) {
              var key = localStorage.key(i);
              var gameArr = localStorage.getItem(key).split(" ");
              var gameDate = gameArr[7];
              var date1 = new Date(gameDate).getTime();
              var date2 = new Date(this.date).getTime();
              var timeDiff = date2 - date1;
              var daysDiff = timeDiff / (1000 * 3600 * 24);
              if (daysDiff >= 30) {
                keysToDelete.push(key);
              }
            }
            for (var i = 0; i < keysToDelete.length; i++) {
              localStorage.removeItem(keysToDelete[i]);
            }
            // End Expire:

            // Normal Game Add:
            var maxKey = 0;
            for (var i = 0; i < localStorage.length; i++) {
              if (maxKey <= Number(localStorage.key(i))) {
                maxKey = Number(localStorage.key(i)) + 1;
              }
            }
            // Ensure that kda all have values
            if (this.kills == undefined) {
              this.kills = 0;
            }
            if (this.deaths == undefined) {
              this.deaths = 0;
            }
            if (this.assists == undefined) {
              this.assists = 0;
            }

            // Only add entry if this.enterData == true and rounds completed does not equal 1 (this means remake)
            if (this.enterData == true && !(this.roundsCompleted <= 4)) {
              // Only add entry if all values are defined
              if (
                this.gameID !== undefined &&
                this.matchResult !== undefined &&
                mLength !== "NaN:NaN:NaN" &&
                this.gameTime !== undefined &&
                this.date !== undefined
              ) {
                var dataString =
                  String(this.gameID) +
                  " " +
                  String(this.kills) +
                  " " +
                  String(this.deaths) +
                  " " +
                  String(this.assists) +
                  " " +
                  String(this.matchResult) +
                  " " +
                  String(mLength) +
                  " " +
                  String(this.gameTime) +
                  " " +
                  String(this.date);
                localStorage.setItem(String(maxKey), dataString);
              }
            }
            // End Normal Game Add:

            // George: Analyze Database

            // Reset global vars
            this.gameID = undefined;
            this.kills = undefined;
            this.deaths = undefined;
            this.assists = undefined;
            this.matchStart = undefined;
            this.matchEnd = undefined;
            this.matchLength = undefined;
            this.date = undefined;
            this.gameTime = undefined;
            this.gameMode = undefined;
            this.ranked = undefined;
            this.roundsCompleted = undefined;
            this.matchResult = undefined;
            this.enterData = undefined;
          }
        }
        // End get Match Outcome

        // Define gameClassic and hasBots with live_client_data
        if (info.live_client_data !== undefined) {
          if (info.live_client_data.game_data !== undefined) {
            // Define gameClassic if true
            if (
              info.live_client_data.game_data.includes('"gameMode":"CLASSIC"')
            ) {
              if (this.gameClassic == undefined) {
                this.gameClassic = true;
                console.log("Game Classic: " + this.gameClassic);
              }
            }
          }
          if (info.live_client_data.all_players !== undefined) {
            // Define hasBots if true
            if (info.live_client_data.all_players.includes('"isBot":true')) {
              if (this.hasBots == undefined) {
                this.hasBots = true;
                console.log("Has Bots: " + this.hasBots);
              }
            }
          }
          // Get game start from live_client_data
          if (info.live_client_data.events !== undefined) {
            if (info.live_client_data.events.includes("GameStart")) {
              if (this.matchStart == undefined) {
                console.log("match started");
                // Reset global vars
                this.gameID = undefined;
                this.kills = undefined;
                this.deaths = undefined;
                this.assists = undefined;
                this.matchStart = undefined;
                this.matchEnd = undefined;
                this.matchLength = undefined;
                this.date = undefined;
                this.gameTime = undefined;
                this.gameMode = undefined;
                this.roundsCompleted = undefined;
                this.matchResult = undefined;
                var gameClassic = undefined;
                var hasBots = undefined;
                var isLol = undefined;

                // get match_start, GameID, gameTime, reset kda to 0, and date
                this.matchStart = new Date();

                var hours = new Date().getHours();
                var minutes = new Date().getMinutes();
                hours = String(hours).padStart(2, "0");
                minutes = String(minutes).padStart(2, "0");
                this.gameTime = hours + ":" + minutes;

                this.getCurrentGameClassId().then(
                  (value) => (this.gameID = value)
                );

                this.kills = "0";
                this.deaths = "0";
                this.assists = "0";

                var today = new Date();
                var dd = String(today.getDate()).padStart(2, "0");
                var mm = String(today.getMonth() + 1).padStart(2, "0");
                var yyyy = today.getFullYear();
                this.date = mm + "/" + dd + "/" + yyyy;
              }
            }
          }
        }

        // Define lol or tft with match_info
        if (info.match_info !== undefined) {
          if (info.match_info.game_mode !== undefined) {
            if (this.isLol == undefined) {
              this.isLol = info.match_info.game_mode;
              console.log(this.isLol);
            }
          }
        }

        // Rainbow 6 Seige starts here

        // log everything that doesn't have players tag
        if (info.players == undefined) {
          console.log(info);
        }

        // Create game start and end loop around this
        if (info.game_info !== undefined) {
          if (info.game_info.phase !== undefined) {
            if (info.game_info.phase == "lobby") {
              // Format gameMode
              if (this.gameMode !== undefined) {
                if (this.gameMode.includes("MATCHMAKING_PVP_UNRANKED")) {
                  this.gameMode = "MATCHMAKING_PVP_UNRANKED";
                }
                if (this.gameMode.includes("MATCHMAKING_PVP_RANKED")) {
                  this.gameMode = "MATCHMAKING_PVP_RANKED";
                }
              }

              // Ensure k d a exists
              if (this.rkills == undefined) {
                this.rkills = 0;
              }
              if (this.rdeaths == undefined) {
                this.rdeaths = 0;
              }
              if (this.rassists == undefined) {
                this.rassists = 0;
              }

              // Get Game Time
              // 1- Convert to seconds:
              var timeseconds = this.roundTime / 1000;
              // 2- Extract hours:
              var timehours = parseInt(timeseconds / 3600); // 3,600 seconds in 1 hour
              timeseconds = timeseconds % 3600; // seconds remaining after extracting hours
              // 3- Extract minutes:
              var timeminutes = parseInt(timeseconds / 60); // 60 seconds in 1 minute
              // 4- Keep only seconds not extracted to minutes:
              timeseconds = timeseconds % 60;
              // 5- Ensure each num will have 2 digits
              timeseconds = Math.round(timeseconds);
              timeminutes = Math.round(timeminutes);
              timehours = Math.round(timehours);
              timeseconds = String(timeseconds).padStart(2, "0");
              timeminutes = String(timeminutes).padStart(2, "0");
              timehours = String(timehours).padStart(2, "0");
              this.roundTime =
                timehours + ":" + timeminutes + ":" + timeseconds;

              // Console Log all info I need
              console.log(info.game_info.phase);
              console.log("Game Results:");
              console.log("Game ID: " + this.gameID);
              console.log("Game Mode: " + this.gameMode);
              console.log("rkills: " + this.rkills);
              console.log("rdeaths: " + this.rdeaths);
              console.log("rassists: " + this.rassists);
              console.log("Match Outcome: " + this.matchResult);
              console.log("Round Time: " + this.roundTime);
              console.log("Game TIme: " + this.gameTime);
              console.log("Date: " + this.date);

              // Normal Game Add:
              var maxKey = 0;
              for (var i = 0; i < localStorage.length; i++) {
                if (maxKey <= Number(localStorage.key(i))) {
                  maxKey = Number(localStorage.key(i)) + 1;
                }
              }

              if (
                this.gameID !== undefined &&
                this.gameMode !== undefined &&
                this.rkills !== undefined &&
                this.rdeaths !== undefined &&
                this.rassists !== undefined &&
                this.roundTime !== "NaN:NaN:NaN" &&
                this.matchResult !== undefined &&
                this.gameTime !== undefined &&
                this.date !== undefined
              ) {
                // Expire: Test code for expiring data
                var keysToDelete = [];
                for (var i = 0; i < localStorage.length; i++) {
                  var key = localStorage.key(i);
                  var gameArr = localStorage.getItem(key).split(" ");
                  var gameDate = gameArr[7];
                  var date1 = new Date(gameDate).getTime();
                  var date2 = new Date(this.date).getTime();
                  var timeDiff = date2 - date1;
                  var daysDiff = timeDiff / (1000 * 3600 * 24);
                  if (daysDiff >= 30) {
                    keysToDelete.push(key);
                  }
                }
                for (var i = 0; i < keysToDelete.length; i++) {
                  localStorage.removeItem(keysToDelete[i]);
                }
                // End Expire:
                if (
                  this.gameMode == "MATCHMAKING_PVP_UNRANKED" ||
                  this.gameMode == "MATCHMAKING_PVP_RANKED"
                ) {
                  if (!this.endLog.includes("NoEnemies")) {
                    var dataString =
                      String(this.gameID) +
                      " " +
                      String(this.rkills) +
                      " " +
                      String(this.rdeaths) +
                      " " +
                      String(this.rassists) +
                      " " +
                      String(this.matchResult) +
                      " " +
                      String(this.roundTime) +
                      " " +
                      String(this.gameTime) +
                      " " +
                      String(this.date);
                    localStorage.setItem(String(maxKey), dataString);
                  }
                }
              }

              // George: Analyze Database

              // Reset all info
              //this.gameID = undefined;
              //this.gameMode = undefined;
              this.rkills = undefined;
              this.rdeaths = undefined;
              this.rassists = undefined;
              this.matchResult = undefined;
              this.roundTime = undefined;
              this.gameTime = undefined;
              this.date = undefined;
              this.endLog = undefined;
            }
          }
        }

        if (info.match_info !== undefined) {
          // Use this to get game mode and gameID, happens on match queue
          if (info.match_info.game_mode_log !== undefined) {
            // game mode
            this.gameMode = info.match_info.game_mode_log;

            // game id
            this.getCurrentGameClassId().then((value) => (this.gameID = value));
          }
          // Use this to tally assists
          if (info.match_info.round_end_log !== undefined) {
            var roundEndLog = info.match_info.round_end_log.split(",");
            var NUMASSISTS;
            for (var i = 0; i < roundEndLog.length; i++) {
              if (roundEndLog[i].includes("NUMASSISTS")) {
                NUMASSISTS = roundEndLog[i];
                break;
              }
            }
            NUMASSISTS = NUMASSISTS.split(":");
            var assistsToAdd = parseInt(NUMASSISTS[1]);
            if (this.rassists == undefined) {
              this.rassists = 0;
            }
            this.rassists += assistsToAdd;
          }
          // Get match end reason
          if (info.match_info.match_end_log !== undefined) {
            console.log(typeof info.match_info.match_end_log);
            console.log(info.match_info.match_end_log);
            var matchEndLog = info.match_info.match_end_log.split(",");
            for (var i = 0; i < matchEndLog.length; i++) {
              if (matchEndLog[i].includes("ENDREASON")) {
                this.endLog = matchEndLog[i];
                break;
              }
            }
            console.log(this.endLog);
            this.endLog = this.endLog.split(":");
            console.log(this.endLog);
            this.endLog = this.endLog[1];
            console.log(this.endLog);
          }
        }
        
        if (info.game_info !== undefined) {
          if (info.game_info.phase !== undefined) {
            if (info.game_info.phase == "round_results") {
              // Use this to start time for tally
              this.roundStart = new Date();

              if (this.gameTime == undefined) {
                // game time
                var hours = new Date().getHours();
                var minutes = new Date().getMinutes();
                hours = String(hours).padStart(2, "0");
                minutes = String(minutes).padStart(2, "0");
                this.gameTime = hours + ":" + minutes;
              }

              if (this.date == undefined) {
                // Define the date
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, "0");
                var mm = String(today.getMonth() + 1).padStart(2, "0");
                var yyyy = today.getFullYear();
                this.date = mm + "/" + dd + "/" + yyyy;
              }
            }
          }
        }

        // Exclude player rosters
        if (info.players !== undefined) {
          var rosterCheck;
          for (const key in info.players) {
            if (info.players.hasOwnProperty(key)) {
              if (key.includes("roster")) {
                rosterCheck = true;
              }
            }
          }
          if (rosterCheck != true) {
            console.log("info.players");
            console.log(info.players);
          }
        }
        this.logLine(this._infoLog, info, false);
      }
      onNewEvents(e) {
        const shouldHighlight = e.events.some((event) => {
          switch (event.name) {
            case "kill":
              console.log("Kill");
              if (this.rkills == undefined) {
                this.rkills = 0;
              }
              this.rkills += 1;
              console.log(this.rkills);
              console.log(e.events);
              // set global kills and filter for just the killNum
              if (this.gameID == 21640 || this.gameID == 5426) {
                this.kills = e.events[0].data;
                var r = /\d+/;
                this.kills = this.kills.match(r);
                this.kills = this.kills[0];
              }
              return true;
            case "death":
              console.log("Death");
              if (this.rdeaths == undefined) {
                this.rdeaths = 0;
              }
              this.rdeaths += 1;
              console.log(this.rdeaths);
              console.log(e.events);
              // set global deaths
              if (this.gameID == 21640 || this.gameID == 5426) {
                this.deaths = e.events[0].data;
                var r = /\d+/;
                this.deaths = this.deaths.match(r);
                this.deaths = this.deaths[0];
              }
              return true;
            case "assist":
              // set global assists
              this.assists = e.events[0].data;
              var r = /\d+/;
              this.assists = this.assists.match(r);
              this.assists = this.assists[0];
              return true;
            case "level":
              return true;
            case "announcer":
              // If the match ends
              if (
                e.events[0].data.includes("victory") ||
                e.events[0].data.includes("defeat")
              ) {
                // Get match outcome from announcer
                if (e.events[0].data.includes("victory")) {
                  this.matchResult = "win";
                  console.log(this.matchResult);
                }
                if (e.events[0].data.includes("defeat")) {
                  this.matchResult = "loss";
                  console.log(this.matchResult);
                }
                // get match_end, matchLength, and print data, store in local storage
                this.matchEnd = new Date();
                var mLength = this.matchEnd - this.matchStart;
                // 1- Convert to seconds:
                var timeseconds = mLength / 1000;
                // 2- Extract hours:
                var timehours = parseInt(timeseconds / 3600); // 3,600 seconds in 1 hour
                timeseconds = timeseconds % 3600; // seconds remaining after extracting hours
                // 3- Extract minutes:
                var timeminutes = parseInt(timeseconds / 60); // 60 seconds in 1 minute
                // 4- Keep only seconds not extracted to minutes:
                timeseconds = timeseconds % 60;
                // 5- Ensure each num will have 2 digits
                timeseconds = Math.round(timeseconds);
                timeminutes = Math.round(timeminutes);
                timehours = Math.round(timehours);
                timeseconds = String(timeseconds).padStart(2, "0");
                timeminutes = String(timeminutes).padStart(2, "0");
                timehours = String(timehours).padStart(2, "0");
                mLength = timehours + ":" + timeminutes + ":" + timeseconds;

                // Expire: Test code for expiring data
                var keysToDelete = [];
                for (var i = 0; i < localStorage.length; i++) {
                  var key = localStorage.key(i);
                  var gameArr = localStorage.getItem(key).split(" ");
                  var gameDate = gameArr[7];
                  var date1 = new Date(gameDate).getTime();
                  var date2 = new Date(this.date).getTime();
                  var timeDiff = date2 - date1;
                  var daysDiff = timeDiff / (1000 * 3600 * 24);
                  if (daysDiff >= 30) {
                    keysToDelete.push(key);
                  }
                }
                for (var i = 0; i < keysToDelete.length; i++) {
                  localStorage.removeItem(keysToDelete[i]);
                }
                // End Expire:

                // Normal Game Add:
                var maxKey = 0;
                for (var i = 0; i < localStorage.length; i++) {
                  if (maxKey <= Number(localStorage.key(i))) {
                    maxKey = Number(localStorage.key(i)) + 1;
                  }
                }
                // Ensure that kda all have values
                if (this.kills == undefined) {
                  this.kills = 0;
                }
                if (this.deaths == undefined) {
                  this.deaths = 0;
                }
                if (this.assists == undefined) {
                  this.assists = 0;
                }

                console.log("Game ID: " + this.gameID);
                console.log("Kills: " + this.kills);
                console.log("Deaths: " + this.deaths);
                console.log("Assists: " + this.assists);
                console.log("Match Result: " + this.matchResult);
                console.log("Match Length: " + mLength);
                console.log("Game Time: " + this.gameTime);
                console.log("Date: " + this.date);

                if (
                  this.gameClassic == true &&
                  this.hasBots != true &&
                  this.isLol == "lol"
                ) {
                  // Only add entry if all values are defined
                  if (
                    this.gameID !== undefined &&
                    this.matchResult !== undefined &&
                    mLength !== "NaN:NaN:NaN" &&
                    this.gameTime !== undefined &&
                    this.date !== undefined
                  ) {
                    var gMinutes = mLength.split(":");
                    console.log(gMinutes);
                    var gMinutes = gMinutes[1];
                    console.log(gMinutes[1]);
                    var gMinutes = parseInt(gMinutes);
                    console.log(gMinutes);
                    if (gMinutes >= 14) {
                      var dataString =
                        String(this.gameID) +
                        " " +
                        String(this.kills) +
                        " " +
                        String(this.deaths) +
                        " " +
                        String(this.assists) +
                        " " +
                        String(this.matchResult) +
                        " " +
                        String(mLength) +
                        " " +
                        String(this.gameTime) +
                        " " +
                        String(this.date);
                      localStorage.setItem(String(maxKey), dataString);
                    }
                  }
                  // End Normal Game Add:
                }

                // George: Analyze Database

                // Reset global vars
                this.gameID = undefined;
                this.kills = undefined;
                this.deaths = undefined;
                this.assists = undefined;
                this.matchStart = undefined;
                this.matchEnd = undefined;
                this.matchLength = undefined;
                this.date = undefined;
                this.gameTime = undefined;
                this.gameMode = undefined;
                //this.ranked = undefined;
                this.roundsCompleted = undefined;
                this.matchResult = undefined;
                //this.enterData = undefined;
                var gameClassic = undefined;
                var hasBots = undefined;
                var isLol = undefined;
              }
              return true;
            case "matchStart":
            case "match_start":
              console.log("match started");
              // Reset global vars
              this.gameID = undefined;
              this.kills = undefined;
              this.deaths = undefined;
              this.assists = undefined;
              this.matchStart = undefined;
              this.matchEnd = undefined;
              this.matchLength = undefined;
              this.date = undefined;
              this.gameTime = undefined;
              this.gameMode = undefined;
              this.roundsCompleted = undefined;
              this.matchResult = undefined;

              // get match_start, GameID, gameTime, reset kda to 0, and date
              this.matchStart = new Date();

              var hours = new Date().getHours();
              var minutes = new Date().getMinutes();
              hours = String(hours).padStart(2, "0");
              minutes = String(minutes).padStart(2, "0");
              this.gameTime = hours + ":" + minutes;

              this.getCurrentGameClassId().then(
                (value) => (this.gameID = value)
              );

              this.kills = "0";
              this.deaths = "0";
              this.assists = "0";

              var today = new Date();
              var dd = String(today.getDate()).padStart(2, "0");
              var mm = String(today.getMonth() + 1).padStart(2, "0");
              var yyyy = today.getFullYear();
              this.date = mm + "/" + dd + "/" + yyyy;
              return true;
            case "matchEnd":
            case "match_end":
              return true;
            case "roundStart":
              // // Use this to start time for tally
              // this.roundStart = new Date();

              // if (this.gameTime == undefined) {
              //   // game time
              //   var hours = new Date().getHours();
              //   var minutes = new Date().getMinutes();
              //   hours = String(hours).padStart(2, "0");
              //   minutes = String(minutes).padStart(2, "0");
              //   this.gameTime = hours + ":" + minutes;
              // }

              // if (this.date == undefined) {
              //   // Define the date
              //   var today = new Date();
              //   var dd = String(today.getDate()).padStart(2, "0");
              //   var mm = String(today.getMonth() + 1).padStart(2, "0");
              //   var yyyy = today.getFullYear();
              //   this.date = mm + "/" + dd + "/" + yyyy;
              // }
              return true;
            case "roundEnd":
              // Use this to end time for tally
              this.roundEnd = new Date();

              var currentRoundTime = this.roundEnd - this.roundStart;
              console.log(currentRoundTime);
              if (this.roundTime == undefined) {
                this.roundTime = currentRoundTime;
              } else {
                this.roundTime += currentRoundTime;
              }
              console.log(this.roundTime);
              return true;
            case "matchOutcome":
              // Use this for match outcome
              if (e.events[0].data == "victory")
              {
                this.matchResult = "win";
              }
              else if (e.events[0].data == "defeat")
              {
                this.matchResult = "loss";
              }
              return true;
            case "roundOutcome":
              return true;
          }
          return false;
        });
        console.log(e);
        this.logLine(this._eventsLog, e, shouldHighlight);
      }
    async setToggleHotkeyText() {
        const gameClassId = await this.getCurrentGameClassId();
        const hotkeyText = await overwolf_api_ts_1.OWHotkeys.getHotkeyText(consts_1.kHotkeys.toggle, gameClassId);
        const hotkeyElem = document.getElementById('hotkey');
        hotkeyElem.textContent = hotkeyText;
    }
    async setToggleHotkeyBehavior() {
        const toggleInGameWindow = async (hotkeyResult) => {
            console.log(`pressed hotkey for ${hotkeyResult.name}`);
            const inGameState = await this.getWindowState();
            if (inGameState.window_state === "normal" ||
                inGameState.window_state === "maximized") {
                this.currWindow.minimize();
            }
            else if (inGameState.window_state === "minimized" ||
                inGameState.window_state === "closed") {
                this.currWindow.restore();
            }
        };
        overwolf_api_ts_1.OWHotkeys.onHotkeyDown(consts_1.kHotkeys.toggle, toggleInGameWindow);
    }
    logLine(log, data, highlight) {
        const line = document.createElement('pre');
        line.textContent = JSON.stringify(data);
        if (highlight) {
            line.className = 'highlight';
        }
        const shouldAutoScroll = log.scrollTop + log.offsetHeight >= log.scrollHeight - 10;
        log.appendChild(line);
        if (shouldAutoScroll) {
            log.scrollTop = log.scrollHeight;
        }
    }
    async getCurrentGameClassId() {
        const info = await overwolf_api_ts_1.OWGames.getRunningGameInfo();
        return (info && info.isRunning && info.classId) ? info.classId : null;
    }
}
InGame.instance().run();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lLWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLWV2ZW50cy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1ob3RrZXlzLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LXdpbmRvdy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC90aW1lci5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vc3JjL0FwcFdpbmRvdy50cyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vc3JjL2NvbnN0cy50cyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9zcmMvaW5fZ2FtZS9pbl9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNi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LENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQzNCO1FBQ0gsQ0FBQztRQUVELDJCQUFTLENBQUMsWUFBWSxDQUFDLGlCQUFRLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUdPLE9BQU8sQ0FBQyxHQUFnQixFQUFFLElBQUksRUFBRSxTQUFTO1FBQy9DLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7U0FDOUI7UUFHRCxNQUFNLGdCQUFnQixHQUNwQixHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLElBQUksR0FBRyxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFFNUQsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QixJQUFJLGdCQUFnQixFQUFFO1lBQ3BCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQztTQUNsQztJQUNILENBQUM7SUFFTyxLQUFLLENBQUMscUJBQXFCO1FBQ2pDLE1BQU0sSUFBSSxHQUFHLE1BQU0seUJBQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRWhELE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN4RSxDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMiLCJmaWxlIjoianMvaW5fZ2FtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZS1saXN0ZW5lclwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lcy1ldmVudHNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZXNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctaG90a2V5c1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1saXN0ZW5lclwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy13aW5kb3dcIiksIGV4cG9ydHMpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZUxpc3RlbmVyID0gdm9pZCAwO1xyXG5jb25zdCBvd19saXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vb3ctbGlzdGVuZXJcIik7XHJcbmNsYXNzIE9XR2FtZUxpc3RlbmVyIGV4dGVuZHMgb3dfbGlzdGVuZXJfMS5PV0xpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlKSB7XHJcbiAgICAgICAgc3VwZXIoZGVsZWdhdGUpO1xyXG4gICAgICAgIHRoaXMub25HYW1lSW5mb1VwZGF0ZWQgPSAodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdXBkYXRlIHx8ICF1cGRhdGUuZ2FtZUluZm8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZS5ydW5uaW5nQ2hhbmdlZCAmJiAhdXBkYXRlLmdhbWVDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZS5nYW1lSW5mby5pc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCh1cGRhdGUuZ2FtZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZUVuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lRW5kZWQodXBkYXRlLmdhbWVJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vblJ1bm5pbmdHYW1lSW5mbyA9IChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghaW5mbykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbmZvLmlzUnVubmluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHN1cGVyLnN0YXJ0KCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMub25HYW1lSW5mb1VwZGF0ZWQuYWRkTGlzdGVuZXIodGhpcy5vbkdhbWVJbmZvVXBkYXRlZCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UnVubmluZ0dhbWVJbmZvKHRoaXMub25SdW5uaW5nR2FtZUluZm8pO1xyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5vbkdhbWVJbmZvVXBkYXRlZC5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uR2FtZUluZm9VcGRhdGVkKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZUxpc3RlbmVyID0gT1dHYW1lTGlzdGVuZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lc0V2ZW50cyA9IHZvaWQgMDtcclxuY29uc3QgdGltZXJfMSA9IHJlcXVpcmUoXCIuL3RpbWVyXCIpO1xyXG5jbGFzcyBPV0dhbWVzRXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlLCByZXF1aXJlZEZlYXR1cmVzLCBmZWF0dXJlUmV0cmllcyA9IDEwKSB7XHJcbiAgICAgICAgdGhpcy5vbkluZm9VcGRhdGVzID0gKGluZm8pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25JbmZvVXBkYXRlcyhpbmZvLmluZm8pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vbk5ld0V2ZW50cyA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uTmV3RXZlbnRzKGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgICAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzID0gcmVxdWlyZWRGZWF0dXJlcztcclxuICAgICAgICB0aGlzLl9mZWF0dXJlUmV0cmllcyA9IGZlYXR1cmVSZXRyaWVzO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0SW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLmdldEluZm8ocmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzZXRSZXF1aXJlZEZlYXR1cmVzKCkge1xyXG4gICAgICAgIGxldCB0cmllcyA9IDEsIHJlc3VsdDtcclxuICAgICAgICB3aGlsZSAodHJpZXMgPD0gdGhpcy5fZmVhdHVyZVJldHJpZXMpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMuc2V0UmVxdWlyZWRGZWF0dXJlcyh0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLCByZXNvbHZlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZXRSZXF1aXJlZEZlYXR1cmVzKCk6IHN1Y2Nlc3M6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQsIG51bGwsIDIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAocmVzdWx0LnN1cHBvcnRlZEZlYXR1cmVzLmxlbmd0aCA+IDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IHRpbWVyXzEuVGltZXIud2FpdCgzMDAwKTtcclxuICAgICAgICAgICAgdHJpZXMrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdzZXRSZXF1aXJlZEZlYXR1cmVzKCk6IGZhaWx1cmUgYWZ0ZXIgJyArIHRyaWVzICsgJyB0cmllcycgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQsIG51bGwsIDIpKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZWdpc3RlckV2ZW50cygpIHtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25JbmZvVXBkYXRlczIuYWRkTGlzdGVuZXIodGhpcy5vbkluZm9VcGRhdGVzKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25OZXdFdmVudHMuYWRkTGlzdGVuZXIodGhpcy5vbk5ld0V2ZW50cyk7XHJcbiAgICB9XHJcbiAgICB1blJlZ2lzdGVyRXZlbnRzKCkge1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbkluZm9VcGRhdGVzMi5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uSW5mb1VwZGF0ZXMpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbk5ld0V2ZW50cy5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uTmV3RXZlbnRzKTtcclxuICAgIH1cclxuICAgIGFzeW5jIHN0YXJ0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbb3ctZ2FtZS1ldmVudHNdIFNUQVJUYCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2V0UmVxdWlyZWRGZWF0dXJlcygpO1xyXG4gICAgICAgIGNvbnN0IHsgcmVzLCBzdGF0dXMgfSA9IGF3YWl0IHRoaXMuZ2V0SW5mbygpO1xyXG4gICAgICAgIGlmIChyZXMgJiYgc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkluZm9VcGRhdGVzKHsgaW5mbzogcmVzIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtvdy1nYW1lLWV2ZW50c10gU1RPUGApO1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lc0V2ZW50cyA9IE9XR2FtZXNFdmVudHM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lcyA9IHZvaWQgMDtcclxuY2xhc3MgT1dHYW1lcyB7XHJcbiAgICBzdGF0aWMgZ2V0UnVubmluZ0dhbWVJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8ocmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY2xhc3NJZEZyb21HYW1lSWQoZ2FtZUlkKSB7XHJcbiAgICAgICAgbGV0IGNsYXNzSWQgPSBNYXRoLmZsb29yKGdhbWVJZCAvIDEwKTtcclxuICAgICAgICByZXR1cm4gY2xhc3NJZDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRSZWNlbnRseVBsYXllZEdhbWVzKGxpbWl0ID0gMykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIW92ZXJ3b2xmLmdhbWVzLmdldFJlY2VudGx5UGxheWVkR2FtZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJlY2VudGx5UGxheWVkR2FtZXMobGltaXQsIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC5nYW1lcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldEdhbWVEQkluZm8oZ2FtZUNsYXNzSWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0R2FtZURCSW5mbyhnYW1lQ2xhc3NJZCwgcmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVzID0gT1dHYW1lcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0hvdGtleXMgPSB2b2lkIDA7XHJcbmNsYXNzIE9XSG90a2V5cyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgc3RhdGljIGdldEhvdGtleVRleHQoaG90a2V5SWQsIGdhbWVJZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5nZXQocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaG90a2V5O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnYW1lSWQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG90a2V5ID0gcmVzdWx0Lmdsb2JhbHMuZmluZChoID0+IGgubmFtZSA9PT0gaG90a2V5SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdC5nYW1lcyAmJiByZXN1bHQuZ2FtZXNbZ2FtZUlkXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG90a2V5ID0gcmVzdWx0LmdhbWVzW2dhbWVJZF0uZmluZChoID0+IGgubmFtZSA9PT0gaG90a2V5SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChob3RrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGhvdGtleS5iaW5kaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoJ1VOQVNTSUdORUQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgb25Ib3RrZXlEb3duKGhvdGtleUlkLCBhY3Rpb24pIHtcclxuICAgICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLm9uUHJlc3NlZC5hZGRMaXN0ZW5lcigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lm5hbWUgPT09IGhvdGtleUlkKVxyXG4gICAgICAgICAgICAgICAgYWN0aW9uKHJlc3VsdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0hvdGtleXMgPSBPV0hvdGtleXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dMaXN0ZW5lciA9IHZvaWQgMDtcclxuY2xhc3MgT1dMaXN0ZW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSkge1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XTGlzdGVuZXIgPSBPV0xpc3RlbmVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XV2luZG93ID0gdm9pZCAwO1xyXG5jbGFzcyBPV1dpbmRvdyB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuX2lkID0gbnVsbDtcclxuICAgIH1cclxuICAgIGFzeW5jIHJlc3RvcmUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLnJlc3RvcmUoaWQsIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5zdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtyZXN0b3JlXSAtIGFuIGVycm9yIG9jY3VycmVkLCB3aW5kb3dJZD0ke2lkfSwgcmVhc29uPSR7cmVzdWx0LmVycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIG1pbmltaXplKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5taW5pbWl6ZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIG1heGltaXplKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5tYXhpbWl6ZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGhpZGUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmhpZGUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBjbG9zZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZ2V0V2luZG93U3RhdGUoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICYmXHJcbiAgICAgICAgICAgICAgICAocmVzdWx0LndpbmRvd19zdGF0ZSAhPT0gJ2Nsb3NlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmludGVybmFsQ2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZHJhZ01vdmUoZWxlbSkge1xyXG4gICAgICAgIGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUgKyAnIGRyYWdnYWJsZSc7XHJcbiAgICAgICAgZWxlbS5vbm1vdXNlZG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZHJhZ01vdmUodGhpcy5fbmFtZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGFzeW5jIGdldFdpbmRvd1N0YXRlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRXaW5kb3dTdGF0ZShpZCwgcmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0Q3VycmVudEluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0Q3VycmVudFdpbmRvdyhyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQud2luZG93KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvYnRhaW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2IgPSByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuc3RhdHVzID09PSBcInN1Y2Nlc3NcIiAmJiByZXMud2luZG93ICYmIHJlcy53aW5kb3cuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IHJlcy53aW5kb3cuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSByZXMud2luZG93Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzLndpbmRvdyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRDdXJyZW50V2luZG93KGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3Mub2J0YWluRGVjbGFyZWRXaW5kb3codGhpcy5fbmFtZSwgY2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBhc3N1cmVPYnRhaW5lZCgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQub2J0YWluKCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBpbnRlcm5hbENsb3NlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmNsb3NlKGlkLCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuc3VjY2VzcylcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dXaW5kb3cgPSBPV1dpbmRvdztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5UaW1lciA9IHZvaWQgMDtcclxuY2xhc3MgVGltZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUsIGlkKSB7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUaW1lckV2ZW50ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25UaW1lcih0aGlzLl9pZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgd2FpdChpbnRlcnZhbEluTVMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgaW50ZXJ2YWxJbk1TKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXJ0KGludGVydmFsSW5NUykge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBzZXRUaW1lb3V0KHRoaXMuaGFuZGxlVGltZXJFdmVudCwgaW50ZXJ2YWxJbk1TKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVySWQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcklkKTtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlRpbWVyID0gVGltZXI7XHJcbiIsImltcG9ydCB7IE9XV2luZG93IH0gZnJvbSBcIkBvdmVyd29sZi9vdmVyd29sZi1hcGktdHNcIjtcblxuLy8gQSBiYXNlIGNsYXNzIGZvciB0aGUgYXBwJ3MgZm9yZWdyb3VuZCB3aW5kb3dzLlxuLy8gU2V0cyB0aGUgbW9kYWwgYW5kIGRyYWcgYmVoYXZpb3JzLCB3aGljaCBhcmUgc2hhcmVkIGFjY3Jvc3MgdGhlIGRlc2t0b3AgYW5kIGluLWdhbWUgd2luZG93cy5cbmV4cG9ydCBjbGFzcyBBcHBXaW5kb3cge1xuICBwcm90ZWN0ZWQgY3VycldpbmRvdzogT1dXaW5kb3c7XG4gIHByb3RlY3RlZCBtYWluV2luZG93OiBPV1dpbmRvdztcbiAgcHJvdGVjdGVkIG1heGltaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHdpbmRvd05hbWUpIHtcbiAgICB0aGlzLm1haW5XaW5kb3cgPSBuZXcgT1dXaW5kb3coJ2JhY2tncm91bmQnKTtcbiAgICB0aGlzLmN1cnJXaW5kb3cgPSBuZXcgT1dXaW5kb3cod2luZG93TmFtZSk7XG5cbiAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZUJ1dHRvbicpO1xuICAgIGNvbnN0IG1heGltaXplQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21heGltaXplQnV0dG9uJyk7XG4gICAgY29uc3QgbWluaW1pemVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWluaW1pemVCdXR0b24nKTtcblxuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXInKTtcblxuICAgIHRoaXMuc2V0RHJhZyhoZWFkZXIpO1xuXG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLm1haW5XaW5kb3cuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIG1pbmltaXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5jdXJyV2luZG93Lm1pbmltaXplKCk7XG4gICAgfSk7XG5cbiAgICBtYXhpbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5tYXhpbWl6ZWQpIHtcbiAgICAgICAgdGhpcy5jdXJyV2luZG93Lm1heGltaXplKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN1cnJXaW5kb3cucmVzdG9yZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1heGltaXplZCA9ICF0aGlzLm1heGltaXplZDtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRXaW5kb3dTdGF0ZSgpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jdXJyV2luZG93LmdldFdpbmRvd1N0YXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldERyYWcoZWxlbSkge1xuICAgIHRoaXMuY3VycldpbmRvdy5kcmFnTW92ZShlbGVtKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGtHYW1lc0ZlYXR1cmVzID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZ1tdPihbXG4gIC8vIEZvcnRuaXRlXG4gIFtcbiAgICAyMTIxNixcbiAgICBbXG4gICAgICAna2lsbCcsXG4gICAgICAna2lsbGVkJyxcbiAgICAgICdraWxsZXInLFxuICAgICAgJ3Jldml2ZWQnLFxuICAgICAgJ2RlYXRoJyxcbiAgICAgICdtYXRjaCcsXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAncmFuaycsXG4gICAgICAnbWUnLFxuICAgICAgJ3BoYXNlJyxcbiAgICAgICdsb2NhdGlvbicsXG4gICAgICAndGVhbScsXG4gICAgICAnaXRlbXMnLFxuICAgICAgJ2NvdW50ZXJzJ1xuICAgIF1cbiAgXSxcbiAgLy8gQ1NHT1xuICBbXG4gICAgNzc2NCxcbiAgICBbXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAna2lsbCcsXG4gICAgICAnZGVhdGgnLFxuICAgICAgJ2Fzc2lzdCcsXG4gICAgICAnaGVhZHNob3QnLFxuICAgICAgJ3JvdW5kX3N0YXJ0JyxcbiAgICAgICdtYXRjaF9zdGFydCcsXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAnbWF0Y2hfZW5kJyxcbiAgICAgICd0ZWFtX3JvdW5kX3dpbicsXG4gICAgICAnYm9tYl9wbGFudGVkJyxcbiAgICAgICdib21iX2NoYW5nZScsXG4gICAgICAncmVsb2FkaW5nJyxcbiAgICAgICdmaXJlZCcsXG4gICAgICAnd2VhcG9uX2NoYW5nZScsXG4gICAgICAnd2VhcG9uX2FjcXVpcmVkJyxcbiAgICAgICdpbmZvJyxcbiAgICAgICdyb3N0ZXInLFxuICAgICAgJ3BsYXllcl9hY3Rpdml0eV9jaGFuZ2UnLFxuICAgICAgJ3RlYW1fc2V0JyxcbiAgICAgICdyZXBsYXknLFxuICAgICAgJ2NvdW50ZXJzJyxcbiAgICAgICdtdnAnLFxuICAgICAgJ3Njb3JlYm9hcmQnLFxuICAgICAgJ2tpbGxfZmVlZCdcbiAgICBdXG4gIF0sXG4gIC8vIExlYWd1ZSBvZiBMZWdlbmRzXG4gIFtcbiAgICA1NDI2LFxuICAgIFtcbiAgICAgICdsaXZlX2NsaWVudF9kYXRhJyxcbiAgICAgICdtYXRjaFN0YXRlJyxcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdkZWF0aCcsXG4gICAgICAncmVzcGF3bicsXG4gICAgICAnYWJpbGl0aWVzJyxcbiAgICAgICdraWxsJyxcbiAgICAgICdhc3Npc3QnLFxuICAgICAgJ2dvbGQnLFxuICAgICAgJ21pbmlvbnMnLFxuICAgICAgJ3N1bW1vbmVyX2luZm8nLFxuICAgICAgJ2dhbWVNb2RlJyxcbiAgICAgICd0ZWFtcycsXG4gICAgICAnbGV2ZWwnLFxuICAgICAgJ2Fubm91bmNlcicsXG4gICAgICAnY291bnRlcnMnLFxuICAgICAgJ2RhbWFnZScsXG4gICAgICAnaGVhbCdcbiAgICBdXG4gIF0sXG4gIC8vIEVzY2FwZSBGcm9tIFRhcmtvdlxuICBbXG4gICAgMjE2MzQsXG4gICAgW1xuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ2dhbWVfaW5mbydcbiAgICBdXG4gIF0sXG4gIC8vIE1pbmVjcmFmdFxuICBbXG4gICAgODAzMixcbiAgICBbXG4gICAgICAnZ2FtZV9pbmZvJyxcbiAgICAgICdtYXRjaF9pbmZvJ1xuICAgIF1cbiAgXSxcbiAgLy8gT3ZlcndhdGNoXG4gIFtcbiAgICAxMDg0NCxcbiAgICBbXG4gICAgICAnZ2FtZV9pbmZvJyxcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdraWxsJyxcbiAgICAgICdkZWF0aCdcbiAgICBdXG4gIF0sXG4gIC8vIFBVQkdcbiAgW1xuICAgIDEwOTA2LFxuICAgIFtcbiAgICAgICdraWxsJyxcbiAgICAgICdyZXZpdmVkJyxcbiAgICAgICdkZWF0aCcsXG4gICAgICAna2lsbGVyJyxcbiAgICAgICdtYXRjaCcsXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAncmFuaycsXG4gICAgICAnY291bnRlcnMnLFxuICAgICAgJ2xvY2F0aW9uJyxcbiAgICAgICdtZScsXG4gICAgICAndGVhbScsXG4gICAgICAncGhhc2UnLFxuICAgICAgJ21hcCcsXG4gICAgICAncm9zdGVyJ1xuICAgIF1cbiAgXSxcbiAgLy8gUmFpbmJvdyBTaXggU2llZ2VcbiAgW1xuICAgIDEwODI2LFxuICAgIFtcbiAgICAgICdnYW1lX2luZm8nLFxuICAgICAgJ21hdGNoJyxcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdyb3N0ZXInLFxuICAgICAgJ2tpbGwnLFxuICAgICAgJ2RlYXRoJyxcbiAgICAgICdtZScsXG4gICAgICAnZGVmdXNlcidcbiAgICBdXG4gIF0sXG4gIC8vIFNwbGl0Z2F0ZTogQXJlbmEgV2FyZmFyZVxuICBbXG4gICAgMjE0MDQsXG4gICAgW1xuICAgICAgJ2dhbWVfaW5mbycsXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAncGxheWVyJyxcbiAgICAgICdsb2NhdGlvbicsXG4gICAgICAnbWF0Y2gnLFxuICAgICAgJ2ZlZWQnLFxuICAgICAgJ2Nvbm5lY3Rpb24nLFxuICAgICAgJ2tpbGwnLFxuICAgICAgJ2RlYXRoJyxcbiAgICAgICdwb3J0YWwnLFxuICAgICAgJ2Fzc2lzdCdcbiAgICBdXG4gIF0sXG4gIC8vIFBhdGggb2YgRXhpbGVcbiAgW1xuICAgIDcyMTIsXG4gICAgW1xuICAgICAgJ2tpbGwnLFxuICAgICAgJ2RlYXRoJyxcbiAgICAgICdtZScsXG4gICAgICAnbWF0Y2hfaW5mbydcbiAgICBdXG4gIF0sXG4gIC8vIFZhbG9yYW50XG4gIFtcbiAgICAyMTY0MCxcbiAgICBbXG4gICAgICAnbWUnLFxuICAgICAgJ2dhbWVfaW5mbycsXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAna2lsbCcsXG4gICAgICAnZGVhdGgnXG4gICAgXVxuICBdLFxuICAvLyBEb3RhIDJcbiAgW1xuICAgIDczMTQsXG4gICAgW1xuICAgICAgJ2dhbWVfc3RhdGVfY2hhbmdlZCcsXG4gICAgICAnbWF0Y2hfc3RhdGVfY2hhbmdlZCcsXG4gICAgICAnbWF0Y2hfZGV0ZWN0ZWQnLFxuICAgICAgJ2RheXRpbWVfY2hhbmdlZCcsXG4gICAgICAnY2xvY2tfdGltZV9jaGFuZ2VkJyxcbiAgICAgICd3YXJkX3B1cmNoYXNlX2Nvb2xkb3duX2NoYW5nZWQnLFxuICAgICAgJ21hdGNoX2VuZGVkJyxcbiAgICAgICdraWxsJyxcbiAgICAgICdhc3Npc3QnLFxuICAgICAgJ2RlYXRoJyxcbiAgICAgICdjcycsXG4gICAgICAneHBtJyxcbiAgICAgICdncG0nLFxuICAgICAgJ2dvbGQnLFxuICAgICAgJ2hlcm9fbGV2ZWxlZF91cCcsXG4gICAgICAnaGVyb19yZXNwYXduZWQnLFxuICAgICAgJ2hlcm9fYnV5YmFja19pbmZvX2NoYW5nZWQnLFxuICAgICAgJ2hlcm9fYm91Z2h0YmFjaycsXG4gICAgICAnaGVyb19oZWFsdGhfbWFuYV9pbmZvJyxcbiAgICAgICdoZXJvX3N0YXR1c19lZmZlY3RfY2hhbmdlZCcsXG4gICAgICAnaGVyb19hdHRyaWJ1dGVzX3NraWxsZWQnLFxuICAgICAgJ2hlcm9fYWJpbGl0eV9za2lsbGVkJyxcbiAgICAgICdoZXJvX2FiaWxpdHlfdXNlZCcsXG4gICAgICAnaGVyb19hYmlsaXR5X2Nvb2xkb3duX2NoYW5nZWQnLFxuICAgICAgJ2hlcm9fYWJpbGl0eV9jaGFuZ2VkJyxcbiAgICAgICdoZXJvX2l0ZW1fY29vbGRvd25fY2hhbmdlZCcsXG4gICAgICAnaGVyb19pdGVtX2NoYW5nZWQnLFxuICAgICAgJ2hlcm9faXRlbV91c2VkJyxcbiAgICAgICdoZXJvX2l0ZW1fY29uc3VtZWQnLFxuICAgICAgJ2hlcm9faXRlbV9jaGFyZ2VkJyxcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdyb3N0ZXInLFxuICAgICAgJ3BhcnR5JyxcbiAgICAgICdlcnJvcicsXG4gICAgICAnaGVyb19wb29sJyxcbiAgICAgICdtZScsXG4gICAgICAnZ2FtZSdcbiAgICBdXG4gIF0sXG4gIC8vIENhbGwgb2YgRHV0eTogV2Fyem9uZVxuICBbXG4gICAgMjE2MjYsXG4gICAgW1xuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ2dhbWVfaW5mbycsXG4gICAgICAna2lsbCcsXG4gICAgICAnZGVhdGgnXG4gICAgXVxuICBdLFxuICAvLyBXYXJmcmFtZVxuICBbXG4gICAgODk1NCxcbiAgICBbXG4gICAgICAnZ2FtZV9pbmZvJyxcbiAgICAgICdtYXRjaF9pbmZvJ1xuICAgIF1cbiAgXSxcbl0pO1xuXG5leHBvcnQgY29uc3Qga0dhbWVDbGFzc0lkcyA9IEFycmF5LmZyb20oa0dhbWVzRmVhdHVyZXMua2V5cygpKTtcblxuZXhwb3J0IGNvbnN0IGtXaW5kb3dOYW1lcyA9IHtcbiAgaW5HYW1lOiAnaW5fZ2FtZScsXG4gIGRlc2t0b3A6ICdkZXNrdG9wJ1xufTtcblxuZXhwb3J0IGNvbnN0IGtIb3RrZXlzID0ge1xuICB0b2dnbGU6ICdzYW1wbGVfYXBwX3RzX3Nob3doaWRlJ1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHtcbiAgT1dHYW1lcyxcbiAgT1dHYW1lc0V2ZW50cyxcbiAgT1dIb3RrZXlzXG59IGZyb20gXCJAb3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzXCI7XG5cbmltcG9ydCB7IEFwcFdpbmRvdyB9IGZyb20gXCIuLi9BcHBXaW5kb3dcIjtcbmltcG9ydCB7IGtIb3RrZXlzLCBrV2luZG93TmFtZXMsIGtHYW1lc0ZlYXR1cmVzIH0gZnJvbSBcIi4uL2NvbnN0c1wiO1xuXG5pbXBvcnQgV2luZG93U3RhdGUgPSBvdmVyd29sZi53aW5kb3dzLldpbmRvd1N0YXRlRXg7XG5cbi8vIFRoZSB3aW5kb3cgZGlzcGxheWVkIGluLWdhbWUgd2hpbGUgYSBnYW1lIGlzIHJ1bm5pbmcuXG4vLyBJdCBsaXN0ZW5zIHRvIGFsbCBpbmZvIGV2ZW50cyBhbmQgdG8gdGhlIGdhbWUgZXZlbnRzIGxpc3RlZCBpbiB0aGUgY29uc3RzLnRzIGZpbGVcbi8vIGFuZCB3cml0ZXMgdGhlbSB0byB0aGUgcmVsZXZhbnQgbG9nIHVzaW5nIDxwcmU+IHRhZ3MuXG4vLyBUaGUgd2luZG93IGFsc28gc2V0cyB1cCBDdHJsK0YgYXMgdGhlIG1pbmltaXplL3Jlc3RvcmUgaG90a2V5LlxuLy8gTGlrZSB0aGUgYmFja2dyb3VuZCB3aW5kb3csIGl0IGFsc28gaW1wbGVtZW50cyB0aGUgU2luZ2xldG9uIGRlc2lnbiBwYXR0ZXJuLlxuY2xhc3MgSW5HYW1lIGV4dGVuZHMgQXBwV2luZG93IHtcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBJbkdhbWU7XG4gIHByaXZhdGUgX2dhbWVFdmVudHNMaXN0ZW5lcjogT1dHYW1lc0V2ZW50cztcbiAgcHJpdmF0ZSBfZXZlbnRzTG9nOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBfaW5mb0xvZzogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihrV2luZG93TmFtZXMuaW5HYW1lKTtcblxuICAgIHRoaXMuX2V2ZW50c0xvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdldmVudHNMb2cnKTtcbiAgICB0aGlzLl9pbmZvTG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZm9Mb2cnKTtcblxuICAgIHRoaXMuc2V0VG9nZ2xlSG90a2V5QmVoYXZpb3IoKTtcbiAgICB0aGlzLnNldFRvZ2dsZUhvdGtleVRleHQoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2UoKSB7XG4gICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xuICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgSW5HYW1lKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJ1bigpIHtcbiAgICBjb25zdCBnYW1lQ2xhc3NJZCA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudEdhbWVDbGFzc0lkKCk7XG5cbiAgICBjb25zdCBnYW1lRmVhdHVyZXMgPSBrR2FtZXNGZWF0dXJlcy5nZXQoZ2FtZUNsYXNzSWQpO1xuXG4gICAgaWYgKGdhbWVGZWF0dXJlcyAmJiBnYW1lRmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9nYW1lRXZlbnRzTGlzdGVuZXIgPSBuZXcgT1dHYW1lc0V2ZW50cyhcbiAgICAgICAge1xuICAgICAgICAgIG9uSW5mb1VwZGF0ZXM6IHRoaXMub25JbmZvVXBkYXRlcy5iaW5kKHRoaXMpLFxuICAgICAgICAgIG9uTmV3RXZlbnRzOiB0aGlzLm9uTmV3RXZlbnRzLmJpbmQodGhpcylcbiAgICAgICAgfSxcbiAgICAgICAgZ2FtZUZlYXR1cmVzXG4gICAgICApO1xuXG4gICAgICB0aGlzLl9nYW1lRXZlbnRzTGlzdGVuZXIuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uSW5mb1VwZGF0ZXMoaW5mbykge1xuICAgIHRoaXMubG9nTGluZSh0aGlzLl9pbmZvTG9nLCBpbmZvLCBmYWxzZSk7XG4gIH1cblxuICAvLyBTcGVjaWFsIGV2ZW50cyB3aWxsIGJlIGhpZ2hsaWdodGVkIGluIHRoZSBldmVudCBsb2dcbiAgcHJpdmF0ZSBvbk5ld0V2ZW50cyhlKSB7XG4gICAgY29uc3Qgc2hvdWxkSGlnaGxpZ2h0ID0gZS5ldmVudHMuc29tZShldmVudCA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50Lm5hbWUpIHtcbiAgICAgICAgY2FzZSAna2lsbCc6XG4gICAgICAgIGNhc2UgJ2RlYXRoJzpcbiAgICAgICAgY2FzZSAnYXNzaXN0JzpcbiAgICAgICAgY2FzZSAnbGV2ZWwnOlxuICAgICAgICBjYXNlICdtYXRjaFN0YXJ0JzpcbiAgICAgICAgY2FzZSAnbWF0Y2hfc3RhcnQnOlxuICAgICAgICBjYXNlICdtYXRjaEVuZCc6XG4gICAgICAgIGNhc2UgJ21hdGNoX2VuZCc6XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMubG9nTGluZSh0aGlzLl9ldmVudHNMb2csIGUsIHNob3VsZEhpZ2hsaWdodCk7XG4gIH1cblxuICAvLyBEaXNwbGF5cyB0aGUgdG9nZ2xlIG1pbmltaXplL3Jlc3RvcmUgaG90a2V5IGluIHRoZSB3aW5kb3cgaGVhZGVyXG4gIHByaXZhdGUgYXN5bmMgc2V0VG9nZ2xlSG90a2V5VGV4dCgpIHtcbiAgICBjb25zdCBnYW1lQ2xhc3NJZCA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudEdhbWVDbGFzc0lkKCk7XG4gICAgY29uc3QgaG90a2V5VGV4dCA9IGF3YWl0IE9XSG90a2V5cy5nZXRIb3RrZXlUZXh0KGtIb3RrZXlzLnRvZ2dsZSwgZ2FtZUNsYXNzSWQpO1xuICAgIGNvbnN0IGhvdGtleUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG90a2V5Jyk7XG4gICAgaG90a2V5RWxlbS50ZXh0Q29udGVudCA9IGhvdGtleVRleHQ7XG4gIH1cblxuICAvLyBTZXRzIHRvZ2dsZUluR2FtZVdpbmRvdyBhcyB0aGUgYmVoYXZpb3IgZm9yIHRoZSBDdHJsK0YgaG90a2V5XG4gIHByaXZhdGUgYXN5bmMgc2V0VG9nZ2xlSG90a2V5QmVoYXZpb3IoKSB7XG4gICAgY29uc3QgdG9nZ2xlSW5HYW1lV2luZG93ID0gYXN5bmMgKFxuICAgICAgaG90a2V5UmVzdWx0OiBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLk9uUHJlc3NlZEV2ZW50XG4gICAgKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgcHJlc3NlZCBob3RrZXkgZm9yICR7aG90a2V5UmVzdWx0Lm5hbWV9YCk7XG4gICAgICBjb25zdCBpbkdhbWVTdGF0ZSA9IGF3YWl0IHRoaXMuZ2V0V2luZG93U3RhdGUoKTtcblxuICAgICAgaWYgKGluR2FtZVN0YXRlLndpbmRvd19zdGF0ZSA9PT0gV2luZG93U3RhdGUuTk9STUFMIHx8XG4gICAgICAgIGluR2FtZVN0YXRlLndpbmRvd19zdGF0ZSA9PT0gV2luZG93U3RhdGUuTUFYSU1JWkVEKSB7XG4gICAgICAgIHRoaXMuY3VycldpbmRvdy5taW5pbWl6ZSgpO1xuICAgICAgfSBlbHNlIGlmIChpbkdhbWVTdGF0ZS53aW5kb3dfc3RhdGUgPT09IFdpbmRvd1N0YXRlLk1JTklNSVpFRCB8fFxuICAgICAgICBpbkdhbWVTdGF0ZS53aW5kb3dfc3RhdGUgPT09IFdpbmRvd1N0YXRlLkNMT1NFRCkge1xuICAgICAgICB0aGlzLmN1cnJXaW5kb3cucmVzdG9yZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIE9XSG90a2V5cy5vbkhvdGtleURvd24oa0hvdGtleXMudG9nZ2xlLCB0b2dnbGVJbkdhbWVXaW5kb3cpO1xuICB9XG5cbiAgLy8gQXBwZW5kcyBhIG5ldyBsaW5lIHRvIHRoZSBzcGVjaWZpZWQgbG9nXG4gIHByaXZhdGUgbG9nTGluZShsb2c6IEhUTUxFbGVtZW50LCBkYXRhLCBoaWdobGlnaHQpIHtcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncHJlJyk7XG4gICAgbGluZS50ZXh0Q29udGVudCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXG4gICAgaWYgKGhpZ2hsaWdodCkge1xuICAgICAgbGluZS5jbGFzc05hbWUgPSAnaGlnaGxpZ2h0JztcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBzY3JvbGwgaXMgbmVhciBib3R0b21cbiAgICBjb25zdCBzaG91bGRBdXRvU2Nyb2xsID1cbiAgICAgIGxvZy5zY3JvbGxUb3AgKyBsb2cub2Zmc2V0SGVpZ2h0ID49IGxvZy5zY3JvbGxIZWlnaHQgLSAxMDtcblxuICAgIGxvZy5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgIGlmIChzaG91bGRBdXRvU2Nyb2xsKSB7XG4gICAgICBsb2cuc2Nyb2xsVG9wID0gbG9nLnNjcm9sbEhlaWdodDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldEN1cnJlbnRHYW1lQ2xhc3NJZCgpOiBQcm9taXNlPG51bWJlciB8IG51bGw+IHtcbiAgICBjb25zdCBpbmZvID0gYXdhaXQgT1dHYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8oKTtcblxuICAgIHJldHVybiAoaW5mbyAmJiBpbmZvLmlzUnVubmluZyAmJiBpbmZvLmNsYXNzSWQpID8gaW5mby5jbGFzc0lkIDogbnVsbDtcbiAgfVxufVxuXG5JbkdhbWUuaW5zdGFuY2UoKS5ydW4oKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=