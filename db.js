const { MongoClient } = require('mongodb');
const mongo = require('mongodb');

const dbUrl = process.env.DATABASE_URL;

async function saveApplication(id, application) {
  let db;
  let client;
  let result;
  let oID;
  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('applications-db');
    result = await db.collection('users').findOneAndUpdate({ _id: oID }, { $push: { applications: application } });
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }
  return result.ok;
}

async function fetchApplications(id) {
  let db;
  let client;
  let result;
  let oID;
  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('applications-db');
    result = await db.collection('users')
      .findOne({ _id: oID }, { projection: { _id: 0, applications: 1 } });
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }
  return result;
}

async function fetchApplication(id, index) {
  let db;
  let client;
  let result;
  let oID;
  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('applications-db');
    result = await db.collection('users')
      .aggregate([{ $match: { _id: oID } }, { $project: { _id: 0, application: { $arrayElemAt: ['$applications', Number(index)] } } }]).toArray();
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }
  return result[0];
}

async function conditionalUpdate(id, index, application) {
  const newApplication = application;
  if (typeof application.process === 'string') {
    const { process } = application;
    newApplication.process = process.split(',');
  }

  const set = { $set: { } };
  set.$set[`applications.${index}`] = newApplication;

  let db;
  let client;
  let result;
  let oID;
  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('applications-db');
    result = await db.collection('users')
      .updateOne({ _id: oID }, set);
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }

  return result;
}

async function addUser(user) {
  let db;
  let client;
  let result;
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('applications-db');
    result = await db.collection('users').insertOne(user);
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }
  return result.ops[0];
}

async function findUserByUsername(name) {
  let db;
  let client;
  let result;
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('applications-db');
    result = await db.collection('users').findOne({ username: name }, { projection: { applications: 0 } });
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }

  return result;
}

async function findUserById(id) {
  let db;
  let client;
  let result;
  let oID;
  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('applications-db');
    result = await db.collection('users').findOne({ _id: oID });
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }

  return result;
}

module.exports = {
  saveApplication,
  fetchApplications,
  fetchApplication,
  conditionalUpdate,
  addUser,
  findUserByUsername,
  findUserById,
};
