//import fetch from 'node-fetch';
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Steam API Backend is Running!");
});


const STEAM_API_KEY = process.env.STEAM_API_KEY;

// 🔍 Search for a game by name
app.get("/search/:gameName", async (req, res) => {
    const gameName = req.params.gameName.toLowerCase();
    const appListUrl = `https://api.steampowered.com/ISteamApps/GetAppList/v2/`;

    try {
        const response = await fetch(appListUrl);
        const data = await response.json();
        const game = data.applist.apps.find(app => app.name.toLowerCase() === gameName);

        if (game) {
            const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${game.appid}`;
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();

            if (detailsData[game.appid].success) {
                res.json(detailsData[game.appid].data);
            } else {
                res.status(404).json({ error: "Game details not found" });
            }
        } else {
            res.status(404).json({ error: "Game not found on Steam" });
        }
    } catch (error) {
        console.error("Error fetching Steam data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
