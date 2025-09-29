import Link from "next/link";
import { cookies } from "next/headers";

export default function Home() {
  // Landing simple con CTA
  return (
    <div className="card">
      <h1>Gestor de Proyectos (Básico)</h1>
      <p>App demo con Next.js, autenticación simple y datos simulados.</p>
      <div className="row">
        <Link className="btn" href="/login">Entrar</Link>
        <Link className="btn secondary" href="/register">Registrarse</Link>
      </div>
    </div>
  );
}
