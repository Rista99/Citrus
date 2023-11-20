const express = require('express');
const { authenticateToken } = require('./middleware/authorization');
const cors = require('cors');

const startApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: '*' }));

  const userRouter = require('./routes/user');
  app.use('/users', userRouter);

  app.use(authenticateToken);

  const depositRouter = require('./routes/deposit');
  app.use('/', depositRouter);

  const gameRouter = require('./routes/game');
  app.use('/game', gameRouter);

  return app;
};

module.exports = { startApp };
