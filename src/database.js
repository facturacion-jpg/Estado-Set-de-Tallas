import {doc,onSnapshot,setDoc} from 'firebase/firestore';
import {db} from './firebase.js';
const ref=db?doc(db,'appData','estado-set-de-tallas'):null;
export const subscribeState=(next,error)=>ref?onSnapshot(ref,s=>{if(s.exists())next(s.data())},error):()=>{};
export const saveState=data=>ref?setDoc(ref,data,{merge:true}):Promise.reject(new Error('Firebase no configurado'));
