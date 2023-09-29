import React,{useState,useContext, useEffect} from 'react';
import {FirebaseContext } from '@/functions/FirebaseContext';
import styles from "@/styles/Order.module.css";
import { WalletContext } from '@/functions/WalletContext';
import { HiArrowDown } from "react-icons/hi2";
export default function Order({deploy,id}:{deploy:any,id:string}) {
    const [order,setOrder]=useState({type:"market",direction:"buy",price:1.00,size:1.00,btc_size:0.00,token_size:0.00})
    const { buyMarket,sellMarket,buyLimit,sellLimit}=useContext(FirebaseContext);
    const { wallet}=useContext(WalletContext);
    function toggleDirection(event:any){
        const _direction=(order.direction==="buy")?"sell":"buy";
        setOrder({...order,direction:_direction});

      }
    
    function placeMarketOrder(event:any){
      event.preventDefault();
      if(order.direction==="buy"){
        buyMarket(id,order.price,order.size,wallet.address);
      }else if(order.direction==="sell"){
        sellMarket(id,order.price,order.size,wallet.address);
      }
      
    }
    function placeLimitOrder(event:any){
      event.preventDefault();
      if(order.direction==="buy"){
        buyLimit(id,order.price,order.size,wallet.address);
      }else if(order.direction==="sell"){
        sellLimit(id,order.price,order.size,wallet.address);
      }
    }

  return (
    <div className={styles.ord}>
      <div className={styles.title}>Swap</div>
      <div className={styles.input_container}>
      <div className={styles.input}>
      <div className={styles.price}>
      <input className={styles.crypto} type="number" min="0"/>
      <input className={styles.fiat} type="number" min="0"/>
      </div>
      <div>
      {order.direction=="buy"?deploy.data.content.tick:"BTC"}
      </div>
      </div>
      <button className={styles.swap} onClick={toggleDirection}><HiArrowDown className={styles.arrow}/></button>
      <div className={styles.input}>
        <div className={styles.price}>
      <input className={styles.crypto} type="number" min="0" />
      <input className={styles.fiat} type="number" min="0"/>
      </div>
      <div>
      {order.direction=="buy"?"BTC":deploy.data.content.tick}
      </div>
      </div>
      </div>
      <div  className={styles.footer}>
        <div className={styles.ratio}>
          <div className={styles.fiatratio} >
          <input  type="number" min="0"/>$ / {deploy.data.content.tick}
        </div>
        <div className={styles.cryptoratio}>
        <input  type="number" min="0"/>sats / {deploy.data.content.tick}
        </div>
        </div>
        <div className={styles.description} > {order.type=="market"?"Liquidity found at best price":order.direction=="buy"?"Insuffisant liquidity for this trade, place the buy order ?":"Insuffisant liquidity for this trade, place the sell order ?"}</div>
     
      </div>
    <button  onClick={placeMarketOrder} className={styles.button}> {order.type=="market"?order.direction=="buy"?"Buy":"Sell":order.direction=="buy"?"Place buy order":"Place sell order"}</button>
  
  </div>

  )
}
