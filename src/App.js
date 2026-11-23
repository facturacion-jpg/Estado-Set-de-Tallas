import {html,useState,useMemo,useEffect,useLS,fd,hoy,TO,PLANO0,SETS0} from './lib.js';
import Tablero from './views/Tablero.js';
import Nuevo from './views/Nuevo.js';
import Web from './views/Web.js';
import Final from './views/Final.js';
import Plano from './views/Plano.js';
import Mail from './views/Mail.js';
import {firebaseReady} from './firebase.js';
import {subscribeState,saveState} from './database.js';
function App(){
 const [v,setV]=useState('tablero'),[plano,setPlano]=useLS('plano',PLANO0),[sets,setSets]=useLS('sets',SETS0),[por,setPor]=useLS('por','Mari'),[theme,setTheme]=useLS('theme','light'),[menuOpen,setMenuOpen]=useState(() => typeof window !== 'undefined' ? window.matchMedia('(min-width: 821px)').matches : true),[navCompact,setNavCompact]=useState(false),[m,setM]=useState(null);
 const [dbLoaded,setDbLoaded]=useState(false),[dbError,setDbError]=useState('');
 useEffect(()=>{if(!firebaseReady||!dbLoaded)return;const timer=setTimeout(()=>saveState({plano,sets,updatedAt:new Date().toISOString()}).then(()=>setDbError('')).catch(error=>{console.error('Firestore write error',error);setDbError('No se pudo guardar en Firestore. Revisa las reglas de seguridad y la conexión.')}),700);return()=>clearTimeout(timer)},[plano,sets,dbLoaded]);
 useEffect(()=>{if(!firebaseReady){setDbLoaded(true);setDbError('Firebase no está configurado.');return}return subscribeState(data=>{if(Array.isArray(data.plano))setPlano(data.plano);if(Array.isArray(data.sets))setSets(data.sets);setDbLoaded(true);setDbError('')},error=>{console.error('Firestore read error',error);setDbError('No se pudo leer Firestore. Revisa la conexión y las reglas.');setDbLoaded(true)})},[]);
 useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
 useEffect(()=>{let lastY=window.scrollY,deltaSinceChange=0;const onScroll=()=>{const y=window.scrollY;deltaSinceChange+=y-lastY;lastY=y;if(y<8){deltaSinceChange=0;setNavCompact(false)}else if(deltaSinceChange>12){deltaSinceChange=0;setNavCompact(true)}else if(deltaSinceChange< -12){deltaSinceChange=0;setNavCompact(false)}};window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
 const navigate=k=>{setV(k);if(window.matchMedia('(max-width: 820px)').matches)setMenuOpen(false)};
 const themeToggle=html`<button type="button" className="theme-toggle" aria-label=${theme==='dark'?'Cambiar a tema claro':'Cambiar a tema oscuro'} title=${theme==='dark'?'Tema claro':'Tema oscuro'} onClick=${()=>setTheme(theme==='dark'?'light':'dark')}><svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" style=${{display:theme==='dark'?'':'none'}}/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" style=${{display:theme==='dark'?'':'none'}}/><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" style=${{display:theme==='dark'?'none':''}}/></svg></button>`;
 const upd=(id,p)=>setSets(prev=>prev.map(s=>s.id===id?{...s,...p}:s));
 const add=l=>setSets(prev=>[...prev,...l.map((o,i)=>({id:Date.now()+i,oc:o.oc,ref:o.ref,marca:o.marca,colores:o.colores,web:'pendiente',webF:'',fin:'pendiente',finF:'',unid:'',env:[],obs:'',por}))]);
 const N=[['tablero','Tablero',0,'grid'],['nuevo','Nuevo set',0,'plus'],['web','Auditoria web',sets.filter(s=>s.web!=='ok').length,'globe'],['final','Auditoria final',sets.filter(s=>s.web==='ok'&&s.fin!=='aprobado').length,'check'],['plano','Plano',0,'file']];
 const icon=name=>name==='grid'?html`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`:
 name==='plus'?html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`:
 name==='globe'?html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>`:
 name==='check'?html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>`:
 html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>`;
 const quien=[html`<label key="por-label" htmlFor="por">Diligenciado por</label>`,html`<input key="por-input" id="por" value=${por} onInput=${x=>setPor(x.target.value)}/> `];
 return html`<div className=${'app'+(menuOpen?' menu-open':'')}><aside className="side" aria-label="MenÃº principal"><div className="brand">Estado set de tallas<small>Control de auditorÃ­as</small></div>
 ${N.map(([k,t,c,i])=>html`<button key=${k} type="button" className="nav" aria-current=${v===k?'page':undefined} onClick=${()=>navigate(k)}><span className="nav-icon">${icon(i)}</span><span className="nav-label">${t}</span>${c>0&&html`<span className="cnt">${c}</span>`}</button>`)}
 <div className="who">${quien}</div></aside>
 ${menuOpen&&html`<button type="button" className="menu-backdrop" aria-label="Cerrar menÃº" onClick=${()=>setMenuOpen(false)}></button>`}
 <main><div className="topbar"><button type="button" className="menu-toggle" aria-label=${menuOpen?'Cerrar menÃº':'Abrir menÃº'} aria-expanded=${menuOpen} onClick=${()=>setMenuOpen(!menuOpen)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><div className="theme-bar">${themeToggle}</div></div><div className="mwho">${quien}</div>${dbError&&html`<p className="mail-error" role="alert">${dbError}</p>`}
 ${v==='tablero'&&html`<${Tablero} sets=${sets}/>`}${v==='nuevo'&&html`<${Nuevo} plano=${plano} sets=${sets} add=${add} go=${setV}/>`}
 ${v==='web'&&html`<${Web} sets=${sets} upd=${upd}/>`}${v==='final'&&html`<${Final} sets=${sets} upd=${upd} mail=${setM}/>`}${v==='plano'&&html`<${Plano} plano=${plano} setPlano=${setPlano}/>`}</main>
 <nav className=${'mobile-nav'+(navCompact?' is-compact':'')} aria-label="NavegaciÃ³n principal">${N.map(([k,t,c,i])=>html`<button key=${k} type="button" aria-current=${v===k?'page':undefined} aria-label=${t} onClick=${()=>navigate(k)}><span className="mobile-nav-icon">${icon(i)}</span><span className="mobile-nav-label">${t==='Auditoria web'?'Aud. web':t==='Auditoria final'?'Aud. final':t==='Nuevo set'?'Nuevo':t}</span>${c>0&&html`<span className="mobile-nav-count">${c}</span>`}</button>`)}</nav>
 ${m&&html`<${Mail} s=${m} por=${por} close=${()=>setM(null)}/>`}</div>`}

export default App;
