import {html} from '../lib.js';

function Tablero(){
 return html`<div className="tablero-view"><h1>Tablero</h1><p className="sub">Resumen de registros</p><div className="panel empty">El tablero esta limpio. Los registros se conservan en las secciones de auditoria.</div></div>`;
}

export default Tablero;
