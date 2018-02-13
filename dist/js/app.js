"use strict";

var playerData = {};
var playerList = [];
var selector = document.querySelectorAll(".js-playerSelector");
var imageContainer = document.querySelectorAll(".js-playerCard__image")[0];
var detailsContainer = document.querySelectorAll(".js-playerCard__details")[0];

var loadJSON = function loadJSON(callback) {
    var xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/data/player-stats.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

var loadPlayerData = function loadPlayerData() {
    loadJSON(function (response) {
        playerList = JSON.parse(response);

        populateSelector();
    });
};

var populateSelector = function populateSelector() {
    for (var i = 0; i < playerList.players.length; i++) {
        var player = playerList.players[i].player;
        var option = document.createElement("option");
        option.value = player.id;
        option.innerHTML = player.name.first + " " + player.name.last;

        selector[0].appendChild(option);
    }

    selector[0].addEventListener("change", selectPlayer);
};

var selectPlayer = function selectPlayer(e) {
    var id = selector[0].value;

    for (var i = 0; i < playerList.players.length; i++) {
        var player = playerList.players[i];

        if (id == player.player.id) {
            buildCard(player);
        }
        if (id == "") {
            playerData = {};
            clearCard();
            hideCard();
        }
    }
};

var clearCard = function clearCard() {
    imageContainer.innerHTML = "";
    detailsContainer.innerHTML = "";
};

var showCard = function showCard() {
    if (imageContainer.classList) {
        imageContainer.classList.remove("u-hidden");
    }

    if (detailsContainer.classList) {
        detailsContainer.classList.remove("u-hidden");
    }
};

var hideCard = function hideCard() {
    if (imageContainer.classList) {
        imageContainer.classList.add("u-hidden");
    }

    if (detailsContainer.classList) {
        detailsContainer.classList.add("u-hidden");
    }
};

var buildCard = function buildCard(selectedPlayer) {
    playerData = selectedPlayer;
    playerPhoto();
    playerDetails();
    showCard();
};

var playerPhoto = function playerPhoto(selectedPlayer) {
    var cardImage = "<img src=\"assets/p" + playerData.player.id + ".png\" alt=\"" + playerData.player.name.first + " " + playerData.player.name.last + "\" />";

    imageContainer.innerHTML = cardImage;
};

var getPosition = function getPosition(position) {
    if (position == "D") {
        return "Defender";
    } else if (position == "M") {
        return "Midfielder";
    } else if (position == "F") {
        return "Forward";
    }
};

var getStat = function getStat(stat) {
    var val = 0;

    for (var i = 0; i < playerData.stats.length; i++) {
        if (stat == playerData.stats[i].name) {
            val = playerData.stats[i].value;
        }
    }

    return val !== 0 ? val : 0;
};

var getGoalsPerMatch = function getGoalsPerMatch() {
    var goals = 0,
        appearances = 0,
        gpm = 0;

    for (var i = 0; i < playerData.stats.length; i++) {
        if (playerData.stats[i].name == "goals") {
            goals = playerData.stats[i].value;
        }
        if (playerData.stats[i].name == "appearances") {
            appearances = playerData.stats[i].value;
        }
    }

    gpm = goals / appearances;
    return Math.round(gpm * 100) / 100;
};

var getPassesPerMin = function getPassesPerMin() {
    var passes = 0,
        fwd = 0,
        bwd = 0,
        mins = 0,
        ppm = 0;

    for (var i = 0; i < playerData.stats.length; i++) {
        if (playerData.stats[i].name == "fwd_pass") {
            fwd = playerData.stats[i].value;
        } else if (playerData.stats[i].name == "backward_pass") {
            bwd = playerData.stats[i].value;
        } else if (playerData.stats[i].name == "mins_played") {
            mins = playerData.stats[i].value;
        }
    }

    passes = fwd + bwd;
    ppm = passes / mins;

    return Math.round(ppm * 100) / 100;
};

var playerDetails = function playerDetails(selectedPlayer) {
    var cardDetails = "\n        <h3 class=\"c-heading--name\">" + playerData.player.name.first + " " + playerData.player.name.last + "</h3>\n        <h4 class=\"c-heading--position\">" + getPosition(playerData.player.info.position) + "</h4>\n        <span class=\"c-playerCard__badge\">\n            <span class=\"c-playerCard__badgeImage c-playerCard__badgeImage--" + playerData.player.currentTeam.id + "\"></span>\n        </span>\n\n        <ol class=\"c-playerCard__stats u-no-list\">\n            <li>\n                <span class=\"c-statLabel\">Appearances</span>\n                <span class=\"c-statDetail\">" + getStat("appearances") + "</span>\n            </li>\n            <li>\n                <span class=\"c-statLabel\">Goals</span>\n                <span class=\"c-statDetail\">" + getStat("goals") + "</span>\n            </li>\n            <li>\n                <span class=\"c-statLabel\">Assists</span>\n                <span class=\"c-statDetail\">" + getStat("goal_assist") + "</span>\n            </li>\n            <li>\n                <span class=\"c-statLabel\">Goals per match</span>\n                <span class=\"c-statDetail\">" + getGoalsPerMatch() + "</span>\n            </li>\n            <li>\n                <span class=\"c-statLabel\">Passes per minute</span>\n                <span class=\"c-statDetail\">" + getPassesPerMin() + "</span>\n            </li>\n        </ol>\n    ";

    detailsContainer.innerHTML = cardDetails;
};

loadPlayerData();