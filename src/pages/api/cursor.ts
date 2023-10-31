import axios from 'axios';

const mongoApiEndpoint = process.env.MONGO_API_ENDPOINT?process.env.MONGO_API_ENDPOINT:"";
const mongoApiKey = process.env.MONGO_API_KEY?process.env.MONGO_API_KEY:"";
const mongoCluster = process.env.MONGO_CLUSTER?process.env.MONGO_CLUSTER:"";
const mongoDbName = process.env.MONGO_DB_NAME?process.env.MONGO_DB_NAME:"";
const slowTxCursor = process.env.MONGO_SLOW_TX_PROGRESS?process.env.MONGO_SLOW_TX_PROGRESS:"";
const fastTxCursor =  process.env.MONGO_FAST_TX_PROGRESS?process.env.MONGO_FAST_TX_PROGRESS:"";
const operationCursor = process.env.MONGO_OPERATION_PROGRESS?process.env.MONGO_OPERATION_PROGRESS:"";
const pendingRunesCursor =  process.env.MONGO_PENDING_RUNES_PROGRESS?process.env.MONGO_PENDING_RUNES_PROGRESS:"";


export default async (req:any, res:any) => {
  try {
    const url = `${mongoApiEndpoint}/find`;
    const headers = {
      "apiKey": `${mongoApiKey}`,
      'Content-Type': 'application/ejson',
      "Accept": "application/json",
    };
    const slowTxData = {
      "dataSource": `${mongoCluster}`,
      "database": `${mongoDbName}`,
      "collection": `${slowTxCursor}`,
    };
    const fastTxData = {
      "dataSource": `${mongoCluster}`,
      "database": `${mongoDbName}`,
      "collection": `${fastTxCursor}`,
    };
    const operationData = {
      "dataSource": `${mongoCluster}`,
      "database": `${mongoDbName}`,
      "collection": `${operationCursor}`,
    };
    const pendingRunesData = {
      "dataSource": `${mongoCluster}`,
      "database": `${mongoDbName}`,
      "collection": `${pendingRunesCursor}`,
    };
    let response1 = await axios.post(url, slowTxData, { headers: headers });
    let response2 = await axios.post(url, fastTxData, { headers: headers });
    let response3 = await axios.post(url, operationData, { headers: headers });
    let response4 = await axios.post(url, pendingRunesData, { headers: headers });
    if(response1.data.documents[0]){response1.data.documents[0].cursor="slowTxCursor";}
    if(response2.data.documents[0]){response2.data.documents[0].cursor="fastTxCursor";}
    if(response3.data.documents[0]){response3.data.documents[0].cursor="operationCursor";}
    if(response4.data.documents[0]){response4.data.documents[0].cursor="pendingRunesCursor";}
    console.log(response1.data.documents[0]);
    const cursor=response1.data.documents.concat(response2.data.documents).concat(response3.data.documents).concat(response4.data.documents);
    res.status(200).json(cursor);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  } 
};

