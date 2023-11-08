import Link from 'next/link'
import React, { useEffect, useState } from 'react'
// import styles from "@/styles/Footer.module.css"
export default function Footer() {

  const [indexerState,setIndexerState]=useState({slowTxCursor:0,fastTxCursor:0,operationCursor:0,pendingRunesCursor:0,blockBehind:0})
  useEffect(()=>{
    const fetchIndexerState=async()=>{
      const response=await fetch('/api/cursor')
      const data=await response.json()
      const _slowTxCursor=data.filter((item: any)=>item.cursor==='slowTxCursor')[0]
      const _fastTxCursor=data.filter((item: any)=>item.cursor==='fastTxCursor')[0]
      const _operationCursor=data.filter((item: any)=>item.cursor==='operationCursor')[0]
      const _pendingRunesCursor=data.filter((item: any)=>item.cursor==='pendingRunesCursor')[0]
      console.log(data)
      const _indexerState={
        slowTxCursor:_slowTxCursor?_slowTxCursor.block:0,
        fastTxCursor:_fastTxCursor?_fastTxCursor.block:0,
        operationCursor:_operationCursor?_operationCursor.index:0,
        pendingRunesCursor:_pendingRunesCursor?_pendingRunesCursor.block:0,
        blockBehind:_slowTxCursor&&_operationCursor?_slowTxCursor.block-_operationCursor.index:0
      }
      setIndexerState(_indexerState)
    }
    fetchIndexerState()
  },[])
  return (

    <footer className={"p-4 flex flex-col justify-center items-center"}>
        <div className='flex flex-row justify-around w-full text-neutral-500 border-b border-neutral-800 mb-4 pb-2'>
        {/* <p className='lg:block hidden'>Latest block number: { slowTxCursor.block?.toString()}</p> */}
          <p  className='lg:block hidden'>Latest block indexer received: { indexerState.slowTxCursor?.toString()}</p>
          <p  className='lg:block hidden'>Latest block indexer computed: {indexerState.operationCursor?.toString()}</p>
          <p>Blocks behind : { indexerState.blockBehind?.toString()}</p>

        </div>
        <p> © 2023 RunesTable All rights reserved.</p>
      </footer>



  )
}
