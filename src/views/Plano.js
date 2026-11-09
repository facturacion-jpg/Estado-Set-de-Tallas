import {html,useState,useMemo,useEffect,fd,hoy,TO} from '../lib.js';
import {Badge,Chips,Head} from '../components/ui.js';

function Plano({plano,setPlano}){
 const load=ev=>{const f=ev.target.files[0];if(!f)return;f.text().then(t=>{const m={};
  t.split(/\r?\n/).slice(1).forEach(r=>{const [oc,ref,marca,color]=r.split(/[,;\t]/).map(x=>(x||'').trim());if(!ref)return;const k=oc+'|'+ref;m[k]=m[k]||{oc,ref,marca:marca.toUpperCase(),colores:[]};if(color&&!m[k].colores.includes(color))m[k].colores.push(color)});
  const n=Object.values(m);if(n.length)setPlano(n)})};
 return html`<div className="plano-view"><${Head} t="Plano de referencias" s="Sube un archivo CSV con las columnas OC, REF, MARCA y COLOR. Reemplaza el plano actual."/>
 <div className="tools"><label className="btn" style=${{display:'inline-flex',alignItems:'center'}}>Subir plano (.csv)<input type="file" accept=".csv,.txt" onChange=${load} hidden/></label></div>
 <div className="tw"><table><thead><tr><th>OC</th><th>REF</th><th>Marca</th><th>Colores</th></tr></thead><tbody>${plano.map((p,i)=>html`<tr key=${i}><td>${p.oc}</td><td className="ref">${p.ref}</td><td>${p.marca}</td><td><${Chips} l=${p.colores}/></td></tr>`)}</tbody></table></div></div>`}

export default Plano;
