import React,{useContext, useEffect, useState} from 'react';
import {FirebaseContext } from '@/functions/FirebaseContext';
import { WalletContext } from '@/functions/WalletContext';
import Chart from '@/components/Chart';
import styles from "@/styles/Index.module.css"
import CardChart from '@/components/CardChart';
import Table from '@/components/Table';
import Shadow from '@/components/Shadow';

export default function Home() {



 

 
  return (
    <>




    <Shadow width={100} height={40} hover={false}>
    <Table/>
    </Shadow>

  </>
  )
}

