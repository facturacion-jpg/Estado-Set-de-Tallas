import React,{useState,useMemo,useEffect} from 'react';
import htm from 'htm';
export {useState,useMemo,useEffect};
export const html=htm.bind(React.createElement);
export const TO=['Sebas Integración','JAS','Mari'];
export const PLANO0=[];
export const SETS0=[];
const RESET_V='3';
try{if(localStorage.getItem('datosVersion')!==RESET_V){localStorage.removeItem('plano');localStorage.removeItem('sets');localStorage.setItem('datosVersion',RESET_V)}}catch(e){}
export const hoy=()=>new Date().toISOString().slice(0,10);
export const fd=d=>d?d.split('-').reverse().join('/'):'—';
export function useLS(k,v){const [s,set]=useState(()=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):v}catch(e){return v}});
useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(s))}catch(e){}},[s]);return [s,set]}