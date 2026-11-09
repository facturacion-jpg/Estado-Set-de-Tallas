import {html} from '../lib.js';
export const Badge=({e})=>html`<span className=${'b '+e}>${e==='ok'?'OK':e[0].toUpperCase()+e.slice(1)}</span>`;
export const Chips=({l})=>html`<div className="chips">${l.map((c,i)=>html`<span key=${String(c)+'-'+i} className="chip">${c}</span>`)}</div>`;
export const Head=({t,s})=>[html`<h1 key="head-title">${t}</h1>`, html`<p key="head-sub" className="sub">${s}</p>`];

