import React,{useState, useEffect, useContext} from 'react'
import styles from "@/styles/Table.module.css"
import {Token, FirebaseContext } from '@/functions/FirebaseContext';
import { useRouter } from 'next/router';


export default function Table() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
});
const [rowWidth, setRowWidth]=useState(50)

useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }
    
    // Set event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
}, []); // Empty array means that effect will only run once, similar to componentDidMount and componentWillUnmount

 useEffect(()=>{ 
  if( windowSize.width<850 ){
    setRowWidth(windowSize.width/40)
  }else{
    setRowWidth(windowSize.width/28)
  }


    console.log(windowSize)
 },[windowSize])


  const [transactions, setTransactions] = useState<any[]>([]);
  const url="https://mempool.space/tx/"
  const router = useRouter();

  function shortenString(str:any, startChars:any, endChars:any, maxLength:any) {
    if (str.length <= maxLength) return str;
    
    const start = str.substr(0, startChars);
    const end = str.substr(-endChars);
  
    return `${start}...${end}`;
  }
  


  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch('/api/activity');
      const data = await response.json();

      setTransactions(Array.isArray(data) ? data : []);
      
    }

    fetchTransactions();
  }, []);

  async function handleScroll(event:any) {
  
    if (Math.abs(event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop) < 2) {
      console.log("sroll")
      // updateToken();
    }
  }
  
  return (
  
    <div className={styles.table_wrapper} onScroll={handleScroll}>
    <table className={styles.table}>
    <thead className={styles.table_head}>
      <tr className={ styles.row}>
        <th className={styles.column1}scope="col">Index</th>
        <th className={styles.column2}scope="col">TxId</th>
        <th className={styles.column3}scope="col">Block</th>
        <th className={styles.column4}scope="col">Position in the Block</th>
        <th className={styles.column5}scope="col">Date</th>
        <th className={styles.column6}scope="col">Data</th>
      </tr>
    </thead>
    <tbody  className={styles.table_body}>

    {(!transactions || transactions.length === 0) ? <tr className={styles.row}><td colSpan={6}>Loading</td></tr> : transactions.map((tx:any, index) => {

      return (
      <tr key={index} className={styles.row}>
        <td className={styles.column1}>{index}</td>
        <td className={styles.column2}> <a href={url+tx.txid} target="_blank">{shortenString(tx.txid, rowWidth/2, rowWidth/2, rowWidth)}</a> </td>
        <td className={styles.column3}>{tx.block}</td>
        <td className={styles.column4}>{tx.position}</td>
        <td className={styles.column5}>{tx.date}</td>
        <td className={styles.column6}>  {shortenString(tx.data,rowWidth/2, rowWidth/2, rowWidth)}</td>
         

         
      </tr>)
    })} 
   
     </tbody>
    </table>
  </div>

  
  )
}
