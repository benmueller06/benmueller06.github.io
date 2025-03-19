document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const gameNameInput = document.getElementById("gameName");
    const addGameButton = document.getElementById("addGameButton");

    let games = JSON.parse(localStorage.getItem("games")) || [];

    function saveGamesToLocalStorage() {
        localStorage.setItem("games", JSON.stringify(games));
    }

    function createGameCard(game) {
        const card = document.createElement("div");
        card.classList.add("game-card");

        const img = document.createElement("img");
        img.src = game.image;
        img.alt = game.name;

        const title = document.createElement("div");
        title.classList.add("game-title");
        title.textContent = game.name;

        card.appendChild(img);
        card.appendChild(title);
        gameContainer.appendChild(card);
    }

    function displayGames() {
        gameContainer.innerHTML = "";
        games.forEach(createGameCard);
    }

    async function fetchSteamGameImage(gameName) {
        try {
            const response = await fetch(`https://api.steampowered.com/ISteamApps/GetAppList/v2/`);
            const data = await response.json();
            
            const appList = data.applist.apps;
            const game = appList.find(app => app.name.toLowerCase() === gameName.toLowerCase());

            if (!game) {
                alert("Game not found on Steam.");
                return null;
            }

            const appID = game.appid;
            return `https://cdn.akamai.steamstatic.com/steam/apps/${appID}/header.jpg`;
        } catch (error) {
            console.error("Error fetching game data:", error);
            return null;
        }
    }

    addGameButton.addEventListener("click", async function () {
        const gameName = gameNameInput.value.trim();
        if (!gameName) return;

        const gameImage = await fetchSteamGameImage(gameName);
        if (!gameImage) return;

        const newGame = { name: gameName, image: gameImage };
        games.push(newGame);
        saveGamesToLocalStorage();
        createGameCard(newGame);

        gameNameInput.value = "";
    });

    displayGames();
});
