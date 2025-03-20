const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 4000;
const STEAM_API_URL = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";
const LOCAL_DATA_FILE = "steam_games.json";

app.use(cors());

// Fetch and save Steam API data locally
async function fetchAndSaveSteamData() {
    try {
        const response = await axios.get(STEAM_API_URL);
        const gameList = response.data.applist.apps;
        fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(gameList));
        console.log("Steam data saved locally.");
    } catch (error) {
        console.error("Error fetching Steam data:", error);
    }
}

// Endpoint to fetch game image from local data
app.get("/getGameImage", (req, res) => {
    try {
        const gameName = req.query.name;
        if (!gameName) return res.status(400).json({ error: "Game name is required" });

        const gameList = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE));
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

// Endpoint to get game suggestions from local data
app.get("/getGameSuggestions", (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const gameList = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE));
        const suggestions = gameList
            .filter(game => game.name.toLowerCase().includes(query.toLowerCase()))
            .map(game => ({
                name: game.name,
                image: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`
            }));

        res.json({ suggestions });
    } catch (error) {
        console.error("Error fetching game suggestions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch and save Steam data on server start
fetchAndSaveSteamData();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});