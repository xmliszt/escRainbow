
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/alphadb";
var dbName = "alphadb";

async function createUniqueCollection(collecitonName){
    const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(e=>{
        client.close();
        throw e;
    });
    const db = client.db(dbName);
    const coln = db.collection(collecitonName);
    coln.createIndex(
        {id: 1}, {unique: true}
    );
    client.close();
    return 1;
}

async function insert(data, collecitonName){
    const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(e=>{
        client.close();
        throw e;});
    const db = client.db(dbName);
    coln = db.collection(collecitonName);
    await coln.insertOne(data).catch(e=>{
        client.close()
        throw e;});
    console.log("Successfully inserted!");
    client.close();
    return 1
}

async function search(query, collecitonName){
    const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(e=>{
        client.close();
        throw e;});
    const db = client.db(dbName);
    coln = db.collection(collecitonName);
    result = await coln.findOne(query).catch(e=>{
        client.close();
        throw e;});
    console.log("Entry found!");
    client.close()
    return result;
}

async function update(query, newValues, collecitonName){
    const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(e=>{
        client.close();
        throw e;});
    const db = client.db(dbName);
    coln = db.collection(collecitonName);
    var newVal ={ $set: newValues };
    await coln.updateOne(query, newVal).catch(e=>{
        client.close();
        throw e;});
    console.log("Entry updated!");
    client.close();
    return 1;
}

async function deleteOne(query, collecitonName){
    const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(e=>{
        client.close();
        throw e;
    });
    const db = client.db(dbName);
    coln = db.collection(collecitonName);
    await coln.deleteOne(query).then(success=>{
        console.log("Entry deleted!");
        client.close();
        return 1;
    }).catch(e=>{
        client.close();
        throw e;
    })
}

async function findAll(query, collectionName){
    const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(e=>{
        client.close();
        throw e;
    });
    const db = client.db(dbName);
    coln = db.collection(collectionName);
    var results = coln.find(query).toArray();
    client.close();
    return results;
}

exports.dbUtils = {
    createUniqueCollection: createUniqueCollection,
    insert: insert,
    search: search,
    update: update,
    delete: deleteOne,
    findAll: findAll
}