document.addEventListener("DOMContentLoaded", loadGames);

function addGame() {
    let gameName = document.getElementById("gameInput").value.trim();
    if (gameName === "") return;

    fetchGameDetails(gameName);
}

function fetchGameDetails(gameName) {
    const steamAPIKey = "8EC8E0A54EB4C1D1F2CEBE1F27F9B8B6";  // Replace with your Steam API key
    const searchUrl = `https://api.steampowered.com/ISteamApps/GetAppList/v2/`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            const appList = data.applist.apps;
            const game = appList.find(app => app.name.toLowerCase() === gameName.toLowerCase());

            if (game) {
                const gameData = { id: game.appid, name: game.name };
                saveGame(gameData);
                displayGame(gameData);
            } else {
                alert("Game not found on Steam.");
            }
        })
        .catch(error => console.error("Error fetching Steam data:", error));
}

function saveGame(gameData) {
    let games = JSON.parse(localStorage.getItem("games")) || [];
    games.push(gameData);
    localStorage.setItem("games", JSON.stringify(games));
}

function loadGames() {
    let games = JSON.parse(localStorage.getItem("games")) || [];
    games.forEach(displayGame);
}

function displayGame(gameData) {
    let li = document.createElement("li");
    li.innerHTML = `${gameData.name} <button class='delete-btn' onclick='removeGame(${gameData.id}, this)'>X</button>`;
    document.getElementById("gameList").appendChild(li);
}

function removeGame(gameId, button) {
    let games = JSON.parse(localStorage.getItem("games")) || [];
    games = games.filter(game => game.id !== gameId);
    localStorage.setItem("games", JSON.stringify(games));

    button.parentElement.remove();
}
