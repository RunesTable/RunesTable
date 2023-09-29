import React,{useState, useEffect, useContext} from 'react'
import styles from "@/styles/Table.module.css"
import {Token, FirebaseContext } from '@/functions/FirebaseContext';
import { useRouter } from 'next/router';


export default function Table() {

  const {db,fetchToken}=useContext(FirebaseContext);
  const [token,setToken]=useState(new Array<Token>);
  const [transactions, setTransactions] = useState([]);

  const router = useRouter();

  //eslint-disable-next-line react-hooks/exhaustive-deps



  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch('/api/activity');
      const data = await response.json();
      setTransactions(data);
    }

    fetchTransactions();
  }, []);

  async function updateToken(){
    fetchToken();
    setToken(db.brc.data.slice());
  }

  async function handleScroll(event:any) {
  
    if (Math.abs(event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop) < 2) {
      console.log("sroll")
      updateToken();
    }
  }
  
  const handleRowClick = (token_id: String ) => {
    router.push("/token/"+token_id);
  }

  return (
  
    <div className={styles.table_wrapper} onScroll={handleScroll}>
    <table className={styles.table}>
    <thead className={styles.table_head}>
      <tr className={ styles.row}>
        <th className={styles.column1}scope="col">Name</th>
        <th className={styles.column2}scope="col">Price</th>
        <th className={styles.column3}scope="col">1D Change</th>
        <th className={styles.column4}scope="col">1D Volume</th>
        <th className={styles.column5}scope="col">7D Change</th>
        <th className={styles.column6}scope="col">7D Volume</th>
        <th className={styles.column7}scope="col">Market Cap</th>
        <th className={styles.column8}scope="col">Minted</th>
        <th className={styles.column9}scope="col">Limit/mint</th>
        <th className={styles.column10}scope="col">Supply</th>
      </tr>
    </thead>
    {db.brc.data.length!==0?<tbody  className={styles.table_body}>
    {transactions.map((token,index)=>{
      return (
      <tr key={index} className={styles.row} onClick={(e) => handleRowClick(token.id)}>
        <td className={styles.column1}>{token.date.toString()}</td>
        <td className={styles.column2}>Price</td>
        <td className={`${styles.column3} ${styles.color_green}`}>+3.56%</td>
        <td className={styles.column4}>1D Vol</td>
        <td className={`${styles.column5} ${styles.color_red}`}>-13.64%</td>
        <td className={styles.column6}>7D Vol</td>
        <td className={styles.column7}>Market Cap</td>
        <td className={styles.column8}>90%</td> 
        <td className={styles.column9}>1</td> 
        <td className={styles.column10}>{token.data.toString()}</td> 
         
       
      </tr>)
    })} 
    </tbody> : <tbody  className={styles.table_body} ><tr className={styles.row_flex} onClick={(e) => {router.push("/token/")}}><td>Click here to access the tokens list</td></tr></tbody>}
    </table>
  </div>

  
  )
}
