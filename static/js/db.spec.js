const { MongoClient } = require("mongodb");
const db = require("./db.js").dbUtils;

describe("insert", () => {
  let connection;
  // let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      "mongodb://localhost:27017/alphadb",
      {
        useNewUrlParser: true
      }
    );
    db = await connection.db("alphadb");
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });
});
