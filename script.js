document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const gameNameInput = document.getElementById("gameName");
    const gameImageInput = document.getElementById("gameImage");
    const addGameButton = document.getElementById("addGameButton");

    // Load stored games from localStorage
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

    // Display stored games on page load
    function displayGames() {
        gameContainer.innerHTML = ""; // Clear existing games
        games.forEach(createGameCard);
    }

    // Add game to the list
    addGameButton.addEventListener("click", function () {
        const gameName = gameNameInput.value.trim();
        const gameImage = gameImageInput.value.trim();

        if (gameName && gameImage) {
            const newGame = { name: gameName, image: gameImage };
            games.push(newGame);
            saveGamesToLocalStorage();
            createGameCard(newGame);

            // Clear input fields
            gameNameInput.value = "";
            gameImageInput.value = "";
        }
    });

    // Initial display
    displayGames();
});
