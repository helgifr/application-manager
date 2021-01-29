const { MongoClient } = require('mongodb');
const mongo = require('mongodb');

const dbUrl = process.env.DATABASE_URL;

let db;
let client;
let result;
let oID;

async function saveApplication(id, application) {
  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('Applications');
    result = await db.collection('users')
      .findOneAndUpdate({ _id: oID }, { $push: { applications: application } });
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }
  return result.ok;
}

async function fetchApplications(id) {
  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('Applications');
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
  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('Applications');
    result = await db.collection('users')
      .aggregate([{ $match: { _id: oID } }, { $project: { _id: 0, application: { $arrayElemAt: ['$applications', Number(index)] } } }])
      .toArray();
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

  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('Applications');
    result = await db.collection('users')
      .updateOne({ _id: oID }, set);
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }

  return result;
}

async function deleteApplication(id, index) {
  const set = { $set: { } };
  set.$set[`applications.${index}`] = null;

  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('Applications');
    await db.collection('users')
      .updateOne({ _id: oID }, set);
    result = await db.collection('users')
      .updateOne({ _id: oID }, { $pull: { applications: null } });
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }

  return result;
}

async function addUser(user) {
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('Applications');
    result = await db.collection('users')
      .insertOne(user);
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }
  return result.ops[0];
}

async function findUserByUsername(name) {
  try {
    console.log(dbUrl);
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('Applications');
    result = await db.collection('users')
      .findOne({ username: name }, { projection: { applications: 0 } });
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.close();
  }

  return result;
}

async function findUserById(id) {
  try {
    oID = new mongo.ObjectID(id);
  } catch (err) {
    throw err;
  }
  try {
    client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = client.db('Applications');
    result = await db.collection('users')
      .findOne({ _id: oID });
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
  deleteApplication,
  addUser,
  findUserByUsername,
  findUserById,
};
