// pages/api/users.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI?process.env.MONGO_URI:"";
const dbName = process.env.MONGO_DB_NAME?process.env.MONGO_DB_NAME:"";
const collection=process.env.MONGO_SLOW_COLLECTION?process.env.MONGO_SLOW_COLLECTION:"";
const progress=process.env.MONGO_SLOW_PROGRESS?process.env.MONGO_SLOW_PROGRESS:"";

const client = new MongoClient(uri);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req:any, res:any) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const runesTxCollection = db.collection(collection);
    const transactions = await runesTxCollection.find().toArray();
    res.status(200).json(transactions);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

