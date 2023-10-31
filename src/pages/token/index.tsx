import React,{useState, useEffect, useContext} from 'react'
import TableToken from '@/components/TableToken'
import Shadow from '@/components/Shadow'
export default function Board() {


  return (

      <Shadow width={100} height={90} hover={false}>
      <TableToken/>
      </Shadow>

  )
}
