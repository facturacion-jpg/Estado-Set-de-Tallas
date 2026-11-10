import React,{useState,useMemo,useEffect} from 'react';
import htm from 'htm';
export {useState,useMemo,useEffect};
export const html=htm.bind(React.createElement);
export const TO=['Sebas Integración','JAS','Mari'];
export const PLANO0=[
{oc:'51604',ref:'42233',marca:'ARKITECT',colores:['Negro','Blanco']},
{oc:'53835',ref:'42233',marca:'ARKITECT',colores:['Negro','Blanco']},
{oc:'54677',ref:'41959',marca:'BRONZINI',colores:['Botánico']},
{oc:'53932',ref:'42765',marca:'ARKITECT',colores:['Arena','Morado','Negro']},
{oc:'51965',ref:'40006',marca:'PEOPLE',colores:['Negro','Arena','Morado']},
{oc:'55052',ref:'44145',marca:'PEOPLE',colores:['Cuadros']},
{oc:'51235',ref:'29192',marca:'BRONZINI',colores:['Estampado']},
{oc:'53974',ref:'38925',marca:'ARKITECT',colores:['Vino']},
{oc:'54677',ref:'42011',marca:'BRONZINI',colores:['Rosa']}];
export const SETS0=[];
export const hoy=()=>new Date().toISOString().slice(0,10);
export const fd=d=>d?d.split('-').reverse().join('/'):'—';
export function useLS(k,v){const [s,set]=useState(()=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):v}catch(e){return v}});
useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(s))}catch(e){}},[s]);return [s,set]}
