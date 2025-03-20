document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const gameNameInput = document.getElementById("gameName");
    const addGameButton = document.getElementById("addGameButton");
    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.id = "suggestions";
    gameNameInput.parentNode.appendChild(suggestionsContainer);

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

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-button");
        removeButton.addEventListener("click", () => removeGame(game.name));

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(removeButton);
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

    async function fetchGameSuggestions(query) {
        if (!query) {
            suggestionsContainer.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/getGameSuggestions?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            suggestionsContainer.innerHTML = "";
            data.suggestions.forEach(game => {
                const suggestion = document.createElement("div");
                suggestion.classList.add("suggestion");
                suggestion.textContent = game;
                suggestion.addEventListener("click", () => {
                    gameNameInput.value = game;
                    suggestionsContainer.innerHTML = "";
                });
                suggestionsContainer.appendChild(suggestion);
            });
        } catch (error) {
            console.error("Error fetching game suggestions:", error);
        }
    }

    function removeGame(gameName) {
        games = games.filter(game => game.name !== gameName);
        saveGamesToLocalStorage();
        displayGames();
    }

    gameNameInput.addEventListener("input", () => {
        fetchGameSuggestions(gameNameInput.value);
    });

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
        suggestionsContainer.innerHTML = "";
    });

    displayGames();
});
