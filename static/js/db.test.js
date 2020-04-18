const { MongoClient } = require("mongodb");
const db = require("./db.js").dbUtils;
const url = "mongodb+srv://alpha-holding:~!@SUTDsutd123@alpha-cluster-0-ruglw.mongodb.net/test?retryWrites=true";
const dbName = "alphaDB";

describe("Test the insert function", () => {
  let connection;
  let myDB;

  beforeAll(async ()=>{
    connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
    });
    myDB = await connection.db(dbName);
  });

  afterAll(async ()=>{
    await connection.close();
    await myDB.close();
  }); 

  it('should insert a doc into db', async () => {
    const mockUser = {_id: "12345678", id: "some_user_id", username: "test@gmail.com", password: "123456", firstName: "Test", lastName: "Object"};
    try{
      await db.insert(mockUser, "Users");
      const user = myDB.collection("Users");
      const insertedUser = await user.findOne({id: "some_user_id"});
      expect(insertedUser).toEqual(mockUser);

    } catch (err){
      console.log("User already exists!");
    }
  });

  it('should search a doc existing in db', async () => {
    const mockUser = {_id: "12345678", id: "some_user_id", username: "test@gmail.com", password: "123456", firstName: "Test", lastName: "Object"};
    const user = myDB.collection("Users");

    try{
      await user.insertOne(mockUser);
      const resultUser = await db.search({id: "some_user_id"}, "Users");
      expect(resultUser).toEqual(mockUser);
    } catch(err) {
      console.log("User already exists!");
    }
  });

  it('should update a doc in the db', async () => {
    try{
      await db.update({id: "some_user_id"}, {username: "fake@gmail.com"}, "Users");
      const user = myDB.collection("Users");
      const resultUser = await user.findOne({id: "some_user_id"});
      expect(resultUser.username).toBe("fake@gmail.com");
    } catch(err){
      console.log("Error: " + err);
    }
  });

  it('should find all docs matching the query in the db', async () => {
    try{
      const users = db.findAll({firstName: "Test"}, "Users");
      const user = myDB.collection("Users");
      const results = user.find({firstName: "Test"}).toArray();
      expect(results).toEqual(users);
    } catch (err) {
      console.log("Error: " + err);
    }
  });

  it('should delete a doc in the db', async () => {
    try{
      await db.delete({id: "some_user_id"}, "Users");
      const user = myDB.collection("Users");
      const resultUser = await user.findOne({id: "some_user_id"});
      expect(resultUser).toBe(null);
    } catch(err){
      console.log("Error: " + err);
    }
  });

});