import React,{useState, useEffect, useContext} from 'react'
import TableActivity from '@/components/TableActivity'
import Shadow from '@/components/Shadow'
export default function Board() {


  return (

      <Shadow width={100} height={90} hover={false}>
      <TableActivity/>
      </Shadow>

  )
}
