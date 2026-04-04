const mongoose = require('mongoose');

/**
 * Connect to the in-memory test database.
 * For real integration tests, use mongodb-memory-server.
 * This helper assumes MONGO_URI is set to a test DB in .env.test
 */
const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/api_test');
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = { connect, closeDatabase, clearDatabase };
