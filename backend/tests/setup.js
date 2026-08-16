const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Runs the suite against a real MongoDB started in-process.
 *
 * Mocking the model layer would leave the parts most worth testing — schema validation,
 * unique indexes, ownership queries — untested, since those are enforced by the database.
 */
let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  // Unique indexes are only built on demand; without this the constraint tests would pass
  // for the wrong reason.
  await mongoose.connection.syncIndexes();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongo?.stop();
});
