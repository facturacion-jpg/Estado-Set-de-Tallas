import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { ADMIN_EMAIL, auth, db } from './firebase.js';

export default function AuthGate({ children }) {
  const [estado, setEstado] = useState('verificando');
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let detenerPermiso = null;
    const detenerAuth = onAuthStateChanged(auth, (cuenta) => {
      detenerPermiso?.();
      detenerPermiso = null;
      setUsuario(cuenta);
      if (!cuenta?.email) {
        setEstado('ingreso');
        return;
      }
      if (cuenta.email.toLowerCase() === ADMIN_EMAIL) {
        setEstado('permitido');
        setMensaje('');
        return;
      }
      setEstado('verificando');
      detenerPermiso = onSnapshot(doc(db, 'app_access', cuenta.email.toLowerCase()), (perfil) => {
        if (perfil.exists() && perfil.data()?.access?.tallas === true) {
          setEstado('permitido');
          setMensaje('');
        } else {
          setEstado('sin-permiso');
          setMensaje('El administrador aún no habilita Estado de tallas para este correo. Esta pantalla se actualizará cuando lo active.');
        }
      }, (error) => {
        console.error('No se pudo validar el permiso de Tallas:', error);
        setEstado('error');
        setMensaje('No se pudo validar el permiso en Firebase. Revisa las reglas de Firestore y la conexión.');
      });
    });
    return () => { detenerAuth(); detenerPermiso?.(); };
  }, []);

  const ingresar = async (event) => {
    event.preventDefault();
    setMensaje('');
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), clave);
    } catch (error) {
      setMensaje(error?.code === 'auth/invalid-credential' ? 'Correo o contraseña incorrectos.' : 'No se pudo iniciar sesión. Verifica los datos y la conexión.');
    }
  };

  if (estado === 'verificando') return <main style={estilos.fondo}><p>Verificando acceso…</p></main>;
  if (estado === 'permitido') return <>{usuario?.email?.toLowerCase() !== ADMIN_EMAIL && <div style={estilos.sesion}><span>{usuario.email}</span><button type="button" onClick={() => signOut(auth)}>Cerrar sesión</button></div>}{children}</>;
  if (estado === 'sin-permiso' || estado === 'error') return <main style={estilos.fondo}><section style={estilos.tarjeta}><h1>Estado de tallas</h1><p role="status">{mensaje}</p><button style={estilos.boton} type="button" onClick={() => signOut(auth)}>Cambiar de cuenta</button></section></main>;

  return <main style={estilos.fondo}><form style={estilos.tarjeta} onSubmit={ingresar}>
    <small style={estilos.marca}>CREARTE · CONTROL DE ACCESOS</small><h1 style={{ margin: '8px 0' }}>Estado de tallas</h1><p>Ingresa con la cuenta autorizada en el portal.</p>
    <label style={estilos.label} htmlFor="email">Correo</label><input style={estilos.campo} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
    <label style={estilos.label} htmlFor="password">Contraseña</label><input style={estilos.campo} id="password" type="password" value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="current-password" required />
    {mensaje && <p role="alert" style={estilos.error}>{mensaje}</p>}<button style={estilos.boton} type="submit">Iniciar sesión</button>
    <a style={estilos.enlace} href="https://crearte-2abs.onrender.com">¿No tienes cuenta? Créala en el portal</a>
  </form></main>;
}

const estilos = {
  fondo: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f1f4f6', color: '#14202b', fontFamily: 'system-ui, sans-serif' },
  tarjeta: { width: 'min(100%, 420px)', display: 'grid', gap: 10, padding: 28, borderRadius: 18, background: '#fff', border: '1px solid #d5dce3', boxShadow: '0 16px 45px #14202b12' },
  marca: { color: '#5d6b78', fontWeight: 800, letterSpacing: '.12em' },
  label: { fontSize: 14, fontWeight: 650 },
  campo: { width: '100%', boxSizing: 'border-box', padding: 12, border: '1px solid #d5dce3', borderRadius: 9, fontSize: 16 },
  boton: { padding: 13, border: 0, borderRadius: 9, background: '#17324d', color: 'white', fontWeight: 700, cursor: 'pointer' },
  error: { margin: 0, padding: 10, borderRadius: 8, background: '#fee2e2', color: '#991b1b', fontSize: 14 },
  enlace: { marginTop: 4, color: '#17324d', textAlign: 'center', fontSize: 14 },
  sesion: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, padding: 8, color: '#5d6b78', font: '13px system-ui' },
};
