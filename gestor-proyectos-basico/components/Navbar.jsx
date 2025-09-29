"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  return (
    <div className="nav">
      <Link href="/">Inicio</Link>
      {isAuthenticated && (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/projects">Proyectos</Link>
          <span className="badge">Usuario: {user?.username} ({role})</span>
          <button className="btn secondary" onClick={logout}>Salir</button>
        </>
      )}
      {!isAuthenticated && (
        <>
          <Link href="/login">Entrar</Link>
          <Link href="/register">Registrarse</Link>
        </>
      )}
    </div>
  );
}
