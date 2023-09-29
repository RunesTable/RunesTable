import React from 'react'
import firebase,{getApps, initializeApp,FirebaseApp} from "firebase/app";
import {getFirestore, collection, doc,getDoc,setDoc, onSnapshot, Firestore, Query, DocumentData, QueryConstraint, Unsubscribe,where,limit, orderBy,startAfter, getDocs, QuerySnapshot} from "firebase/firestore";
import {getDatabase,Database,ref, onValue,onChildAdded ,orderByValue,onChildRemoved,orderByChild,equalTo} from "firebase/database";
import {Auth, Config, getAuth ,signInWithEmailAndPassword,User,createUserWithEmailAndPassword,signInWithCustomToken} from "firebase/auth";
import {query  as firestoreQuery} from "firebase/firestore";
import {query as databaseQuery}  from "firebase/database";
import {httpsCallable,Functions, getFunctions,HttpsCallable} from "firebase/functions"
import {getAnalytics} from "firebase/analytics";
import {getPerformance} from "firebase/performance";
import { error } from 'console';

export interface Token{
collection:null;
content_type:String;
escrow:null;
id:String;
meta:null;
num:number;
brc20:Boolean;
content:{tick:string,[key:string]:any};
metadata:Object;
}


export interface ICollection<DataType>{
    cursor: number| Token | null;
    data:Array<DataType>
    }

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY?process.env.NEXT_PUBLIC_API_KEY:"",
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN?process.env.NEXT_PUBLIC_AUTH_DOMAIN:"",
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID?process.env.NEXT_PUBLIC_PROJECT_ID:"",
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET?process.env.NEXT_PUBLIC_STORAGE_BUCKET:"",
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID?process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID:"",
    appId: process.env.NEXT_PUBLIC_APP_ID?process.env.NEXT_PUBLIC_APP_ID:"",
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID?process.env.NEXT_PUBLIC_MEASUREMENT_ID:"",
    databaseURL:process.env.NEXT_PUBLIC_DATABASE_URL?process.env.NEXT_PUBLIC_DATABASE_URL:"",
};


export interface IDB {
    firebaseApp:FirebaseApp;
    firestore:Firestore;
    database:Database;
    auth:Auth;
    functions:Functions;
    user:User;
    brc:ICollection<Token> & {cursor:number|Token|null};
    
}

const useValue = () => {
    const [db,setDb]= React.useState<IDB>({
        firebaseApp:{name:"none",automaticDataCollectionEnabled:false,options:firebaseConfig},
        firestore:{type:"firestore",app:{name:"none",automaticDataCollectionEnabled:false,options:firebaseConfig},toJSON:()=>{return {}}},
        database: {app: {name:"none",automaticDataCollectionEnabled:false,options:firebaseConfig},'type':"database",},
        //@ts-ignore
        auth:{app:{name:"none",automaticDataCollectionEnabled:false,options:firebaseConfig},name:"",config:{apiKey: "",apiHost:"",apiScheme: "",tokenApiHost: "",sdkClientVersion:"",authDomain:""},languageCode:null,tenantId:null,settings:{appVerificationDisabledForTesting:false},currentUser:null,emulatorConfig:null,setPersistence:async ()=>{},onAuthStateChanged:()=>{},beforeAuthStateChanged:()=>{},onIdTokenChanged:()=>{},updateCurrentUser:async ()=>{},useDeviceLanguage:()=>{},signOut:async ()=>{}},
        functions:{app:{name:"none",automaticDataCollectionEnabled:false,options:firebaseConfig},region:"",customDomain:""},
        //@ts-ignore
        user:{},
        brc:{cursor:null,data:[]},
      })
    
    React.useEffect(()=>{ 
        initFirebase();
        const unmount= initFetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

 
   function initFirebase(){
        if(db.firebaseApp.name==="none"){
            const _firebaseApp=initializeApp(firebaseConfig);
            db.firebaseApp=_firebaseApp;
            setDb(db);
            const _functions=getFunctions(db.firebaseApp);
            db.functions=_functions;
            setDb(db)
            const _auth=getAuth(db.firebaseApp);
            db.auth=_auth;
            setDb(db)
            const _firestore= getFirestore(db.firebaseApp);
            db.firestore=_firestore;
            setDb(db);
            const _database = getDatabase(db.firebaseApp);
            db.database=_database;
            setDb(db);
            if(typeof window !== 'undefined'){
                if('measurementId' in firebaseConfig){
                    getPerformance(_firebaseApp)
                    getAnalytics(_firebaseApp)
                }
            }
            console.log('Firebase was successfully init')
        }
    }

    /* FUNCTIONS */
    async function buyMarket(id:string,price:number,size:number,address:string){
        const buyMarket:HttpsCallable<unknown, string>=httpsCallable(db.functions,"buyMarket");
        const args={tokenID:id,price:price,size:size,address:address}
        try{
           const result =await buyMarket(args)
            console.log(result)
        }catch(error){
            console.error(error)
        }
    }

    async function sellMarket(id:string,price:number,size:number,address:string){
        const sellMarket:HttpsCallable<unknown, string>=httpsCallable(db.functions,"sellMarket");
        const args={tokenID:id,price:price,size:size,address:address}
        try{
           const result =await sellMarket(args)
            console.log(result)
        }catch(error){
            console.error(error)
        }
    }

    async function buyLimit(id:string,price:number,size:number,address:string){
        const buyLimit:HttpsCallable<unknown, string>=httpsCallable(db.functions,"buyLimit");
        const args={tokenID:id,price:price,size:size,address:address}
        try{
           const result =await buyLimit(args)
            console.log(result)
        }catch(error){
            console.error(error)
        }
    }

    async function sellLimit(id:string,price:number,size:number,address:string){
        const sellLimit:HttpsCallable<unknown, string>=httpsCallable(db.functions,"sellLimit");
        const args={tokenID:id,price:price,size:size,address:address}
        try{
           const result =await sellLimit(args)
            console.log(result)
        }catch(error){
            console.error(error)
        }
    }

    async function requestInscribe(address:string,fee:number,content:string,network:string){
        const requestInscribe:HttpsCallable<unknown, string>=httpsCallable(db.functions,"requestInscribe");
        const args={fee:fee,content:content,address:address,network:network}
        try{
           const result =await requestInscribe(args)
            return result
        }catch(error){
            console.error(error)
        }
    }

    async function broadcastInscribe(address:string,psbt:string){
        const broadcastInscribe:HttpsCallable<unknown, string>=httpsCallable(db.functions,"broadcastInscribe");
        const args={address:address,psbt:psbt}
        try{
           const result =await broadcastInscribe(args)
            return result
        }catch(error){
            console.error(error)
        }
    }

    async function getToken(address:string,pubkey:string,sig:string){
        let token=""
        const generateUserToken:HttpsCallable<unknown, string>=httpsCallable(db.functions,"generateUserToken");
        const args={address:address,pubkey:pubkey,sig:sig}
        try{
           const result =await generateUserToken(args)
            token=result.data
            return token
        }catch(error){
            console.error(error)
        }
    }


    /* AUTHENTICATION*/
    async function signIn(address:string,pubkey:string,sig:string){  
        try{
            const token = await getToken(address,pubkey,sig)
            if(token){
                await signInWithCustomToken(db.auth,token.toString())
                .then((userCredential) => {
                    const user = userCredential.user;
                    db.user=user
                    setDb(db);
                    console.log(user);
                })
                .catch((error) => {
                    console.error(error)
                })
            }
        }catch(error){
            console.error(error)
        }
    }
    
    /* CLOUD FIRESTORE */
     /* permet de récuperer n'importe quelle collection de cloud firestore avec contraintes et les synchonise avec le state, en temps reel  */ 
    function stageQueryCollection(_collection:string,queryConstraints:QueryConstraint[],_orderBy:string,_limit:number=5){
        if(db.firebaseApp.name!=="none"){
            const firestore=getFirestore(db.firebaseApp);
            const collectionRef=collection(firestore,_collection);
            //@ts-ignore
            const querySnap:Query<DocumentData>=firestoreQuery(collectionRef,...queryConstraints,orderBy(_orderBy),startAfter(db[_collection as keyof IDB].cursor || 0),limit(_limit));
            const unmountSnapshot=onSnapshot(querySnap, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    //@ts-ignore
                    db[_collection as keyof IDB].data.push(doc.data());
                });
                //@ts-ignore
                db[_collection as keyof IDB].cursor = db[_collection as keyof IDB].data[db[_collection as keyof IDB].data.length - 1][_orderBy];
                setDb(db);
            })
            return unmountSnapshot;

        }
    }
    /* permet de récuperer n'importe quelle collection de cloud firestore avec contraintes sans synchoniser le state en temps reel */
    async function getQueryCollection(_collection:string,queryConstraints:QueryConstraint[],_orderBy:string,callback:Function,_startAfter:number=0,_limit:number=5){
        if(db.firebaseApp.name!=="none"){
            const firestore=getFirestore(db.firebaseApp);
            const collectionRef=collection(firestore,_collection);
            //@ts-ignore
            const querySnap:Query<DocumentData>=firestoreQuery(collectionRef,...queryConstraints,orderBy(_orderBy),startAfter(_startAfter || 0),limit(_limit));
            const unmountSnapshot= onSnapshot(querySnap, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    callback(doc.data(),doc.id);
                });
            })
            return unmountSnapshot;

        }
    }

       
       
    /* initialise l'ensemble des listerner; pour l'instant uniquement le listener de brc*/ 
    function initFetch() {
        const unmountListeners:Unsubscribe | undefined= fetchToken();
        return unmountListeners;
    }

     /* recupère les 10 prochains élements de la collection brc et les synchonise avec le state */ 
    function fetchToken(_limit:number=10){
        /* Number : 50 -> more fluide scroll*/
        const unmountListeners:Unsubscribe | undefined=stageQueryCollection("brc",[],"num",_limit);
        return unmountListeners;
    }

    /* permet de récuperer un element de la collection brc ayant le bon id sans synchoniser le state*/
    async function getDeploy(id:string,callback:Function){
        const resultArray=await getQueryCollection("brc",[where("id","==",id)],"num",callback,0,1);
        return resultArray;
    }

     /*  permet de récuperer n'importe quelle token commencant avec un string de cloud firestore avec contraintes sans synchoniser le state, pas en temps reel */
     /* start cursor is the tick of element that the want to fetch after : 
     database : abcd,abce,abcf,abcg,abch
      getTokenStartWith("abc",3,(data,id)=>{...}) -> abcd,abce,abcf
      getTokenStartWith("abc",3,(data,id)=>{...},abce) -> abcf,abcg,abch */
     async function getTokenStartWith(_startWith:string,numberResult:number,callback:Function,startCursor:string=""){
        if(db.firebaseApp.name!=="none"){
            let q;
            const firestore=getFirestore(db.firebaseApp);
            const collectionRef=collection(firestore,"brc");
            if (_startWith) {
                const end = _startWith.replace(
                  /.$/, c => String.fromCharCode(c.charCodeAt(0) + 1),
                );
                q = firestoreQuery(collectionRef,where('content.tick', '>=', _startWith),where('content.tick', '<', end) , orderBy("content.tick"), startAfter(startCursor===""?0:startCursor),limit(numberResult));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc)=>{callback(doc.data(),doc.id)});
            }
        }
    }
    // async function addData(_collection:string,_document:{id: string, [key: string]: any}){
    //     if(getApps.length){
    //         const collectionRef=collection(db.firestore,_collection);
    //         const documentRef=doc(collectionRef,_document.id);
    //         try{
    //             await setDoc(documentRef,_document);
    //         }catch(e){
    //             console.error(e);
    //         }
    //     }
    // }
    
    /* REALTIME DATABASE */
    function fetchSellOrders(tokenID:string,callback:Function){
        if(db.database.app.name!=="none"){
        const orderListRef = ref(db.database, 'token/'+tokenID);
        const q= databaseQuery(orderListRef,orderByChild('direction'),equalTo("sell"));
        const unmountListerner=onValue(q, async (snapshot) => {
            snapshot.forEach((childSnapshot) => {
               callback(childSnapshot.val(),childSnapshot.key);
             });
        }, {
            onlyOnce: true
        });
        return unmountListerner
        }
        
    }

    function fetchBuyOrders(tokenID:string,callback:Function){
        if(db.database.app.name!=="none"){
        const orderListRef = ref(db.database, 'token/'+tokenID);
        const q= databaseQuery(orderListRef,orderByChild('direction'),equalTo("buy"));
        const unmountListerner=onValue(q, async (snapshot) => {
            snapshot.forEach((childSnapshot) => {
               callback(childSnapshot.val(),childSnapshot.key);
             });
        }, {
            onlyOnce: true
        });
        return unmountListerner
        }
    }

    function fetchAddedSellOrders(tokenID:string,callback:Function){
        if(db.database.app.name!=="none"){
        const orderListRef = ref(db.database, 'token/'+tokenID);
        const q= databaseQuery(orderListRef,orderByChild('direction'),equalTo("sell"));
        const unmountListerner=onChildAdded(q, (data) => {
            callback(data.val(),data.key);
          });
        return unmountListerner;
        }
    }
    function fetchAddedBuyOrders(tokenID:string,callback:Function){
        if(db.database.app.name!=="none"){
        const orderListRef = ref(db.database, 'token/'+tokenID);
        const q = databaseQuery(orderListRef,orderByChild('direction'),equalTo("buy"));
        const unmountListerner=onChildAdded(q, (data) => {
            callback(data.val(),data.key);
          });
        return unmountListerner;
        }
    }
    
   function fetchRemovedSellOrders(tokenID:string,callback:Function){
        if(db.database.app.name!=="none"){
        const orderListRef = ref(db.database, 'token/'+tokenID);
        const q= databaseQuery(orderListRef,orderByChild('direction'),equalTo("sell"));
        const unmountListerner=onChildRemoved(q, (data) => {
            callback(data.val(),data.key);
            });
        return unmountListerner;
        }
    }

    function fetchRemovedBuyOrders(tokenID:string,callback:Function){
        if(db.database.app.name!=="none"){
        const orderListRef = ref(db.database, 'token/'+tokenID);
        const q= databaseQuery(orderListRef,orderByChild('direction'),equalTo("buy"));
        const unmountListerner=onChildRemoved(q, (data) => {
            callback(data.val(),data.key);
            });
        return unmountListerner;
        }
    }

    
    return {
        db,
        fetchToken,
        getDeploy,
        buyMarket,sellMarket,buyLimit,sellLimit,
        requestInscribe,
        broadcastInscribe,
        getTokenStartWith,
        fetchBuyOrders,
        fetchSellOrders,
        fetchAddedBuyOrders,
        fetchAddedSellOrders,
        fetchRemovedBuyOrders,
        fetchRemovedSellOrders,
        signIn

    }
}

export const FirebaseContext = React.createContext({} as ReturnType<typeof useValue>)

export const FirebaseContextProvider: React.FC<React.PropsWithChildren<any>> = (props) => {
    return (
        <FirebaseContext.Provider value={useValue()}>
            {props.children}
        </FirebaseContext.Provider>
    )
}
