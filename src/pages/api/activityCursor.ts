import axios from 'axios';

const mongoApiEndpoint = process.env.MONGO_API_ENDPOINT?process.env.MONGO_API_ENDPOINT:"";
const mongoApiKey = process.env.MONGO_API_KEY?process.env.MONGO_API_KEY:"";
const mongoCluster = process.env.MONGO_CLUSTER?process.env.MONGO_CLUSTER:"";
const mongoDbName = process.env.MONGO_DB_NAME?process.env.MONGO_DB_NAME:"";
const slowProgress = process.env.MONGO_SLOW_PROGRESS?process.env.MONGO_SLOW_PROGRESS:"";


export default async (req:any, res:any) => {
  try {
    const url = `${mongoApiEndpoint}/find`;
    const headers = {
      "apiKey": `${mongoApiKey}`,
      'Content-Type': 'application/ejson',
      "Accept": "application/json",
    };
    const data = {
      "dataSource": `${mongoCluster}`,
      "database": `${mongoDbName}`,
      "collection": `${slowProgress}`,
    };
    const response = await axios.post(url, data, { headers: headers });
    const cursor=response.data.documents;
    res.status(200).json(cursor);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  } 
};

