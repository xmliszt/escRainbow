


const mockUser = {_id: "12345678", id: "some_user_id", username: "test@gmail.com", password: "123456", firstName: "Test", lastName: "Object"};

MongoClient.connect(uri, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
})

db.collection(USERS).insertOne(mockUser);

