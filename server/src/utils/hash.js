const bcrypt = require('bcrypt');
const saltRounds = 10; // Cost factor for hashing, higher values increase security but also consume more resources

const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Number of salt rounds for hashing

    // Generate a salt and hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    return hash;
  } catch (error) {
    throw new Error('Hashing failed', error);
  }
};

module.exports = { hashPassword };
