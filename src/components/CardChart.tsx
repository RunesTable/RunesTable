import React from 'react'
import styles from "@/styles/CardChart.module.css"
import Chart from './Chart'
export default function CardChart({id}:{id?:string}) {
  return (
    <div className={styles.card_wrapper}>
    <div className={styles.card}>
      <Chart id="" interact={false} className={styles.chartCardContainer} classChart={styles.chartCard} classTitle={styles.titleCard} title="Name" classPrice={styles.priceCard} price={20.56} classVolume={styles.volumeCard} volume={100000}/>
    </div>
    <div className={styles.shadow}></div>
    </div> 
  )
}

