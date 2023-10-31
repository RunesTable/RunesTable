import React from "react"
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import "@fontsource/jetbrains-mono" 
import { WalletContextProvider } from "@/functions/WalletContext";
import { FirebaseContextProvider } from "@/functions/FirebaseContext";
import { BitcoinContextProvider } from "@/functions/BitcoinContext";
      
export default function Layout({children}:{children:any}) {
  const router=useRouter();
  
  return (
    <div className="layout">

    <Head>
      <title>RunesTable</title> 
      <meta name="description" content="RunesTable is an runes trading platform" />
      <link rel="icon" href={"/runestable_logo.png"}/>
    </Head>
    
    <BitcoinContextProvider>
    <FirebaseContextProvider>
    <WalletContextProvider>
    <Header/>

    <main className="main">
      
    {children}
    
    </main>

    

    </WalletContextProvider>
    </FirebaseContextProvider>
    </BitcoinContextProvider>
    <Footer/>
    </div>
  )
}