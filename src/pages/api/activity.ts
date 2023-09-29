// pages/api/users.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://simoncherel:Toshiba924@cluster0.zx1viyd.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'runesDB';

const client = new MongoClient(uri);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req:any, res:any) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const runesCollection = db.collection('runesTxSlow');
    const transactions = await runesCollection.find().toArray();
    res.status(200).json(transactions);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

