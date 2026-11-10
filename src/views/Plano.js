import {html,useEffect,useState} from '../lib.js';
import {Chips,Head} from '../components/ui.js';

function AddSetDialog({onClose,children}){
 useEffect(()=>{
  const onKeyDown=e=>{if(e.key==='Escape')onClose()};
  window.addEventListener('keydown',onKeyDown);
  return()=>window.removeEventListener('keydown',onKeyDown);
 },[onClose]);
 return html`<div className="ov" role="dialog" aria-modal="true" aria-labelledby="add-set-title" onClick=${e=>{if(e.target===e.currentTarget)onClose()}}>
 <section className="audit-dialog">
 <div className="audit-dialog-head"><div><p className="audit-kicker">Plano de referencias</p><h2 id="add-set-title">Agregar set</h2></div><button type="button" className="audit-close" aria-label="Cerrar formulario" onClick=${onClose}>×</button></div>
 ${children}
 </section></div>`;
}

function Plano({plano,setPlano}){
 const [oc,setOc]=useState(''),[ref,setRef]=useState(''),[marca,setMarca]=useState(''),[colores,setColores]=useState(''),[formError,setFormError]=useState(''),[showAdd,setShowAdd]=useState(false);
 const closeAdd=()=>{setShowAdd(false);setFormError('')};
 const addReference=ev=>{
  ev.preventDefault();
  const cleanOc=oc.trim(),cleanRef=ref.trim(),cleanMarca=marca.trim().toUpperCase();
  const cleanColors=[...new Set(colores.split(',').map(c=>c.trim()).filter(Boolean))];
  if(!cleanOc||!cleanRef||!cleanMarca||!cleanColors.length){
   setFormError('Completa OC, referencia, marca y al menos un color.');
   return;
  }
  if(plano.some(p=>p.oc.trim().toUpperCase()===cleanOc.toUpperCase()&&p.ref.trim().toUpperCase()===cleanRef.toUpperCase())){
   setFormError(`La combinación OC ${cleanOc} / REF ${cleanRef} ya existe en el plano.`);
   return;
  }
  setPlano([...plano,{oc:cleanOc,ref:cleanRef,marca:cleanMarca,colores:cleanColors}]);
  setOc('');setRef('');setMarca('');setColores('');closeAdd();
 };
 const load=ev=>{const f=ev.target.files[0];if(!f)return;f.text().then(t=>{const m={};
  t.split(/\r?\n/).slice(1).forEach(r=>{const [oc,ref,marca,color]=r.split(/[,;\t]/).map(x=>(x||'').trim());if(!ref)return;const k=oc+'|'+ref;m[k]=m[k]||{oc,ref,marca:marca.toUpperCase(),colores:[]};if(color&&!m[k].colores.includes(color))m[k].colores.push(color)});
  const n=Object.values(m);if(n.length)setPlano(n)})};
 return html`<div className="plano-view"><${Head} t="Plano de referencias" s="Sube un archivo CSV con las columnas OC, REF, MARCA y COLOR. Reemplaza el plano actual."/>
 <div className="tools"><button type="button" className="btn" onClick=${()=>setShowAdd(true)}>Agregar set</button><label className="btn g" style=${{display:'inline-flex',alignItems:'center'}}>Subir plano (.csv)<input type="file" accept=".csv,.txt" onChange=${load} hidden/></label></div>
 ${plano.length?html`<div className="tw"><table><thead><tr><th>OC</th><th>REF</th><th>Marca</th><th>Colores</th></tr></thead><tbody>${plano.map((p,i)=>html`<tr key=${i}><td>${p.oc}</td><td className="ref">${p.ref}</td><td>${p.marca}</td><td><${Chips} l=${p.colores}/></td></tr>`)}</tbody></table></div>`:html`<div className="panel empty">El plano está vacío. Agrega un set o sube un archivo para crear referencias.</div>`}
 ${showAdd&&html`<${AddSetDialog} onClose=${closeAdd}><form onSubmit=${addReference}>
 <div className="row"><div className="fl"><label htmlFor="plan-oc">OC</label><input id="plan-oc" required value=${oc} onInput=${e=>setOc(e.target.value)} placeholder="Ej. 54677"/></div>
 <div className="fl"><label htmlFor="plan-ref">Referencia</label><input id="plan-ref" required value=${ref} onInput=${e=>setRef(e.target.value)} placeholder="Ej. 41959"/></div></div>
 <div className="fl"><label htmlFor="plan-marca">Marca</label><input id="plan-marca" required value=${marca} onInput=${e=>setMarca(e.target.value)} placeholder="Ej. BRONZINI"/></div>
 <div className="fl"><label htmlFor="plan-colores">Colores</label><input id="plan-colores" required value=${colores} onInput=${e=>setColores(e.target.value)} placeholder="Separados por coma: Negro, Blanco"/></div>
 ${formError&&html`<p className="mail-error" role="alert">${formError}</p>`}
 <div className="audit-actions"><button type="submit" className="btn">Agregar set</button></div>
 </form></${AddSetDialog}>`}</div>`}

export default Plano;
