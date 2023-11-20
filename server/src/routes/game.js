const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authorization');
const { ObjectId } = require('mongodb');

const { getDb } = require('../db/db');
const { buyGameTransaction } = require('../db/transaction');

let db = getDb();

// all available games for user
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const usersColl = db.collection('users');

  const gameColl = db.collection('game');
  try {
    const user = await usersColl.findOne({ username: username });

    const games = await gameColl
      .aggregate([
        {
          $match: {
            $and: [
              { creatorName: { $ne: user.username } },
              { _id: { $nin: [...user.games] } },
            ],
          },
        },
      ])
      .toArray();

    res.status(200).json({ games });
  } catch (e) {
    res.status(500).json({ status: 'failed', message: 'error' });
  }
});

// Game create
router.post('/create', async (req, res) => {
  const { name, title, price } = req.body;
  const gameColl = db.collection('game');
  let numberPrice = Number(price);

  if (!name || !title || !price || !req.user.username)
    return res.status(400).send({ status: 'failed', message: 'error' });

  try {
    const result = await gameColl.insertOne({
      name,
      title,
      price: numberPrice,
      creatorName: req.user.username,
    });
    return res.status(201).json({
      message: 'Game created successfully',
      gameId: result.insertedId,
    });
  } catch (err) {
    console.error('Error creating game:', err);
    res.status(500).json({ message: 'Failed to create game' });
  }
});

// Game purchase
router.post('/buy', async (req, res) => {
  const { gameId } = req.body;

  const gameColl = db.collection('game');
  let game = await gameColl.findOne({ _id: new ObjectId(gameId) });
  if (!game) {
    return res.status(400).json({ status: 'failed', message: 'unknown' });
  }
  const depositColl = db.collection('deposit');
  const aggregationResult = await depositColl
    .aggregate([
      { $match: { username: username } },
      {
        $group: {
          _id: '$user_id', // Group by user ID
          balance: { $sum: '$amount' }, // Calculate the sum of the 'amount' field
        },
      },
    ])
    .toArray();

  if (aggregationResult[0].balance < game.price) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'insufficient_funds' });
  }

  // TODO Variable to gamebuyer
  let result = await buyGameTransaction(gameId, req.user);

  if (result === 'success') {
    return res.status(200).json({
      message: 'success',
      status: 'ok',
      game_id: game._id,
      balance: aggregationResult[0].balance - game.price,
    });
  }

  res.status(500).send({ status: 'failed', message: 'error' });
});

module.exports = router;
