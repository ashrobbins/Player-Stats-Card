"use strict";

/**************************************************
Player Stats Card
Author: Ash Robbins
Date: 12/02/2018
**************************************************/

var selectedPlayer = {};
var playerList = [];
var selector = document.querySelectorAll(".js-playerSelector");
var imageContainer = document.querySelectorAll(".js-playerCard__image")[0];
var detailsContainer = document.querySelectorAll(".js-playerCard__details")[0];

var loadJSON = function loadJSON(callback) {
    // Get JSON data from local data file

    var xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/data/player-stats.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

var loadPlayerData = function loadPlayerData() {
    // Call function to retrieve data and assign response to variable 'playerList'

    loadJSON(function (response) {
        playerList = JSON.parse(response);
        populateSelector();
    });
};

var populateSelector = function populateSelector() {
    // Create a select element with an option for each player in 'playerList'

    for (var i = 0; i < playerList.players.length; i++) {
        var player = playerList.players[i].player;
        var option = document.createElement("option");
        option.value = player.id;
        option.innerHTML = player.name.first + " " + player.name.last;

        selector[0].appendChild(option);
    }

    // Run selectPlayer() when the select is changed
    selector[0].addEventListener("change", selectPlayer);
};

var selectPlayer = function selectPlayer() {
    //Find the selected player in playerList and run buildCard against that player object

    var id = selector[0].value;

    for (var i = 0; i < playerList.players.length; i++) {
        var player = playerList.players[i];

        if (id == player.player.id) {
            buildCard(player);
        }
        if (id == "") {
            selectedPlayer = {};
            clearCard();
            hideCard();
        }
    }
};

var clearCard = function clearCard() {
    // Empty the card if no player is selected

    imageContainer.innerHTML = "";
    detailsContainer.innerHTML = "";
};

var showCard = function showCard() {
    // Show the card when a player is selected

    if (imageContainer.classList) {
        imageContainer.classList.remove("u-hidden");
    }

    if (detailsContainer.classList) {
        detailsContainer.classList.remove("u-hidden");
    }
};

var hideCard = function hideCard() {
    // Hide the card when no player is selected

    if (imageContainer.classList) {
        imageContainer.classList.add("u-hidden");
    }

    if (detailsContainer.classList) {
        detailsContainer.classList.add("u-hidden");
    }
};

var buildCard = function buildCard(player) {
    // Assign the given 'player' object to the global 'selectedPlayer' variable and run relevant functions

    selectedPlayer = player;
    playerPhoto();
    playerDetails();
    showCard();
};

var playerPhoto = function playerPhoto() {
    // Build a cardImage template and assign to innerHTML of imageContainer

    var cardImage = "<img src=\"assets/p" + selectedPlayer.player.id + ".png\" alt=\"" + selectedPlayer.player.name.first + " " + selectedPlayer.player.name.last + "\" />";
    imageContainer.innerHTML = cardImage;
};

var getPosition = function getPosition(position) {
    // Return a descriptive string according to the provided 'position' value

    if (position == "D") {
        return "Defender";
    } else if (position == "M") {
        return "Midfielder";
    } else if (position == "F") {
        return "Forward";
    }
};

var getStat = function getStat(stat) {
    // Return the value of the requested stat

    var val = 0;

    for (var i = 0; i < selectedPlayer.stats.length; i++) {
        if (stat == selectedPlayer.stats[i].name) {
            val = selectedPlayer.stats[i].value;
        }
    }

    return val !== 0 ? val : 0;
};

var getGoalsPerMatch = function getGoalsPerMatch() {
    // Calculate goals per match for 'selectedPlayer'

    var goals = 0,
        appearances = 0,
        gpm = 0;

    for (var i = 0; i < selectedPlayer.stats.length; i++) {
        if (selectedPlayer.stats[i].name == "goals") {
            goals = selectedPlayer.stats[i].value;
        }
        if (selectedPlayer.stats[i].name == "appearances") {
            appearances = selectedPlayer.stats[i].value;
        }
    }

    gpm = goals / appearances;
    return Math.round(gpm * 100) / 100;
};

var getPassesPerMin = function getPassesPerMin() {
    // Calculate passes per minute for 'selectedPlayer'

    var passes = 0,
        fwd = 0,
        bwd = 0,
        mins = 0,
        ppm = 0;

    for (var i = 0; i < selectedPlayer.stats.length; i++) {
        if (selectedPlayer.stats[i].name == "fwd_pass") {
            fwd = selectedPlayer.stats[i].value;
        } else if (selectedPlayer.stats[i].name == "backward_pass") {
            bwd = selectedPlayer.stats[i].value;
        } else if (selectedPlayer.stats[i].name == "mins_played") {
            mins = selectedPlayer.stats[i].value;
        }
    }

    passes = fwd + bwd;
    ppm = passes / mins;

    return Math.round(ppm * 100) / 100;
};

var playerDetails = function playerDetails() {
    // Build a cardDetails template and assign to innerHTML of detailsContainer

    var cardDetails = "\n        <h3 class=\"c-heading--name\">" + selectedPlayer.player.name.first + " " + selectedPlayer.player.name.last + "</h3>\n        <h4 class=\"c-heading--position\">" + getPosition(selectedPlayer.player.info.position) + "</h4>\n        <span class=\"c-playerCard__badge\">\n            <span class=\"c-playerCard__badgeImage c-playerCard__badgeImage--" + selectedPlayer.player.currentTeam.id + "\"></span>\n        </span>\n\n        <ol class=\"c-playerCard__stats u-no-list\">\n            <li>\n                <span class=\"c-statLabel\">Appearances</span>\n                <span class=\"c-statDetail\">" + getStat("appearances") + "</span>\n            </li>\n            <li>\n                <span class=\"c-statLabel\">Goals</span>\n                <span class=\"c-statDetail\">" + getStat("goals") + "</span>\n            </li>\n            <li>\n                <span class=\"c-statLabel\">Assists</span>\n                <span class=\"c-statDetail\">" + getStat("goal_assist") + "</span>\n            </li>\n            <li>\n                <span class=\"c-statLabel\">Goals per match</span>\n                <span class=\"c-statDetail\">" + getGoalsPerMatch() + "</span>\n            </li>\n            <li>\n                <span class=\"c-statLabel\">Passes per minute</span>\n                <span class=\"c-statDetail\">" + getPassesPerMin() + "</span>\n            </li>\n        </ol>\n    ";

    detailsContainer.innerHTML = cardDetails;
};

// Initialise app
loadPlayerData();