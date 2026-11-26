const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Mounted directly on the app so monitoring probes bypass rate limiters.
router.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

router.get(['/ready', '/api/ready'], async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: 'unavailable' });
  }
  try {
    await mongoose.connection.db.admin().ping();
    return res.status(200).json({ status: 'ready' });
  } catch {
    return res.status(503).json({ status: 'unavailable' });
  }
});

module.exports = router;
