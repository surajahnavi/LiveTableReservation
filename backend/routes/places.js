const express = require('express');
const fetch = require('node-fetch');

// This route proxies Google Places Nearby Search to avoid exposing API key.
// Requires GOOGLE_PLACES_API_KEY in environment.

const router = express.Router();

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = '2000', keywords = '' } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ msg: 'lat and lng are required' });
    }
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ msg: 'Missing GOOGLE_PLACES_API_KEY server configuration' });
    }

    // Build keyword filtering by issuing multiple requests if multiple keywords provided
    const keywordArray = keywords ? keywords.split(',').map(k => k.trim()).filter(Boolean) : [];

    const aggregateResults = [];
    const fetchOne = async (keyword) => {
      const keywordParam = keyword ? `&keyword=${encodeURIComponent(keyword)}` : '';
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant${keywordParam}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Upstream error ${resp.status}`);
      }
      return resp.json();
    };

    if (keywordArray.length === 0) {
      const data = await fetchOne('');
      if (data.status !== 'OK') {
        return res.status(502).json({ msg: 'Upstream Places error', status: data.status });
      }
      aggregateResults.push(...data.results);
    } else {
      for (const kw of keywordArray) {
        const data = await fetchOne(kw);
        if (data.status === 'OK') {
          aggregateResults.push(...data.results);
        }
      }
    }

    // Deduplicate by place_id
    const unique = Object.values(aggregateResults.reduce((acc, cur) => {
      acc[cur.place_id] = cur;
      return acc;
    }, {}));

    res.json({ results: unique });
  } catch (err) {
    console.error('Places proxy error', err);
    res.status(500).json({ msg: 'Server error fetching places' });
  }
});

module.exports = router;
