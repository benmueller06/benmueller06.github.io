const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

// Endpoint to fetch game image from Steam
app.get("/getGameImage", async (req, res) => {
    try {
        const gameName = req.query.name;
        if (!gameName) return res.status(400).json({ error: "Game name is required" });

        // Fetch the full list of Steam games
        const steamResponse = await axios.get("https://api.steampowered.com/ISteamApps/GetAppList/v2/");
        const gameList = steamResponse.data.applist.apps;

        // Find the game ID
        const game = gameList.find(g => g.name.toLowerCase() === gameName.toLowerCase());

        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        const imageUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;
        res.json({ name: game.name, image: imageUrl });
    } catch (error) {
        console.error("Error fetching game data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
