"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: "tomato" }}>{error}</p>}
      <form onSubmit={onSubmit} className="row" style={{ flexDirection: "column", gap: 8 }}>
        <label className="label">Usuario</label>
        <input className="input" value={form.username} onChange={e=>setForm(f=>({...f, username:e.target.value}))}/>
        <label className="label">Contraseña</label>
        <input type="password" className="input" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))}/>
        <button className="btn" type="submit">Entrar</button>
      </form>
    </div>
  );
}
