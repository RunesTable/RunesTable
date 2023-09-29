import React,{use, useContext, useEffect} from 'react'
import {stringify} from 'flatted';
import {Token, FirebaseContext } from '@/functions/FirebaseContext';
import { watch } from 'fs';
import { set } from 'firebase/database';
import { BitcoinContext } from './BitcoinContext';
import { Network } from 'bitcoinjs-lib/src/types';

declare global {
    interface Window{
      xverse?:BitcoinProvider;
      unisat?:BitcoinProvider;
      ordinalSafe?:BitcoinProvider;
      hiro?:BitcoinProvider;
    }
  }


export interface BitcoinProvider{
    getAccounts:Function;
    requestAccounts:Function;
    getBalance:Function;
}


export interface IWallet {
    install:{xverse:boolean,unisat:boolean,ordinalSafe:boolean,hiro:boolean};
    walletType:string;
    load:boolean;
    modal:boolean;
    error:boolean;
    provider:any;
    connect:boolean;
    address:string;
    pubkey:string;
    network:string;
    balance:{confirmed:number,unconfirmed:number,total:number};
    forceDisconnect:boolean,
}

const useValue = () => {
    const {db,signIn}=useContext(FirebaseContext);
    const {btc,changeBtcNetwork,getAddressUtxos,getTxTypeById,getInscriptionIdFromUtxo,doesUtxoContainInscription,fetchUtxo}=useContext(BitcoinContext);
    const [wallet,setWallet]= React.useState<IWallet>({install:{xverse:false,unisat:false,ordinalSafe:false,hiro:false},walletType:"",load:false,modal:false,error: false,provider:{},connect:false,address:"",pubkey:"",network:"mainnet",balance:{confirmed:0,unconfirmed:0,total:0},forceDisconnect:false})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(()=>{updateWallet(window)},[wallet.connect,wallet.walletType])

    React.useEffect(()=>{
        fetchUtxo(wallet.address)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[wallet.address,wallet.network])



    async function updateWallet(window:any){

        setWallet(prevWallet =>{return {
                ...prevWallet,
                load: true
        }});
        let _wallet=wallet;
        if(window.BitcoinProvider!==undefined && window.BitcoinProvider!==null){
            _wallet.install ={..._wallet.install,xverse:true}
            if(_wallet.walletType==="xverse"){
                _wallet.provider=window.BitcoinProvider
                if(_wallet.connect){
                    
                }else{ 
                    try{
                        await _wallet.provider.connect()
                        _wallet.connect=true;
                        _wallet.modal=false;
                    }catch(e:any){
                        _wallet.connect=false;
                        _wallet.error=true;
                        console.error(e)
                    }

                }
            }
           
        }
        if(window.unisat!==undefined && window.unisat!==null){
            _wallet.install ={..._wallet.install,unisat:true}
            if(_wallet.walletType==="unisat"){
                _wallet.provider=window.unisat
                _wallet.provider.on("accountsChanged",()=>{updateWallet(window);})
                _wallet.provider.on("chainChanged",()=>{updateWallet(window);})
                if(_wallet.connect){
                    const accounts = await  _wallet.provider.getAccounts();
                    if (accounts.length > 0) {
                        // const _balance = await  _wallet.provider.getBalance();
                        // console.log("_balance unisat",_balance)
                        const _pubkey=await  _wallet.provider.getPublicKey()
                        const _network=await _wallet.provider.getNetwork();
                        _wallet.connect=true;
                        _wallet.modal=false;
                        _wallet.network=_network;
                        _wallet.address=accounts[0];
                        // _wallet.balance=_balance;
                        _wallet.pubkey=_pubkey;
                    }
                    if(_wallet.pubkey!=="" && _wallet.pubkey!==null && _wallet.pubkey!==undefined && Object.keys(_wallet.provider).length!==0 && _wallet.provider!==null && _wallet.provider!==undefined && _wallet.address!=="" && _wallet.address!==null && _wallet.address!==undefined){
                        const sig=await _wallet.provider.signMessage(_wallet.address)
                            try{
                                await signIn(_wallet.address,_wallet.pubkey,sig)
                            }catch(e){
                                await disconnect();
                                console.error(e)
                                _wallet.error=true;
                            }
                    }
                }else{
                    try{
                        await _wallet.provider.requestAccounts()
                        _wallet.connect=true;
                        _wallet.modal=false;
                    }catch(e:any){
                        await disconnect();
                        _wallet.connect=false;
                        _wallet.error=true;
                        console.error(e)
                    }
                   
                }
            }
          
        }
        if(window.HiroWalletProvider!==undefined && window.HiroWalletProvider!==null){
            _wallet.install ={..._wallet.install,hiro:true}
            if(_wallet.walletType==="hiro"){
                _wallet.provider=window.HiroWalletProvider
                if(_wallet.connect){
                    
                }else{
                    try{
                        await _wallet.provider.authenticationRequest()
                        _wallet.connect=true;
                        _wallet.modal=false;
                    }catch(e:any){
                        _wallet.connect=false;
                        _wallet.error=true;
                        console.error(e)
                    }
                }
            }
            
        }
        if(window.ordinalSafe!==undefined && window.ordinalSafe!==null){
             _wallet.install ={..._wallet.install,ordinalSafe:true}
            if(_wallet.walletType==="ordinalSafe"){
                 _wallet.provider=window.ordinalSafe
                if(_wallet.connect){
                    const accounts=await _wallet.provider.requestAccounts()
                    if (accounts.length > 0) {
                        const _balance = await _wallet.provider.getBalance();
                        _wallet.connect=true;
                        _wallet.modal=false;
                        _wallet.address=accounts[0];
                        _wallet.balance=_balance;
                    }
                }else{
                    try{
                        await _wallet.provider.requestAccounts()
                        _wallet.connect=true;
                        _wallet.modal=false;
                    }catch(e:any){
                        await disconnect();
                        _wallet.connect=false;
                        _wallet.error=true;
                        console.error(e)
                    }
                }
            }
            
        } 
        //quick connect supported by unisat for now   
        if(_wallet.walletType==="" && !_wallet.forceDisconnect){
            if(_wallet.install.unisat){
                const accounts=await window.unisat.getAccounts();
                if(accounts.length>0){
                    _wallet.walletType="unisat";
                    _wallet.connect=true;
                    _wallet.modal=false;
                }
            }
        }

        setWallet(prevWallet =>{return {
            ...prevWallet,
            ..._wallet,
            load: false,
            modal:false,
    }});

}

    async function signPsbt(psbt:string){
        let psbtHex=""
        if(wallet.connect && !wallet.load){
            if(wallet.walletType==="unisat"){
                psbtHex=await wallet.provider.signPsbt(psbt,{autoFinalized:false})
            }else if(wallet.walletType==="hiro"){
                console.log("Wallet not supported yet")
            }else if(wallet.walletType==="ordinalSafe"){
                console.log("Wallet not supported yet")
            }else if(wallet.walletType==="xverse"){
                console.log("Wallet not supported yet")
            }
          
        }else{
            console.log("please connect")
        }
       return psbtHex
    }
    
    async function setWalletType(type:string){
        if(type==="xverse" || type==="unisat" || type==="hiro" ||  type==="ordinalSafe"){
            setWallet(prevWallet=>{return {...prevWallet,walletType:type}})
        }else{
            setWallet(prevWallet=>{return {...prevWallet,error:true}})
            console.error("the wallet specified doesn't exist")
        }
    }

    async function disconnect(){
        const emptyWallet={walletType:"",load:false,modal:false,error: false,provider:{},connect:false,address:"",pubkey:"",network:"mainnet",balance:{confirmed:0,unconfirmed:0,total:0},forceDisconnect:true};
        setWallet(prevWallet=>{return {...prevWallet,...emptyWallet}})

    }

    async function changeNetwork(network:string){
        if(network==="mainnet" || network==="testnet" || network==="signet"){
            if(wallet.walletType==="unisat"){
                if(network==="signet"){
                    await wallet.provider.switchNetwork("testnet")
                    console.error("Signet is currently not fully supported by Unisat wallet")
                }else{
                    await wallet.provider.switchNetwork(network)
                }
                setWallet(prevWallet=>{return {...prevWallet,network:network}})
                changeBtcNetwork(network)
            }else if(wallet.walletType===""){
                setWallet(prevWallet=>{return {...prevWallet,network:network}})
                changeBtcNetwork(network)
            }else{
                console.error("changing network is currently not supported by "+wallet.walletType)
            }
        }else{
            console.error("the network specified isn't supported")
        }
    }

    useEffect(()=>{
        if(wallet.network==="mainnet" || wallet.network==="testnet" || wallet.network==="signet"){
                changeBtcNetwork(wallet.network)
        }else{
            console.error("the network specified isn't supported")
        }
    },[wallet.network])

    function ellipseAddress (){
        return wallet.address.slice(0,3) + "..." + wallet.address.slice(-4)
    }

    function openModal() {
        setWallet(prevWallet=>{return {...prevWallet,modal:true}})
      }
    
      function closeModal() {
        setWallet(prevWallet=>{return {...prevWallet,modal:false}})
      }

   
    return {
        wallet,
        updateWallet,
        setWalletType,
        disconnect,
        changeNetwork,
        ellipseAddress,
        openModal,
        closeModal,
        signPsbt
    }
}

export const WalletContext = React.createContext({} as ReturnType<typeof useValue>)

export const WalletContextProvider: React.FC<React.PropsWithChildren<any>> = (props) => {
    
    return (
        <WalletContext.Provider value={useValue()}>
            {props.children}
        </WalletContext.Provider>
    )
}
