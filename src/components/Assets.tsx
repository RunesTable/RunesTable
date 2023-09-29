import React from 'react'
import styles from "@/styles/Assets.module.css"

export default function Assets() {
  return (
    <div className={styles.table_wrapper} >
    <table className={styles.table}>
    <thead className={styles.table_head}>
      <tr className={ styles.row}>
        <th className={styles.column1}scope="col">Name</th>
        <th className={styles.column2}scope="col">Price</th>
        <th className={styles.column3}scope="col">1D Change</th>
        <th className={styles.column4}scope="col">1D Volume</th>
        <th className={styles.column5}scope="col">Quantity</th>
        <th className={styles.column6}scope="col">Transferable</th>
        <th className={styles.column7}scope="col">Transfer</th>
        <th className={styles.column8}scope="col">List</th>
      </tr>
    </thead>
   <tbody  className={styles.table_body}>
    
      <tr className={styles.row}>
        <td className={styles.column1}>name</td>
        <td className={styles.column2}>Price</td>
        <td className={`${styles.column3} ${styles.color_green}`}>+3.56%</td>
        <td className={styles.column4}>1D Vol</td>
        <td className={styles.column5}>Quantity</td> 
        <td className={styles.column6}>Transferable</td> 
        <td className={styles.column7}><button className={styles.button} onClick={()=>{console.log("transfer")}}>Transfer</button></td> 
        <td className={styles.column8}><button className={styles.button} onClick={()=>{console.log("list")}}>List</button></td> 
      </tr>
    </tbody>
    </table>
    </div>
  )
}
