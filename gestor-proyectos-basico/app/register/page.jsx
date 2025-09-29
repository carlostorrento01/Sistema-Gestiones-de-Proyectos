"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "", role: "usuario" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h2>Registro</h2>
      {error && <p style={{ color: "tomato" }}>{error}</p>}
      <form onSubmit={onSubmit} className="row" style={{ flexDirection: "column", gap: 8 }}>
        <label className="label">Usuario</label>
        <input className="input" value={form.username} onChange={e=>setForm(f=>({...f, username:e.target.value}))}/>
        <label className="label">Contraseña</label>
        <input type="password" className="input" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))}/>
        <label className="label">Rol</label>
        <select className="select" value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value}))}>
          <option value="gerente">Gerente</option>
          <option value="usuario">Usuario</option>
        </select>
        <button className="btn" type="submit">Crear cuenta</button>
      </form>
    </div>
  );
}
