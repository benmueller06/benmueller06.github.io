async function fetchGameDetails(gameName) {
    const serverUrl = "http://localhost:3000/search/" + encodeURIComponent(gameName);

    try {
        const response = await fetch(serverUrl);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            displayGame(data);
            saveGame(data);
        }
    } catch (error) {
        console.error("Error fetching game details:", error);
    }
}
