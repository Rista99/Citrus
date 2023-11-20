require('dotenv').config();
const { connect, connectToDb } = require('./db/db');
const { startApp } = require('./app');
const { hashPassword } = require('./utils/hash');

const port = process.env.port || 4000;

connectToDb((err) => {
  if (!err) {
    const app = startApp();

    app.listen(port, () => {
      console.log('Running on port: ', port);
      console.log('------------------------');
    });
  }
});
