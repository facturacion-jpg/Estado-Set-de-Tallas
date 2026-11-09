import {html,useState,useMemo,useEffect,useLS,fd,hoy,TO,PLANO0,SETS0} from './lib.js';
import Tablero from './views/Tablero.js';
import Nuevo from './views/Nuevo.js';
import Web from './views/Web.js';
import Final from './views/Final.js';
import Plano from './views/Plano.js';
import Mail from './views/Mail.js';
function App(){
 const [v,setV]=useState('tablero'),[plano,setPlano]=useLS('plano',PLANO0),[sets,setSets]=useLS('sets',SETS0),[por,setPor]=useLS('por','Mari'),[theme,setTheme]=useLS('theme','light'),[menuOpen,setMenuOpen]=useState(() => typeof window !== 'undefined' ? window.matchMedia('(min-width: 821px)').matches : true),[navCompact,setNavCompact]=useState(false),[m,setM]=useState(null);
 useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
 useEffect(()=>{let lastY=window.scrollY,deltaSinceChange=0;const onScroll=()=>{const y=window.scrollY;deltaSinceChange+=y-lastY;lastY=y;if(y<8){deltaSinceChange=0;setNavCompact(false)}else if(deltaSinceChange>12){deltaSinceChange=0;setNavCompact(true)}else if(deltaSinceChange< -12){deltaSinceChange=0;setNavCompact(false)}};window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
 const navigate=k=>{setV(k);if(window.matchMedia('(max-width: 820px)').matches)setMenuOpen(false)};
 const themeToggle=html`<button type="button" className="theme-toggle" aria-label=${theme==='dark'?'Cambiar a tema claro':'Cambiar a tema oscuro'} title=${theme==='dark'?'Tema claro':'Tema oscuro'} onClick=${()=>setTheme(theme==='dark'?'light':'dark')}><span className="theme-icon" aria-hidden="true">${theme==='dark'?'☀':'☾'}</span></button>`;
 const upd=(id,p)=>setSets(prev=>prev.map(s=>s.id===id?{...s,...p}:s));
 const add=l=>setSets(prev=>[...prev,...l.map((o,i)=>({id:Date.now()+i,oc:o.oc,ref:o.ref,marca:o.marca,colores:o.colores,web:'pendiente',webF:'',fin:'pendiente',finF:'',unid:'',env:[],obs:'',por}))]);
 const N=[['tablero','Tablero',0,'grid'],['nuevo','Nuevo set',0,'plus'],['web','Auditoría web',sets.filter(s=>s.web!=='ok').length,'globe'],['final','Auditoría final',sets.filter(s=>s.web==='ok'&&s.fin!=='aprobado').length,'check'],['plano','Plano',0,'file']];
 const icon=name=>name==='grid'?html`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`:
 name==='plus'?html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`:
 name==='globe'?html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>`:
 name==='check'?html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>`:
 html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>`;
 const quien=[html`<label key="por-label" htmlFor="por">Diligenciado por</label>`,html`<input key="por-input" id="por" value=${por} onInput=${x=>setPor(x.target.value)}/> `];
 return html`<div className=${'app'+(menuOpen?' menu-open':'')}><aside className="side" aria-label="Menú principal"><div className="brand">Estado set de tallas<small>Control de auditorías</small></div>
 ${N.map(([k,t,c,i])=>html`<button key=${k} type="button" className="nav" aria-current=${v===k?'page':undefined} onClick=${()=>navigate(k)}><span className="nav-icon">${icon(i)}</span><span className="nav-label">${t}</span>${c>0&&html`<span className="cnt">${c}</span>`}</button>`)}
 <div className="who">${quien}</div></aside>
 ${menuOpen&&html`<button type="button" className="menu-backdrop" aria-label="Cerrar menú" onClick=${()=>setMenuOpen(false)}></button>`}
 <main><div className="topbar"><button type="button" className="menu-toggle" aria-label=${menuOpen?'Cerrar menú':'Abrir menú'} aria-expanded=${menuOpen} onClick=${()=>setMenuOpen(!menuOpen)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><div className="theme-bar">${themeToggle}</div></div><div className="mwho">${quien}</div>
 ${v==='tablero'&&html`<${Tablero} sets=${sets}/>`}${v==='nuevo'&&html`<${Nuevo} plano=${plano} sets=${sets} add=${add} go=${setV}/>`}
 ${v==='web'&&html`<${Web} sets=${sets} upd=${upd}/>`}${v==='final'&&html`<${Final} sets=${sets} upd=${upd} mail=${setM}/>`}${v==='plano'&&html`<${Plano} plano=${plano} setPlano=${setPlano}/>`}</main>
 <nav className=${'mobile-nav'+(navCompact?' is-compact':'')} aria-label="Navegación principal">${N.map(([k,t,c,i])=>html`<button key=${k} type="button" aria-current=${v===k?'page':undefined} aria-label=${t} onClick=${()=>navigate(k)}><span className="mobile-nav-icon">${icon(i)}</span><span className="mobile-nav-label">${t==='Auditoría web'?'Aud. web':t==='Auditoría final'?'Aud. final':t==='Nuevo set'?'Nuevo':t}</span>${c>0&&html`<span className="mobile-nav-count">${c}</span>`}</button>`)}</nav>
 ${m&&html`<${Mail} s=${m} por=${por} close=${()=>setM(null)}/>`}</div>`}

export default App;
