import {toXOnly} from "bitcoinjs-lib/src/psbt/bip371";
import * as bitcoin from 'bitcoinjs-lib';

function hexEncode(subject:string){
  var hex, i;

  var result = "";
  for (i=0; i<subject.length; i++) {
      hex = subject.charCodeAt(i).toString(16);
      result += ("000"+hex).slice(-4);
  }

  return result
}

const P2PKH_IN_SIZE = 148;
const P2PKH_OUT_SIZE = 34;
const P2SH_P2WPKH_OUT_SIZE =32;
const P2SH_P2WSH_OUT_SIZE =32;
const P2SH_OUT_SIZE =  32;

// All segwit input sizes are reduced by 1 WU to account for the witness item counts being added for every input per the transaction header
const P2SH_P2WPKH_IN_SIZE = 90.75;

const P2WPKH_IN_SIZE = 67.75;
const P2WPKH_OUT_SIZE = 31;

const P2WSH_OUT_SIZE =  43;
const P2TR_OUT_SIZE= 43;
const P2TR_IN_SIZE = 57.25;
const P2TR_IN_SIZE_SCRIPT = 41.75;

const PUBKEY_SIZE = 33;
const SIGNATURE_SIZE = 72;

function getSizeOfScriptLengthElement(length:number) {
  if (length < 75) {
    return 1;
  } else if (length <= 255) {
    return 2;
  } else if (length <= 65535) {
    return 3;
  } else if (length <= 4294967295) {
    return 5;
  } else {
    alert('Size of redeem script is too large');
  }
}

function getSizeOfVarInt(length:number) {
  if (length < 253) {
    return 1;
  } else if (length < 65535) {
    return 3;
  } else if (length < 4294967295) {
    return 5;
  } else if (length < 18446744073709551615) {
    return 9;
  } else {
    alert("Invalid var int");
  }
}

function getTxOverheadVBytes(input_script:string, input_count:number, output_count:number) {
  if (input_script == "p2pkh" || input_script == "p2sh") {
    var witness_vbytes = 0;
  } else { // Transactions with segwit inputs have extra overhead
    var witness_vbytes = 0.25                 // segwit marker
                      + 0.25                  // segwit flag
                      + input_count / 4;      // witness element count per input
  }

  return 4 // nVersion
  //@ts-ignore
        + getSizeOfVarInt(input_count) // number of inputs
        //@ts-ignore
        + getSizeOfVarInt(output_count) // number of outputs
        + 4 // nLockTime
        + witness_vbytes;
}

function getTxOverheadExtraRawBytes(input_script:string, input_count:number) {
  // Returns the remaining 3/4 bytes per witness bytes
  if (input_script == "p2pkh" || input_script == "p2sh") {
    var witness_bytes = 0;
  } else { // Transactions with segwit inputs have extra overhead
    var witness_bytes = 0.25             // segwit marker
                     + 0.25              // segwit flag
                     + input_count / 4;  // witness element count per input
  }

  return witness_bytes * 3;
}

 //doesn't support multisig
 //is approximative in most of the case
 // Input script type :
//p2pkh,p2sh,v0_p2wpkh,v0_p2wsh,v1_p2tr, if nested : p2sh and nestedSegwit="p2wsh" || "p2wpkh"
// if taproot : p2tr_type="key"||"script" 
// Number of inputs; Input script type; Signatures per input m; Pubkeys per input n; P2PKH outputs; P2SH outputs; P2WPKH in P2SH outputs; P2WSH in P2SH outputs; P2WPKH outputs; P2WSH outputs; P2TR outputs;
export default function calculateTxSize(input_count:number,input_script:string,{p2tr_type="",script="",content="",pubkey="",nestedSegwit="",input_m=1,input_n=1,p2pkh_output_count=0,p2sh_output_count=0,p2sh_p2wpkh_output_count=0,p2sh_p2wsh_output_count=0,p2wpkh_output_count=0,p2wsh_output_count=0,p2tr_output_count=0}:{p2tr_type?:string,script?:string,content?:string,pubkey?:string,nestedSegwit?:string,input_m?:number,input_n?:number,p2pkh_output_count?:number,p2sh_output_count?:number,p2sh_p2wpkh_output_count?:number,p2sh_p2wsh_output_count?:number,p2wpkh_output_count?:number,p2wsh_output_count?:number,p2tr_output_count?:number}) {
  // Validate transaction input attributes
  if (!Number.isInteger(input_count) || input_count < 0) {
    alert('expecting positive input count, got: ' + input_count);
    return;
  }
  if (!Number.isInteger(input_m) || input_m < 0) {
    alert('expecting positive signature count');
    return;
  }

  if (!Number.isInteger(input_n) || input_n < 0) {
    alert('expecting positive pubkey count');
    return;
  }

  // Validate transaction output attributes
  if (!Number.isInteger(p2pkh_output_count) || p2pkh_output_count < 0) {
    alert('expecting positive p2pkh output count');
    return;
  }

  if (!Number.isInteger(p2sh_output_count) || p2sh_output_count < 0) {
    alert('expecting positive p2sh output count');
    return;
  }

  if (!Number.isInteger(p2sh_p2wpkh_output_count) || p2sh_p2wpkh_output_count < 0) {
    alert('expecting positive p2sh-p2wpkh output count');
    return;
  }
  if (!Number.isInteger(p2sh_p2wsh_output_count) || p2sh_p2wsh_output_count < 0) {
    alert('expecting positive p2sh-p2wsh output count');
    return;
  }

  if (!Number.isInteger(p2wpkh_output_count) || p2wpkh_output_count < 0) {
    alert('expecting positive p2wpkh output count');
    return;
  }
  if (!Number.isInteger(p2wsh_output_count) || p2wsh_output_count < 0) {
    alert('expecting positive p2wsh output count');
    return;
  }
  if (!Number.isInteger(p2tr_output_count) || p2tr_output_count < 0) {
    alert('expecting positive p2tr output count');
    return;
  }

  const output_count = p2pkh_output_count + p2sh_output_count + p2sh_p2wpkh_output_count
                      + p2sh_p2wsh_output_count + p2wpkh_output_count + p2wsh_output_count + p2tr_output_count;

  // In most cases the input size is predictable. For multisig inputs we need to perform a detailed calculation
  var inputSize = 0; // in virtual bytes
  var inputWitnessSize = 0;
  switch (input_script) {
    case "p2pkh":
      inputSize = P2PKH_IN_SIZE;
      break;
    case "v0_p2wpkh":
      inputSize = P2WPKH_IN_SIZE;
      inputWitnessSize = 107; // size(signature) + signature + size(pubkey) + pubkey
      break;
    case "v1_p2tr": // Only consider the cooperative taproot signing path; assume multisig is done via aggregate signatures
      if(p2tr_type==="key"){
      inputSize = P2TR_IN_SIZE;
      inputWitnessSize = 65; // getSizeOfVarInt(schnorrSignature) + schnorrSignature;
      }else if(p2tr_type==="script"){
        if((content==="" || pubkey==="") && (script==="" || pubkey==="")){
          console.log("content",content)
          console.log("pubkey",pubkey)
          console.log("pubkey",pubkey)
          throw "Impossible to calculate the inscription fees";
        }else{
          if(content!==""){
           inputSize = P2TR_IN_SIZE_SCRIPT;
          const leafScriptAsm = `${toXOnly(Buffer.from(pubkey,"hex")).toString("hex")} OP_CHECKSIG OP_FALSE OP_IF ${hexEncode("ord")} OP_1 ${hexEncode("text/plain;charset=utf-8")} OP_0 ${hexEncode(content)} OP_ENDIF`;
          const leafScript = bitcoin.script.fromASM(leafScriptAsm);
    
          const input=128/2;
          const inscriptionScriptSize=(leafScript.toString("hex").length)/2;
         const controlBlockSize=66/2;
          inputWitnessSize = input+inscriptionScriptSize+controlBlockSize; // getSizeOfVarInt(schnorrSignature) + schnorrSignature;
          }else if (script!==""){
            inputSize = P2TR_IN_SIZE_SCRIPT;
          const input=128/2;
          const inscriptionScriptSize=script.length;
         const controlBlockSize=66/2;
          inputWitnessSize = input+inscriptionScriptSize+controlBlockSize; // getSizeOfVarInt(schnorrSignature) + schnorrSignature;
          }
        }
       
      }
      break;
    case "p2sh":
      if(nestedSegwit!==""){
        if(nestedSegwit=="p2wpkh"){
        inputSize = P2SH_P2WPKH_IN_SIZE;
        inputWitnessSize = 107; // size(signature) + signature + size(pubkey) + pubkey
        break;
        }else if(nestedSegwit=="p2wsh"){
          var redeemScriptSize = 1 + // OP_M
          input_n*(1 + PUBKEY_SIZE) + // OP_PUSH33 <pubkey>
          1 + // OP_N
          1; // OP_CHECKMULTISIG
          inputWitnessSize = 1 + // size(0)
            input_m * (1 + SIGNATURE_SIZE) + // size(SIGNATURE_SIZE) + signature
            //@ts-ignore
            getSizeOfScriptLengthElement(redeemScriptSize) + redeemScriptSize;
          inputSize = 36 + // outpoint (spent UTXO ID)
          inputWitnessSize / 4 + // witness program
          4;  // nSequence
          inputSize += 32 + 3; // P2SH wrapper (redeemscript hash) + overhead?
        break;
        }
      }else{
      var redeemScriptSize = 1 + // OP_M
                            input_n*(1 + PUBKEY_SIZE) + // OP_PUSH33 <pubkey>
                            1 + // OP_N
                            1; // OP_CHECKMULTISIG
      var scriptSigSize = 1 + // size(0)
                        input_m * (1 + SIGNATURE_SIZE) + // size(SIGNATURE_SIZE) + signature
                        //@ts-ignore
                        getSizeOfScriptLengthElement(redeemScriptSize) + redeemScriptSize;
                        //@ts-ignore
      inputSize = 32 + 4 + getSizeOfVarInt(scriptSigSize) + scriptSigSize + 4;
      }
      break;       
    case "v0_p2wsh":
      var redeemScriptSize = 1 + // OP_M
                            input_n*(1 + PUBKEY_SIZE) + // OP_PUSH33 <pubkey>
                            1 + // OP_N
                            1; // OP_CHECKMULTISIG
      inputWitnessSize = 1 + // size(0)
                        input_m * (1 + SIGNATURE_SIZE) + // size(SIGNATURE_SIZE) + signature
                        //@ts-ignore
                        getSizeOfScriptLengthElement(redeemScriptSize) + redeemScriptSize;
      inputSize = 36 + // outpoint (spent UTXO ID)
                  inputWitnessSize / 4 + // witness program
                  4;  // nSequence
  }

 
  var txVBytes = getTxOverheadVBytes(input_script, input_count, output_count) +
  inputSize * input_count +
  P2PKH_OUT_SIZE * p2pkh_output_count +
  P2SH_OUT_SIZE * p2sh_output_count +
  P2SH_P2WPKH_OUT_SIZE * p2sh_p2wpkh_output_count +
  P2SH_P2WSH_OUT_SIZE * p2sh_p2wsh_output_count +
  P2WPKH_OUT_SIZE * p2wpkh_output_count +
  P2WSH_OUT_SIZE * p2wsh_output_count +
  P2TR_OUT_SIZE * p2tr_output_count;

  if(input_script==="v1_p2tr" && p2tr_type==="script"){
    txVBytes=getTxOverheadVBytes(input_script, input_count, output_count)+  inputSize * input_count+inputWitnessSize * input_count/4
    +P2PKH_OUT_SIZE * p2pkh_output_count +
    P2SH_OUT_SIZE * p2sh_output_count +
    P2SH_P2WPKH_OUT_SIZE * p2sh_p2wpkh_output_count +
    P2SH_P2WSH_OUT_SIZE * p2sh_p2wsh_output_count +
    P2WPKH_OUT_SIZE * p2wpkh_output_count +
    P2WSH_OUT_SIZE * p2wsh_output_count +
    P2TR_OUT_SIZE * p2tr_output_count;
  }
  txVBytes = Math.ceil(txVBytes);

  var txBytes = getTxOverheadExtraRawBytes(input_script, input_count) + txVBytes + (inputWitnessSize * input_count) * 3 / 4;
  var txWeight = txVBytes * 4;

  return {vbytes:txVBytes,bytes:txBytes,weight:txWeight}
}