// Biometric Vars
var sufficientSleep;
var sufficientWater;

function biometricsSubmitted()
{
  this.sufficientWater = document.getElementById("water").checked;
  this.sufficientSleep = document.getElementById("sleep").checked;

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
}

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