const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' directory
app.use(express.static('public'));

// Proxy route for X (Twitter) user tweets
app.get('/api/x/user/:username', async (req, res) => {
  const username = req.params.username;
  try {
    // 1. Get user ID by username
    const userResp = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
    });
    const userData = await userResp.json();
    const userId = userData.data && userData.data.id;
    if (!userId) return res.status(404).json({ error: 'User not found' });

    // 2. Get tweets for user ID
    const tweetsResp = await fetch(`https://api.twitter.com/2/users/${userId}/tweets`, {
      headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
    });
    const tweetsData = await tweetsResp.json();
    res.json(tweetsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add more proxy routes for other APIs as needed

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
