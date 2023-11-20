const MongoClient = require('mongodb').MongoClient;

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(process.env.DATABASE_URL)
      .then((client) => {
        dbConnection = client.db();
        console.log('Connected to Database');
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
