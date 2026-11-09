import {html,useState,useMemo,useEffect,fd,hoy,TO} from '../lib.js';
import {Badge,Chips,Head} from '../components/ui.js';

function Web({sets,upd}){
 const l=sets.filter(s=>s.web!=='ok');
 return html`<div className="web-view"><${Head} t="Auditoría en web" s="Sets pendientes. Pon la fecha y márcalos OK para pasarlos a auditoría final."/>
 <div className="cards">${l.map(s=>html`<${WebCard} key=${s.id} s=${s} upd=${upd}/>`)}</div>${!l.length&&html`<div className="panel empty">No hay sets pendientes en auditoría web.</div>`}</div>`}

function WebCard({s,upd}){const [f,setF]=useState('');
 return html`<div className="card"><div className="hd"><div><h3>REF ${s.ref}</h3><div className="mut">OC ${s.oc} · ${s.marca}</div></div><${Badge} e="pendiente"/></div>
 <${Chips} l=${s.colores}/><div className="row" style=${{marginTop:'14px',alignItems:'end'}}><div className="fl" style=${{margin:0}}><label htmlFor=${'w'+s.id}>Fecha de auditoría</label><input id=${'w'+s.id} type="date" value=${f} onInput=${x=>setF(x.target.value)}/></div>
 <div><button type="button" className="btn" disabled=${!f} onClick=${()=>upd(s.id,{web:'ok',webF:f})}>Marcar OK</button></div></div></div>`}

export default Web;
