const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/db');
const { hashPassword } = require('../utils/hash');
const bcrypt = require('bcrypt');

let db = getDb();
let specialRegex = /^[0-9a-f]{1,32}$/;

// registration
router.post('/registration', async (req, res) => {
  const { username, password } = req.body;
  if (!specialRegex.test(username) && !specialRegex.test(password)) {
    return res.status(400).send({ status: 'failed', message: 'error' });
  }

  const usersCollection = db.collection('users');

  try {
    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ status: 'failed', message: 'duplicate' });
    }
    let hashed = await hashPassword(password);

    await usersCollection.insertOne({ username, password: hashed, games: [] });
    res.status(201).json({ status: 'ok', message: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: 'error' });
  }
});

// token
router.post('/token', async (req, res) => {
  const { username, password } = req.body;

  if (!specialRegex.test(username) && !specialRegex.test(password)) {
    return res.status(400).send({ status: 'failed', message: 'error' });
  }

  try {
    const user = await db.collection('users').findOne({ username: username });

    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'error' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ status: 'failed', message: 'error' });
    }

    let depositCollection = db.collection('deposit');
    const aggregationResult = await depositCollection
      .aggregate([
        { $match: { username: user.username } },
        {
          $group: {
            _id: '$user_id', // Group by user ID
            balance: { $sum: '$amount' }, // Calculate the sum of the 'amount' field
          },
        },
      ])
      .toArray();

    const token = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      token: token,
      games: user.games,
      balance: aggregationResult[0]?.balance || 0,
      status: 'ok',
      message: 'success',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: 'error' });
  }
});

module.exports = router;
