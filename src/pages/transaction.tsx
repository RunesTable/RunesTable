import React,{useState, useEffect, useContext} from 'react'
import TableRawTx from '@/components/TableRawTx'
import Shadow from '@/components/Shadow'
export default function Board() {


  return (

      <Shadow width={100} height={90} hover={false}>
      <TableRawTx/>
      </Shadow>

  )
}
