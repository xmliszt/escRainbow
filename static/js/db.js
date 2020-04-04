
const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb://localhost:27017/alphadb";
const uri = "mongodb+srv://alpha-holding:~!@SUTDsutd123@alpha-cluster-0-ruglw.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "alphaDB";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

async function createUniqueCollection(collecitonName){
    client.connect(async err=>{
        const collection = client.db(dbName).collection(collecitonName);
        collection.createIndex(
            {id: 1}, {unique: true}
        );
        // client.close();
        return 1;
    });
}

async function insert(data, collecitonName){
    await client.connect().then(async success=>{
        const collection = client.db(dbName).collection(collecitonName);
        await collection.insertOne(data);
        console.log("Successfully inserted!");
        // client.close();
    }).catch(err=>{
        // client.close();
        throw err;
    });
}

async function search(query, collecitonName){
    var result;
     await client.connect().then(async ()=>{
        const collection = client.db(dbName).collection(collecitonName);
        result = await collection.findOne(query);
        console.log("Entry found!");
        // client.close();
     }).catch(err=>{throw err});
    return result;
}

async function update(query, newValues, collecitonName){
    await client.connect().then(async success=>{
        const collection = client.db(dbName).collection(collecitonName);
        var newVal ={ $set: newValues };
        await collection.updateOne(query, newVal);
        console.log("Entry updated!");
        // client.close();
    }).catch(err=>{
        // client.close();
        throw err;
    });
}

async function deleteOne(query, collecitonName){
    await client.connect().then(async success=>{
        const collection = client.db(dbName).collection(collecitonName);
        await collection.deleteOne(query).then(success=>{
            console.log("Entry deleted!");
            // client.close();
        }).catch(err=>{
            // client.close();
            throw err;
        });
    });
}

async function findAll(query, collectionName){
    var result;
    await client.connect().then(async success=>{
        const collection = client.db(dbName).collection(collectionName);
        result = await collection.find(query).toArray();
        console.log("Entries found!");
        // client.close();
    }).catch(err=>{
        // client.close();
        throw err;
    });
    return result;
}

async function resetAgents(){
    await findAll({}, "Agents").then(async success=>{
        for (var i=0; i<success.length; i++){
            var agent = success[i];
            var agentID = agent.id;
            console.log(success);
            update({id: agentID}, {priority: 0, busy: false}, "Agents").then(success=>{
                console.log("Priority score reset successfully!");
            }).catch(err=>{
                console.error("Failed to reset priority!" + err);
            })
        }
    }).catch(err=>{
        console.error("Failed to reset priority!" + err);
    });
}

exports.dbUtils = {
    createUniqueCollection: createUniqueCollection,
    insert: insert,
    search: search,
    update: update,
    delete: deleteOne,
    findAll: findAll,
    resetAgents: resetAgents
}