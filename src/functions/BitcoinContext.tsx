import React from 'react'
import {networks,Network} from "bitcoinjs-lib";

const signet:Network = {
    messagePrefix: '\x18Bitcoin Signed Message with Signet:\n',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
  };

  

export interface IBtc {
    network:Network;
    utxo:Array<any>
  
}

const useValue = () => {
    const [btc,setBtc]= React.useState<IBtc>({
        network:networks.bitcoin,
        utxo:[],
    })
       
    let baseMempoolUrl = btc.network==networks.bitcoin?"https://mempool.space":btc.network==networks.testnet?"https://mempool.space/testnet":btc.network==signet?"https://mempool.space/signet":""
    let baseMempoolApiUrl = `${baseMempoolUrl}/api`;
    let ordinalsExplorerUrl =btc.network==networks.bitcoin?"https://ordinals.com":btc.network==networks.testnet?"":btc.network==signet?"https://explorer-signet.openordex.org":""
    let urlFees= `${baseMempoolApiUrl}/v1/fees/recommended` 

    

    async function changeBtcNetwork(network:string){
        if(network==="mainnet" || network==="testnet" || network==="signet"){
           
                if(network==="signet"){
                    setBtc({...btc,network:signet})
                }else if(network==="testnet"){
                    setBtc({...btc,network:networks.testnet})
                }else if(network==="mainnet"){
                    setBtc({...btc,network:networks.bitcoin})
                }
           
        }else{
            console.error("the network specified isn't supported")
        }
    }

    async function getTxTypeById(id:any,vout:number){
        const data= await fetch(`${baseMempoolApiUrl}/tx/${id}`)
         .then(async response =>  {
           return await response.json()  
         })
         return data.vout[vout].scriptpubkey_type
       }

    async function getAddressUtxos(_address:string) {
        return await fetch(`${baseMempoolApiUrl}/address/${_address}/utxo`)
            .then(async response =>  {
              return await response.json()  
            })
           
        }

    

    async function doesUtxoContainInscription(utxo:any) {
        const html = await fetch(`${ordinalsExplorerUrl}/output/${utxo.txid}:${utxo.vout}`)
            .then(async response => await response.text())
      
        return await html.match(/class=thumbnails/)!== null
      }
      
      async function getInscriptionIdFromUtxo(utxo:any) {
        const html = await fetch(`${ordinalsExplorerUrl}/output/${utxo.txid}:${utxo.vout}`)
            .then(async response => await response.text())
            //@ts-ignore
        return html.match(/href=\/inscription\/([0-9a-zA-Z_])+/)[0].split('/')[2]
      }



    async function getFees(){
        const html = await fetch(`${urlFees}`)
            .then(async response => await response.json())
      
        return html
      }


    async function fetchUtxo(address:any){
        const data=await getAddressUtxos(address)
        for(let i=0; i<data.length; i++){
          console.log(data[i])
          let inscription={contains:false,id:""}
            const type=await getTxTypeById(data[i].txid,data[i].vout)
            inscription.contains=await doesUtxoContainInscription(data[i]);
            if(await doesUtxoContainInscription(data[i])){
              inscription.id=await getInscriptionIdFromUtxo(data[i]); 
            }
            data[i].type=type;
            data[i].inscription=inscription;
         }
         setBtc({...btc,utxo:data})
      }

    return {
        btc,
        changeBtcNetwork,
        getFees,
        getInscriptionIdFromUtxo,
        doesUtxoContainInscription,
        getAddressUtxos,
        getTxTypeById,
        fetchUtxo,
    }
}

export const BitcoinContext = React.createContext({} as ReturnType<typeof useValue>)

export const BitcoinContextProvider: React.FC<React.PropsWithChildren<any>> = (props) => {
    return (
        <BitcoinContext.Provider value={useValue()}>
            {props.children}
        </BitcoinContext.Provider>
    )
}
