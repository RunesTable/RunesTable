import React,{useState, useEffect, useContext} from 'react'
import styles from "@/styles/TableToken.module.css"
import {Token, FirebaseContext } from '@/functions/FirebaseContext';
import { useRouter } from 'next/router';
import Loader from './Loader';

export default function TableToken() {
    const [page, setPage] = useState(1);
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

 },[windowSize])


  const [transactions, setTransactions] = useState<any[]>([]);
  const url="https://mempool.space/tx/"
  const router = useRouter();

  function shortenString(str:any, startChars:any, endChars:any, maxLength:any) {
    if(!str) return "";
    if (str.length <= maxLength) return str;
    
    const start = str.substr(0, startChars);
    const end = str.substr(-endChars);
  
    return `${start}...${end}`;
  }
  


  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch(`/api/token?page=${page}`);
      const data = await response.json();
      transactions.length>0?setTransactions([...transactions, ...data]):setTransactions(Array.isArray(data) ? data : []);
      
      
    }

    fetchTransactions();
  }, [page]);

  async function handleScroll(event:any) {
  
    if (Math.abs(event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop) < 2) {
      setPage(page+1);
    }
  }
  
  
  return (
  
    <div className={styles.table_wrapper} onScroll={handleScroll}>
    <table className={styles.table}>
    <thead className={styles.table_head}>
      <tr className={ styles.row}>
        <th className={styles.column1}scope="col">Index</th>
        <th className={styles.column2}scope="col">Symbole</th>
        <th className={styles.column3}scope="col">Amount</th>
        <th className={styles.column4}scope="col">Decimal</th>
        <th className={styles.column5}scope="col">TxId</th>
        <th className={styles.column6}scope="col">Vout</th>
      </tr>
    </thead>
    <tbody  className={styles.table_body}>

    {(!transactions || transactions.length === 0) ? <tr className={styles.row}><td className={styles.column5}><Loader/></td></tr> : transactions.map((tx:any, index) => {

      return (
      <tr key={index} className={styles.row}>
        <td className={styles.column1}>{tx._id}</td>
        <td className={styles.column2}> {tx.symbole}</td>
        <td className={styles.column3}>{tx.amount}</td>
        <td className={styles.column4}>{tx.decimal}</td>
        <td className={styles.column5}> <a href={url+tx.txid} target="_blank">{shortenString(tx.txid, rowWidth/2, rowWidth/2, rowWidth)}</a></td>
        <td className={styles.column6}>  {tx.vout}</td>
         

         
      </tr>)
    })} 
   
     </tbody>
    </table>
  </div>

  
  )
}
