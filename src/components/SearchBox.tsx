import React, { useState, useEffect, useContext } from 'react';
import {useRouter} from 'next/router';
import {FirebaseContext } from '@/functions/FirebaseContext';
import { Query } from 'firebase/firestore';
import Link from 'next/link';
import styles from "@/styles/SearchBox.module.css"
interface SearchBoxRecord {
    id: string,
    name: string,
}

export const SearchBox: React.FC<{className?: string}> = ({className}) => {
    
    const [query,setQuery] = useState("");
    const [data,setData] = useState<SearchBoxRecord[]>([]);
    const {getTokenStartWith}=useContext(FirebaseContext);


    useEffect(()=>{
      
      async function fetchData(){
        let _result: SearchBoxRecord[] =[];
        await getTokenStartWith(query,5,(data:any,id:string)=>{
          const tick:string=data.content.tick;
          const tid:string=data.id;
          _result.push({id:tid,name:tick})
          setData(_result.slice());
        });
      }
      setData([]);
      if(query.length!=0){
      fetchData();
    }
    },[query])

    const router = useRouter();
 
    function inputChange(event:any){
      setQuery(event.target.value)
    }

    function select(event:any){
      console.log("record",event.target.value)
      router.push(`/token/${event.target.value}`);
      setQuery("")
    }


    return (
      <>
      <input maxLength={4} placeholder='Search a token' className={styles.input} type='text' value={query} onChange={inputChange}></input>  
      <ul className={query.length==0?styles.list_empty:styles.list}>
        {data.map((element,index)=>{
          return(<li className={styles.listed}><button className={styles.button} value={element.id} onClick={select}>{element.name}</button></li>);
        })}
      </ul>
      </>
  );
}