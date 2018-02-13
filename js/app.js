/**************************************************
Player Stats Card
Author: Ash Robbins
Date: 12/02/2018
**************************************************/

let selectedPlayer = {};
let playerList = [];
const selector = document.querySelectorAll(".js-playerSelector");
const imageContainer = document.querySelectorAll(".js-playerCard__image")[0];
const detailsContainer = document.querySelectorAll(".js-playerCard__details")[0];

const loadJSON = callback => {
    // Get JSON data from local data file

    const xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/data/player-stats.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

const loadPlayerData = () => {
    // Call function to retrieve data and assign response to variable 'playerList'

    loadJSON(function(response) {
        playerList = JSON.parse(response);
        populateSelector();
     });
}

const populateSelector = () => {
    // Create a select element with an option for each player in 'playerList'

    for (let i = 0; i < playerList.players.length; i++) {
        let player = playerList.players[i].player;
        let option = document.createElement("option");
        option.value = player.id;
        option.innerHTML = `${player.name.first} ${player.name.last}`;

        selector[0].appendChild(option);
    }

    // Run selectPlayer() when the select is changed
    selector[0].addEventListener("change", selectPlayer);
}

const selectPlayer = () => {
    //Find the selected player in playerList and run buildCard against that player object

    const id = selector[0].value;

    for (let i = 0; i < playerList.players.length; i++) {
        let player = playerList.players[i];

        if (id == player.player.id) {
            buildCard(player);
        }
        if (id == "") {
            selectedPlayer = {};
            clearCard();
            hideCard();
        }
    }
}

const clearCard = () => {
    // Empty the card if no player is selected

    imageContainer.innerHTML = "";
    detailsContainer.innerHTML = "";
}

const showCard = () => {
    // Show the card when a player is selected

    if (imageContainer.classList) {
        imageContainer.classList.remove("u-hidden");
    }

    if (detailsContainer.classList) {
        detailsContainer.classList.remove("u-hidden");
    }
}

const hideCard = () => {
    // Hide the card when no player is selected

    if (imageContainer.classList) {
        imageContainer.classList.add("u-hidden");
    }

    if (detailsContainer.classList) {
        detailsContainer.classList.add("u-hidden");
    }
}

const buildCard = player => {
    // Assign the given 'player' object to the global 'selectedPlayer' variable and run relevant functions

    selectedPlayer = player;
    playerPhoto();
    playerDetails();
    showCard();
}

const playerPhoto = () => {
    // Build a cardImage template and assign to innerHTML of imageContainer

    const cardImage = `<img src="assets/p${selectedPlayer.player.id}.png" alt="${selectedPlayer.player.name.first} ${selectedPlayer.player.name.last}" />`;
    imageContainer.innerHTML = cardImage;
}

const getPosition = position => {
    // Return a descriptive string according to the provided 'position' value

    if (position == "D") {
        return "Defender";
    } else if (position == "M") {
        return "Midfielder";
    } else if (position == "F") {
        return "Forward";
    }
}

const getStat = stat => {
    // Return the value of the requested stat

    let val = 0;

    for (let i = 0; i < selectedPlayer.stats.length; i++) {
        if (stat == selectedPlayer.stats[i].name) {
            val = selectedPlayer.stats[i].value;
        }
    }

    return (val !== 0 ? val : 0);
}

const getGoalsPerMatch = () => {
    // Calculate goals per match for 'selectedPlayer'

    let goals = 0,
        appearances = 0,
        gpm = 0;

    for (let i = 0; i < selectedPlayer.stats.length; i++) {
        if (selectedPlayer.stats[i].name == "goals") {
            goals = selectedPlayer.stats[i].value;
        }
        if (selectedPlayer.stats[i].name == "appearances") {
            appearances = selectedPlayer.stats[i].value;
        }
    }

    gpm = goals / appearances;
    return Math.round(gpm * 100) / 100
}

const getPassesPerMin = () => {
    // Calculate passes per minute for 'selectedPlayer'

    let passes = 0,
        fwd = 0,
        bwd = 0,
        mins = 0,
        ppm = 0;

    for (let i = 0; i < selectedPlayer.stats.length; i++) {
        if (selectedPlayer.stats[i].name == "fwd_pass") {
            fwd = selectedPlayer.stats[i].value;
        }
        else if (selectedPlayer.stats[i].name == "backward_pass") {
            bwd = selectedPlayer.stats[i].value;
        }
        else if (selectedPlayer.stats[i].name == "mins_played") {
            mins = selectedPlayer.stats[i].value;
        }
    }

    passes = fwd + bwd;
    ppm = passes / mins;

    return Math.round(ppm * 100) / 100
}

const playerDetails = () => {
    // Build a cardDetails template and assign to innerHTML of detailsContainer

    const cardDetails = `
        <h3 class="c-heading--name">${selectedPlayer.player.name.first} ${selectedPlayer.player.name.last}</h3>
        <h4 class="c-heading--position">${getPosition(selectedPlayer.player.info.position)}</h4>
        <span class="c-playerCard__badge">
            <span class="c-playerCard__badgeImage c-playerCard__badgeImage--${selectedPlayer.player.currentTeam.id}"></span>
        </span>

        <ol class="c-playerCard__stats u-no-list">
            <li>
                <span class="c-statLabel">Appearances</span>
                <span class="c-statDetail">${getStat("appearances")}</span>
            </li>
            <li>
                <span class="c-statLabel">Goals</span>
                <span class="c-statDetail">${getStat("goals")}</span>
            </li>
            <li>
                <span class="c-statLabel">Assists</span>
                <span class="c-statDetail">${getStat("goal_assist")}</span>
            </li>
            <li>
                <span class="c-statLabel">Goals per match</span>
                <span class="c-statDetail">${getGoalsPerMatch()}</span>
            </li>
            <li>
                <span class="c-statLabel">Passes per minute</span>
                <span class="c-statDetail">${getPassesPerMin()}</span>
            </li>
        </ol>
    `;

    detailsContainer.innerHTML = cardDetails;
}

// Initialise app
loadPlayerData();
