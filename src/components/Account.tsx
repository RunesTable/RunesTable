import React, { useContext, useState, useEffect } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { WalletContext } from "@/functions/WalletContext";
import styles from "@/styles/Account.module.css";
import { IoChevronDown,IoChevronUp } from "react-icons/io5";
import {BsCheck} from "react-icons/bs";

export default function Account() {

    const { wallet, openModal, disconnect, changeNetwork, ellipseAddress } =
    useContext(WalletContext);
    const [menu,setMenu]=useState(false);
    const [isHashiconClicked, setIsHashiconClicked] = useState(false);

  async function toggleNetwork() {
    if (wallet.network === "signet") {
      changeNetwork("mainnet");
    } else if (wallet.network === "mainnet" || wallet.network === "livenet") {
      changeNetwork("testnet");
    } else if(wallet.network === "testnet"){
      changeNetwork("signet");
    }
  }

  function toggleMenu(){
    setMenu(!menu);
  }
  function connect() {
      openModal()
  }


  function copyClipboard() {
    if (wallet.connect) {
        navigator.clipboard.writeText(wallet.address)
        setIsHashiconClicked(true);
        setTimeout(() => {
            setIsHashiconClicked(false);
        }, 500);
    }
}


  return (
    <div className={styles.account_wrapper} >
        {wallet.load || !wallet.connect?
            <button className={styles.connect} disabled={wallet.load} onClick={connect}>{!wallet.load?"Connect":"Loading"}</button>
        :

            <>
             <button className={styles.account} disabled={wallet.load} onClick={toggleMenu}>
             <div className={`${styles.iconContainer} ${isHashiconClicked ? styles.grayFilter : ''}`} onClick={copyClipboard}>
  <Hashicon value={wallet.address} size={27} />
  {isHashiconClicked && <BsCheck className={styles.checkIcon} />}
</div>

          <div>{ellipseAddress()}</div>
          {menu ? <IoChevronUp/> : <IoChevronDown/>}
        </button>

            <div className={menu?styles.menu_open:styles.menu_close}>
              <button  disabled={wallet.load} onClick={toggleNetwork}>
                {wallet.load ? "Loading" :wallet.network}
              </button>
             <button disabled={wallet.load} onClick={disconnect}>
                  Disconnect
              </button>
              </div>
              
            </>
    
            }

        </div>
  )
}
