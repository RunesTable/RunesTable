import React,{useState, useEffect, useContext} from 'react'
import Table from '@/components/Table'
import Shadow from '@/components/Shadow'
export default function Board() {


  return (

      <Shadow width={100} height={90} hover={false}>
      <Table/>
      </Shadow>

  )
}
