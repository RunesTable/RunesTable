/* eslint-disable @next/next/no-html-link-for-pages */
import styles from "@/styles/Header.module.css";
import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";
import { WalletContext } from "@/functions/WalletContext";
import { SearchBox } from "./SearchBox";


import Shadow from "./Shadow";
import Account from "./Account";


export default function Header() {
  const { wallet, setWalletType, disconnect, changeNetwork, ellipseAddress,
    openModal,closeModal } =
  useContext(WalletContext);

  
  async function chooseWallet(event: any) {
    await setWalletType(event.target.value);
  }

 


  return (
    <div className={styles.header}>
      <div className={styles.navbar}>
        <Link href="/">
          <Image
            className={styles.homeButton}
            src={"/runestable_logo.png"}
            alt="page logo"
            width={512}
            height={512}
          />
        </Link>
        <Link href="/token" className={styles.tokensButton}>
          Tokens
        </Link>
 
        <Link href="/activity" className={styles.tokensButton}>
          Activity
        </Link>


        <Link href="/transaction" className={styles.tokensButton}>
          Transactions
        </Link>
      </div>

  




   
    </div>
  );
}
