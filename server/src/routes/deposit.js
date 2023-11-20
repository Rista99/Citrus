const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authorization');
const { ObjectId } = require('mongodb');

const { getDb } = require('../db/db');

let db = getDb();

router.get('/deposits/:username', async (req, res) => {
  const { username } = req.params;

  if (!username)
    return res.status(400).json({ status: 'failed', message: 'error' });

  const depositColl = db.collection('deposit');
  try {
    const deposits = await depositColl.find({ username }).toArray();
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

    res.status(200).json({ deposits, balance: aggregationResult[0].balance });
  } catch (e) {
    res.status(500).json({ status: 'failed', message: 'error' });
  }
});

// Deposit
router.post('/deposit', async (req, res) => {
  const { username, amount } = req.body;

  if (!username || !amount) {
    return res.status(400).json({ status: 'failed', message: 'error' });
  }

  const usersColl = db.collection('users');
  const existingUser = await usersColl.findOne({ username });

  if (!existingUser) {
    return res.status(400).json({ status: 'failed', message: 'error' });
  }

  const parsedAmount = parseInt(amount);

  // Get the current datetime
  const currentDate = new Date();

  try {
    const depositColl = db.collection('deposit');

    const depositDocument = {
      amount: parsedAmount,
      username: username,
      datetime: currentDate,
      refunded: false,
      message: 'Adding fudns',
    };

    let deposit = await depositColl.insertOne(depositDocument);

    const aggregationResult = await depositColl
      .aggregate([
        { $match: { username: username } },
        {
          $group: {
            _id: '$user_id',
            balance: { $sum: '$amount' },
          },
        },
      ])
      .toArray();

    res.status(200).json({
      status: 'ok',
      message: 'success',
      balance: aggregationResult[0].balance,
      deposit_id: deposit.insertedId,
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({
      status: 'failed',
      message: 'error',
    });
  }
});

// Rollback - refund

router.post('/rollback', async (req, res) => {
  const { depositId } = req.body;

  // Check if _id supplied
  if (!depositId) {
    return res.status(400).json({
      status: 'failed',
      message: 'error',
    });
  }

  try {
    const depositColl = db.collection('deposit');

    // Find the deposit by _id
    const deposit = await depositColl.findOne({ _id: new ObjectId(depositId) });

    // does deposit exist
    if (!deposit) {
      return res.status(404).json({ status: 'failed', message: 'unknown' });
    }

    // is it already refunded
    if (deposit.refunded) {
      return res.status(404).json({ status: 'failed', message: 'error?' });
    }

    // Sum all deposits of user - current balance
    const userBalance = await depositColl
      .aggregate([
        { $match: { username: deposit.username } },
        {
          $group: {
            _id: '$user_id',
            balance: { $sum: '$amount' },
          },
        },
      ])
      .toArray();

    if (deposit.amount > userBalance[0].balance) {
      return res.status(400).json({ status: 'failed', message: 'error!' });
    }

    // update refund to true
    await depositColl.updateOne(
      { _id: new ObjectId(deposit._id) },
      {
        $set: {
          refunded: true,
        },
      }
    );

    // Get the current datetime
    const currentDate = new Date();
    // add new deposit
    await depositColl.insertOne({
      amount: deposit.amount * -1,
      username: deposit.username,
      datetime: currentDate,
      refunded: false,
      message: 'Refund',
    });

    const updatedUserBalance = await depositColl
      .aggregate([
        { $match: { username: deposit.username } },
        {
          $group: {
            _id: '$user_id',
            balance: { $sum: '$amount' },
          },
        },
      ])
      .toArray();

    res.status(200).json({
      status: 'ok',
      message: 'success',
      balance: updatedUserBalance[0].balance,
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ status: 'failed', message: 'error' });
  }
});

module.exports = router;
