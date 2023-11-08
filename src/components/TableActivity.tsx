import React, { useState, useEffect, useContext } from 'react';
import styles from "@/styles/TableActivity.module.css";
import { Token, FirebaseContext } from '@/functions/FirebaseContext';
import { useRouter } from 'next/router';
import Loader from './Loader';

export default function TableActivity() {
  const [page, setPage] = useState(1);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });
  const [rowWidth, setRowWidth] = useState(50);

  const [titles, setTitles] = useState({
    operation: "Operation",
    amount: "Amount",
    symbol: "Symbol",
    decimal: "Decimal",
    encoding: "Encoding",
    issuanceByte: "IssuanceByte",
    issuanceTransfer: "IssuanceTransfer",
    message: "Message"
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowSize.width < 850) {
      setRowWidth(windowSize.width / 80);
      setTitles({
        operation: "Op",
        amount: "Amt",
        symbol: "Tick",
        decimal: "Dec",
        encoding: "Enc",
        issuanceByte: "Byte",
        issuanceTransfer: "Tfr",
        message: "Msg"
      });
    } else {
      setRowWidth(windowSize.width / 40);
      setTitles({
        operation: "Operation",
        amount: "Amount",
        symbol: "Symbol",
        decimal: "Decimal",
        encoding: "Encoding",
        issuanceByte: "IssuanceByte",
        issuanceTransfer: "IssuanceTransfer",
        message: "Message"
      });
    }
  }, [windowSize]);

  const [transactions, setTransactions] = useState<any[]>([]);
  const url = "https://mempool.space/tx/";
  const router = useRouter();

  function shortenString(str: any, startChars: any, endChars: any, maxLength: any) {
    if (!str) return "";
    if (str.length <= maxLength) return str;
    
    const start = str.substr(0, startChars);
    const end = str.substr(-endChars);
  
    return `${start}...${end}`;
  }

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch(`/api/activity?page=${page}`);
      const data = await response.json();
      transactions.length > 0 ? setTransactions([...transactions, ...data]) : setTransactions(Array.isArray(data) ? data : []);
    }

    fetchTransactions();
  }, [page]);

  async function handleScroll(event: any) {
    if (Math.abs(event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop) < 2) {
      setPage(page + 1);
    }
  }

  return (
    <div className={styles.table_wrapper} onScroll={handleScroll}>
      <table className={styles.table}>
        <thead className={styles.table_head}>
          <tr className={styles.row}>
            <th className={styles.column1} scope="col">{titles.operation}</th>
            <th className={styles.column2} scope="col">TxId</th>
            <th className={styles.column3} scope="col">Vout</th>
            <th className={styles.column4} scope="col">Id</th>
            <th className={styles.column5} scope="col">{titles.amount}</th>
            <th className={styles.column6} scope="col">{titles.symbol}</th>
            <th className={styles.column7} scope="col">{titles.decimal}</th>
            <th className={styles.column8} scope="col">{titles.encoding}</th>
            <th className={styles.column9} scope="col">{titles.issuanceByte}</th>
            <th className={styles.column10} scope="col">{titles.issuanceTransfer}</th>
            <th className={styles.column11} scope="col">Path</th>
            <th className={styles.column12} scope="col">{titles.message}</th>
          </tr>
        </thead>
        <tbody className={styles.table_body}>
          {(!transactions || transactions.length === 0) ? (
            <tr className={styles.row}>
              <td className={styles.column6}><Loader/></td>
   
            </tr>
          ) : (
            transactions.map((tx: any, index) => (
              <tr key={index} className={styles.row}>
                <td className={styles.column1}>{tx.operation}</td>
                <td className={styles.column2}>
                  <a href={url + tx.txid} target="_blank">{shortenString(tx.txid, rowWidth / 5, rowWidth / 5, rowWidth)}</a>
                </td>
                <td className={styles.column3}>{tx.vout ? tx.vout : "-"}</td>
                <td className={styles.column4}>{tx.id ? tx.id : "-"}</td>
                <td className={styles.column5}>{tx.amount ? tx.amount : "-"}</td>
                <td className={styles.column6}>{tx.symbole ? tx.symbole : "-"}</td>
                <td className={styles.column7}>{tx.decimal ? tx.decimal : "-"} </td>
                <td className={styles.column8}>{tx.encoding ? shortenString(tx.encoding, rowWidth / 5, rowWidth / 5, rowWidth / 3) : "-"}</td>
                <td className={styles.column9}>{tx.issuanceByte ? tx.issuanceByte : "-"}</td>
                <td className={styles.column10}>{tx.issuanceTransfer ? tx.issuanceTransfer.toString() : "-"}</td>
                <td className={styles.column11}>
                  {tx.path ? tx.path.map((element: any) => [shortenString(element[0], rowWidth / 4, rowWidth / 4, rowWidth), element[1]]).toString() : "-"}
                </td>
                <td className={styles.column12}>{tx.message ? tx.message : "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
