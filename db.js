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
  const { applications } = result.value;
  return applications[applications.length - 1];
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
  addUser,
  findUserByUsername,
  findUserById,
};
