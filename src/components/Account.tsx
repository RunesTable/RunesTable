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
  <div className="flex flex-row justify-end items-center w-1/3 h-12">
    {wallet.load || !wallet.connect ? (
      <button
        className="bg-gradient-to-r from-[#your-start-color] to-[#DB2180] h-12 w-40"
        disabled={wallet.load}
        onClick={connect}
      >
        {!wallet.load ? "Connect" : "Loading"}
      </button>
    ) : (
      <>
        <button
          className="bg-black border border-gray-600 w-40 h-12 flex flex-row justify-around items-center"
          disabled={wallet.load}
          onClick={toggleMenu}
        >
          <div
            className={`relative inline-block w-7 h-7 ${isHashiconClicked ? "filter grayscale" : ""}`}
            onClick={copyClipboard}
          >
            <Hashicon value={wallet.address} size={27} />
            {isHashiconClicked && <BsCheck className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10" />}
          </div>
          <div>{ellipseAddress()}</div>
          {menu ? <IoChevronUp /> : <IoChevronDown />}
        </button>

        <div
          className={`${
            menu ? "flex" : "hidden"
          } bg-black border border-gray-600 rounded-lg flex-col justify-around items-center absolute top-20 w-40 h-24 z-20`}
        >
          <button disabled={wallet.load} onClick={toggleNetwork}>
            {wallet.load ? "Loading" : wallet.network}
          </button>
          <button disabled={wallet.load} onClick={disconnect}>
            Disconnect
          </button>
        </div>
      </>
    )}
  </div>
);
}
