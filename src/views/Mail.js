import emailjs from '@emailjs/browser';
import {html,useState,useLS,fd} from '../lib.js';

const serviceId=import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId=import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey=import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const configured=Boolean(serviceId&&templateId&&publicKey);

function Mail({s,por,close}){
 const [sending,setSending]=useState(false);
 const [result,setResult]=useState('');
 const [error,setError]=useState('');
 const [toEmail,setToEmail]=useLS('emailTo','');
 const status=s.fin==='aprobado'?'Aprobado':'Rechazado';
 const reason=s.obs?.trim()||'Sin observaciones';
 const subject=`Set ${status.toLowerCase()} - REF ${s.ref}`;
 const message=`Estado: ${status}\nMotivo: ${reason}\n\nReferencia: ${s.ref}\nOC: ${s.oc}\nMarca: ${s.marca}\nFecha: ${fd(s.finF)}\nDiligenciado por: ${por}`;
 const validEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail.trim());
 const send=async()=>{
  if(!configured){
   setError('Falta configurar EmailJS. Revisa las variables VITE_EMAILJS_* y reinicia la aplicación.');
   return;
  }
  if(!validEmail){
   setError('Escribe una dirección de correo válida para el destinatario.');
   return;
  }
  setSending(true);
  setError('');
  try{
   await emailjs.send(serviceId,templateId,{
    to_email:toEmail,
    subject,
    name:por||'Auditoría de sets de tallas',
    from_name:por||'Auditoría de sets de tallas',
    message,
    status,
    reason,
    reference:s.ref,
    order:s.oc,
    brand:s.marca,
    date:fd(s.finF),
    completed_by:por
   },{publicKey});
   setResult('Correo enviado correctamente.');
  }catch(err){
   console.error('Error al enviar correo con EmailJS:',err);
   setError(err?.text||'No se pudo enviar el correo. Verifica la configuración de EmailJS e inténtalo de nuevo.');
  }finally{
   setSending(false);
  }
 };
 return html`<div className="ov" role="dialog" aria-modal="true" aria-labelledby="mail-title"><div className="mail">
 <h3 id="mail-title" style=${{margin:0}}>Resultado: ${status}</h3>
 <div className="fl"><label htmlFor="email-to">Enviar a</label><input id="email-to" type="email" value=${toEmail} onInput=${x=>{setToEmail(x.target.value);setError('')}} placeholder="correo@empresa.com" autoComplete="email"/></div>
 <pre>Estado: ${status}\nMotivo: ${reason}</pre>
 ${!configured&&html`<p className="mut" role="status">EmailJS aún no está configurado. Consulta README.md para completar la configuración.</p>`}
 ${error&&html`<p className="mail-error" role="alert">${error}</p>`}
 ${result&&html`<p className="mail-success" role="status">${result}</p>`}
 <div style=${{display:'flex',gap:'8px',justifyContent:'flex-end',marginTop:'12px'}}>
 <button type="button" className="btn" disabled=${sending||Boolean(result)||!configured||!validEmail} onClick=${send}>${sending?'Enviando…':result?'Enviado':'Enviar correo'}</button>
 <button type="button" className="btn btn-ghost" disabled=${sending} onClick=${close}>Cerrar</button>
 </div></div></div>`;
}

export default Mail;
