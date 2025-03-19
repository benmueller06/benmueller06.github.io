document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");

    // Sample game data (this can be fetched from an API later)
    const games = [
        { name: "Cyberpunk 2077", image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg" },
        { name: "Elden Ring", image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg" },
        { name: "Hogwarts Legacy", image: "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg" }
    ];

    // Function to create a game card
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

    // Add games to the page
    games.forEach(createGameCard);
});
