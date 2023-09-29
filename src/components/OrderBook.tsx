import React, { useEffect, useState, useContext,useCallback} from "react";
import styles from "@/styles/OrderBook.module.css"
import {FirebaseContext } from '@/functions/FirebaseContext';


export const OrderBook:React.FC<{id:string}> = ({id}:{ id: string }) => {

  
  const {fetchAddedBuyOrders,fetchAddedSellOrders,fetchRemovedSellOrders,fetchRemovedBuyOrders}=useContext(FirebaseContext);


  const [current_sell_orders, setCurrSell] = useState(new Array)
  const [current_buy_orders, setCurrBuy] = useState(new Array)

  const [last_buy_price, setLastBuy] = useState(0)
  const [last_sell_price, setLastSell] = useState(0)


  function update_added_buy_orders (_order:any) {
    let order={direction:_order.direction,price:parseFloat(_order.price),size:parseFloat(_order.size),accumulation:parseFloat(_order.size)}
    let i;
    if(current_buy_orders.length==0){
      current_buy_orders.push(order)
    }else{
      for (i=current_buy_orders.length-1; i>0 && order.price>current_buy_orders[i].price; i--) {
        current_buy_orders[i].accumulation+=order.size;
      }
      if(current_buy_orders[i].price==order.price){
        current_buy_orders[i].size+=order.size;
        current_buy_orders[i].accumulation+=order.size;
      }else if (order.price>current_buy_orders[i].price){
        order.accumulation=order.size;
        current_buy_orders[i].accumulation+=order.size;
        current_buy_orders.splice(i,0,order);
      }else{
        order.accumulation=current_buy_orders[i].accumulation+order.size;
        current_buy_orders.splice(i+1,0,order);
      }
    }
  
    setCurrBuy(current_buy_orders.slice())
  }

  function update_removed_buy_orders(_order:any) {
    let order={direction:_order.direction,price:parseFloat(_order.price),size:parseFloat(_order.size),accumulation:parseFloat(_order.size)}
    let i;
    if(current_buy_orders.length==0){
      console.log("Error try to clean an empty array")
    }else{
      for (i=current_buy_orders.length-1; i>0 && order.price>current_buy_orders[i].price; i--) {
        current_buy_orders[i].accumulation-=order.size;
      }
      if(current_buy_orders[i].price==order.price){
        if( current_buy_orders[i].size==order.size){
          current_buy_orders.splice(i,1);
        }else{
        current_buy_orders[i].size-=order.size;
        current_buy_orders[i].accumulation-=order.size;
        }
      }
    }
  
    setCurrBuy(current_buy_orders.slice())
   
  }

  function update_added_sell_orders (_order:any) {
    let order={direction:_order.direction,price:parseFloat(_order.price),size:parseFloat(_order.size),accumulation:parseFloat(_order.size)}
    let i;
    if(current_sell_orders.length==0){
      current_sell_orders.push(order)
    }else{
      for (i=current_sell_orders.length-1; i>0 && order.price<current_sell_orders[i].price; i--) {
        current_sell_orders[i].accumulation+=order.size;
      }
      if(current_sell_orders[i].price==order.price){
        current_sell_orders[i].size+=order.size;
        current_sell_orders[i].accumulation+=order.size;
      }else if (order.price<current_sell_orders[i].price){
        order.accumulation=order.size;
        current_sell_orders[i].accumulation+=order.size;
        current_sell_orders.splice(i,0,order);
      }else{
        order.accumulation=current_sell_orders[i].accumulation+order.size;
        current_sell_orders.splice(i+1,0,order);
      }
    }
  
    setCurrSell(current_sell_orders.slice())
  }
  
  function update_removed_sell_orders(_order:any) {
    let order={direction:_order.direction,price:parseFloat(_order.price),size:parseFloat(_order.size),accumulation:parseFloat(_order.size)}
    let i;
    if(current_sell_orders.length==0){
      console.log("Error try to clean an empty array")
    }else{
      for (i=current_sell_orders.length-1; i>0 && order.price<current_sell_orders[i].price; i--) {
        current_sell_orders[i].accumulation-=order.size;
      }
      if(current_sell_orders[i].price==order.price){
        if( current_sell_orders[i].size==order.size){
          current_sell_orders.splice(i,1);
        }else{
        current_sell_orders[i].size-=order.size;
        current_sell_orders[i].accumulation-=order.size;
        }
      }
    }
  
    setCurrSell(current_sell_orders.slice())
   
  }
  

  useEffect(()=>{
      fetchAddedBuyOrders(id,(data:any)=>{
        update_added_buy_orders(data);
      })
      fetchAddedSellOrders(id,(data:any)=>{
        update_added_sell_orders(data);
      })
      fetchRemovedBuyOrders(id,(data:any)=>{
        update_removed_buy_orders(data);
      })
      fetchRemovedSellOrders(id,(data:any)=>{
        update_removed_sell_orders(data);
      })
  }, [])


  useEffect(()=>{
    if(current_buy_orders.length>0 && current_sell_orders.length>0){
   setLastBuy(current_buy_orders[0].price);
   setLastSell(current_sell_orders[0].price);
    }
}, [current_sell_orders,current_buy_orders])

  return (

    <div className={styles.order_book}>

          <div className={styles.order_book_header}>
            <div className={styles.order_book_value_name}>Price</div>
            <div className={styles.order_book_value_name}>Size</div>
            <div className={styles.order_book_value_name}>Accumulation</div>
          </div>

          <div className={styles.order_book_other}>

            <div className={styles.order_book_sell_orders}>
            {[...current_sell_orders].reverse().map((order:any,index:number) => {
            return (
            <div className={styles.order_book_sell_order} key={index}>
                <div className={styles.order_book_value}>{order.price}</div>
                <div className={styles.order_book_value}>{order.size.toLocaleString(["en-EN"])}</div>
                <div className={styles.order_book_value}>{order.accumulation.toLocaleString(["en-EN"])}</div>
            </div>
            )})}
            </div>

            <div className={styles.order_book_spread}>
              <div className={styles.order_book_value_name}>Spread</div>
              <div className={styles.order_book_value}>{ last_sell_price - last_buy_price}</div>
              <div className={styles.order_book_value}>{ ((last_sell_price - last_buy_price)/last_buy_price).toFixed(4).toString()+"%" }</div>
            </div>

            <div className={styles.order_book_buy_orders}> 
              {[...current_buy_orders].reverse().map((order:any,index:number) => {
                return(
              <div className={styles.order_book_buy_order} key={index}>
                <div className={styles.order_book_value}>{order.price}</div>
                <div className={styles.order_book_value}>{order.size.toLocaleString(["en-EN"])}</div>
                <div className={styles.order_book_value}>{order.accumulation.toLocaleString(["en-EN"])}</div>
              </div>
            )})}
            </div>

          </div>


    </div>
  )
}