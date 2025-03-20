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

    async function fetchGameImage(gameName) {
        try {
            const response = await fetch(`http://localhost:4000/getGameImage?name=${encodeURIComponent(gameName)}`);
            const data = await response.json();

            if (data.error) {
                alert(data.error);
                return null;
            }

            return data.image;
        } catch (error) {
            console.error("Error fetching game image:", error);
            alert("Failed to fetch game data.");
            return null;
        }
    }

    addGameButton.addEventListener("click", async function () {
        const gameName = gameNameInput.value.trim();
        if (!gameName) return;

        const gameImage = await fetchGameImage(gameName);
        if (!gameImage) return;

        const newGame = { name: gameName, image: gameImage };
        games.push(newGame);
        saveGamesToLocalStorage();
        createGameCard(newGame);

        gameNameInput.value = "";
    });

    displayGames();
});
