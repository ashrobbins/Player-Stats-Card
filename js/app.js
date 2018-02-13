let playerData = {};
let playerList = [];
const selector = document.querySelectorAll(".js-playerSelector");
const imageContainer = document.querySelectorAll(".js-playerCard__image")[0];
const detailsContainer = document.querySelectorAll(".js-playerCard__details")[0];

const loadJSON = callback => {
    const xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/data/player-stats.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

const loadPlayerData = () => {
    loadJSON(function(response) {
        playerList = JSON.parse(response);

        populateSelector();
     });
}

const populateSelector = () => {
    for (let i = 0; i < playerList.players.length; i++) {
        let player = playerList.players[i].player;
        let option = document.createElement("option");
        option.value = player.id;
        option.innerHTML = `${player.name.first} ${player.name.last}`;

        selector[0].appendChild(option);
    }

    selector[0].addEventListener("change", selectPlayer);
}

const selectPlayer = (e) => {
    const id = selector[0].value;

    for (let i = 0; i < playerList.players.length; i++) {
        let player = playerList.players[i];

        if (id == player.player.id) {
            buildCard(player);
        }
        if (id == "") {
            playerData = {};
            clearCard();
            hideCard();
        }
    }
}

const clearCard = () => {
    imageContainer.innerHTML = "";
    detailsContainer.innerHTML = "";
}

const showCard = () => {
    if (imageContainer.classList) {
        imageContainer.classList.remove("u-hidden");
    }

    if (detailsContainer.classList) {
        detailsContainer.classList.remove("u-hidden");
    }
}

const hideCard = () => {
    if (imageContainer.classList) {
        imageContainer.classList.add("u-hidden");
    }

    if (detailsContainer.classList) {
        detailsContainer.classList.add("u-hidden");
    }
}

const buildCard = selectedPlayer => {
    playerData = selectedPlayer;
    playerPhoto();
    playerDetails();
    showCard();
}

const playerPhoto = selectedPlayer => {
    const cardImage = `<img src="assets/p${playerData.player.id}.png" alt="${playerData.player.name.first} ${playerData.player.name.last}" />`;

    imageContainer.innerHTML = cardImage;
}

const getPosition = position => {
    if (position == "D") {
        return "Defender";
    } else if (position == "M") {
        return "Midfielder";
    } else if (position == "F") {
        return "Forward";
    }
}

const getStat = stat => {
    let val = 0;

    for (let i = 0; i < playerData.stats.length; i++) {
        if (stat == playerData.stats[i].name) {
            val = playerData.stats[i].value;
        }
    }

    return (val !== 0 ? val : 0);
}

const getGoalsPerMatch = () => {
    let goals = 0,
        appearances = 0,
        gpm = 0;

    for (let i = 0; i < playerData.stats.length; i++) {
        if (playerData.stats[i].name == "goals") {
            goals = playerData.stats[i].value;
        }
        if (playerData.stats[i].name == "appearances") {
            appearances = playerData.stats[i].value;
        }
    }

    gpm = goals / appearances;
    return Math.round(gpm * 100) / 100
}

const getPassesPerMin = () => {
    let passes = 0,
        fwd = 0,
        bwd = 0,
        mins = 0,
        ppm = 0;

    for (let i = 0; i < playerData.stats.length; i++) {
        if (playerData.stats[i].name == "fwd_pass") {
            fwd = playerData.stats[i].value;
        }
        else if (playerData.stats[i].name == "backward_pass") {
            bwd = playerData.stats[i].value;
        }
        else if (playerData.stats[i].name == "mins_played") {
            mins = playerData.stats[i].value;
        }
    }

    passes = fwd + bwd;
    ppm = passes / mins;

    return Math.round(ppm * 100) / 100
}

const playerDetails = selectedPlayer => {
    const cardDetails = `
        <h3 class="c-heading--name">${playerData.player.name.first} ${playerData.player.name.last}</h3>
        <h4 class="c-heading--position">${getPosition(playerData.player.info.position)}</h4>
        <span class="c-playerCard__badge">
            <span class="c-playerCard__badgeImage c-playerCard__badgeImage--${playerData.player.currentTeam.id}"></span>
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

loadPlayerData();
