// pages/api/users.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI?process.env.MONGO_URI:"";
const dbName = process.env.MONGO_DB_NAME?process.env.MONGO_DB_NAME:"";
const slowCollection=process.env.MONGO_SLOW_COLLECTION?process.env.MONGO_SLOW_COLLECTION:"";

const client = new MongoClient(uri);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req:any, res:any) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const runesCollection = db.collection(slowCollection);
    const transactions = await runesCollection.find().toArray();
    res.status(200).json(transactions);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

