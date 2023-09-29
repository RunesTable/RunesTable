import React from 'react'
import styles from "@/styles/SellCard.module.css"
export default function SellCard() {
  return (
    <div className={styles.card}>
        <div className={styles.qty }>500 Token</div>
        <div className={styles.price}>
        <div className={styles.priceDollar}>1$ / Token</div>
        <div className={styles.priceBTC}>286 sats / Token</div>
        </div>
        <div className={styles.totalvalue}>
        <button className={styles.button}>
          <div>Buy</div>  <div>13$</div></button>
        <div className={styles.totalvalueBTC}>3456 sats</div>
        </div>
    </div> 
  )
}

