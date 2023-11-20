const { ObjectId } = require('mongodb');

const { MongoClient } = require('mongodb');

async function buyGameTransaction(gameId, buyerUsername) {
  let result;
  const client = new MongoClient(process.env.DATABASE_URL);
  const session = client.startSession();
  try {
    session.startTransaction();
    const db = client.db();
    const game = await db
      .collection('game')
      .findOne({ _id: new ObjectId(gameId) });
    const depositColl = db.collection('deposit');
    const buyer = await db
      .collection('users')
      .findOne({ username: buyerUsername });
    const currentDate = new Date();
    await depositColl.insertOne(
      {
        amount: game.price * -1,
        username: buyerUsername,
        datetime: currentDate,
        refunded: false,
        message: 'Game bought',
      },
      { session }
    );
    await depositColl.insertOne(
      {
        amount: game.price,
        username: game.creatorName,
        datetime: currentDate,
        refunded: false,
        message: 'Game sold',
      },
      { session }
    );

    await db
      .collection('users')
      .findOneAndUpdate(
        { username: buyerUsername },
        { $set: { games: [...buyer.games, gameId] } },
        { session }
      );

    await session.commitTransaction();
    result = 'success';
    console.log('Transaction committed.');
  } catch (error) {
    console.log('An error occurred during the transaction:' + error);
    result = 'failed';
    await session.abortTransaction();
  } finally {
    await session.endSession();
    return results;
  }
}

module.exports = { buyGameTransaction };
