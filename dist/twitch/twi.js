const axios = require('axios');

const getChannelId = async (channelName, CLIENT_ID) => {
    try {
        const apiUrl = `https://api.twitch.tv/helix/users?login=${encodeURIComponent(channelName)}`;
        const headers = {
            'Client-ID': CLIENT_ID,
        };

        const response = await axios.get(apiUrl, { headers });
        const userData = response.data.data[0];

        if (userData) {
            return userData.id;
        } else {
            console.error('Channel not found.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching Twitch channel ID:', error);
        return null;
    }
};

async function getTwitchUserIdFromName(username, clientId) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': clientId,
            },
        });

        if (response.data.data.length > 0) {
            // The Twitch API returns an array of users, but we only need the first one.
            return response.data.data[0].id;
        } else {
            throw new Error('User not found on Twitch');
        }
    } catch (error) {
        throw new Error('Error fetching user information from Twitch API');
    }
}

async function checkChannelStatus(USER_ID, CLIENT_ID) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_id=${USER_ID}`, {
            headers: {
                'Client-ID': CLIENT_ID,
            }
        });
        const streamData = response.data.data[0];
        if (streamData) {
            return "Live";
        } else {
            return "Offline";
        }
    } catch (error) {
        console.error('Error checking channel status:', error.message);
    }
}

// // Periodically check channel status using polling
// setInterval(checkChannelStatus, POLLING_INTERVAL);

// // Initial check
// checkChannelStatus();

console.log(getChannelId("TASK360"))
console.log(getTwitchUserIdFromName("TASK360"))
console.log(checkChannelStatus())

module.exports = { getChannelId, getTwitchUserIdFromName, checkChannelStatus };