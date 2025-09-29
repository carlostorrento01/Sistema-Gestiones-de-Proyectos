"use client";
import { useEffect, useState } from "react";
import Protected from "../../components/Protected";
import { useAuth } from "../../context/AuthContext";

export default function ProjectsPage() {
  return (
    <Protected>
      <ProjectsInner />
    </Protected>
  );
}

function ProjectsInner() {
  const { role, user } = useAuth();
  const isGerente = role === "gerente";

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ projectId: "", title: "", assignedTo: "", status: "todo" });

  const fetchProjects = async () => setProjects(await fetch("/api/projects").then(r=>r.json()));
  const fetchTasks = async () => setTasks(await fetch("/api/tasks").then(r=>r.json()));

  useEffect(() => { fetchProjects(); fetchTasks(); }, []);

  const createProject = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ ...form, owner: user?.username }),
    });
    setForm({ name: "", description: "" });
    fetchProjects();
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, description: p.description });
  };

  const saveEdit = async (id) => {
    await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchProjects();
  };

  const removeProject = async (id) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
    fetchTasks();
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.projectId) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        ...taskForm,
        projectId: parseInt(taskForm.projectId),
      }),
    });
    setTaskForm({ projectId: "", title: "", assignedTo: "", status: "todo" });
    fetchTasks();
  };

  const updateTaskStatus = async (t, status) => {
    await fetch(`/api/tasks/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  };

  const removeTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  // Si eres usuario, solo muestra proyectos con tareas asignadas a ti (simple)
  const visibleProjects = isGerente
    ? projects
    : projects.filter(p => tasks.some(t => t.projectId === p.id && t.assignedTo === user?.username));

  return (
    <>
      <div className="card">
        <h2>Proyectos</h2>
        {!isGerente && <p className="label">Vista de usuario (solo proyectos relevantes a tus tareas).</p>}
        {isGerente && (
          <form onSubmit={createProject} className="row" style={{ gap: 8 }}>
            <div style={{ flex: 2 }}>
              <label className="label">Nombre</label>
              <input className="input" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
            </div>
            <div style={{ flex: 3 }}>
              <label className="label">Descripción</label>
              <input className="input" value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))}/>
            </div>
            <div style={{ alignSelf: "end" }}>
              <button className="btn" type="submit">Crear proyecto</button>
            </div>
          </form>
        )}
      </div>

      {visibleProjects.map(p => (
        <div key={p.id} className="card">
          {editingId === p.id ? (
            <div className="row" style={{ gap: 8 }}>
              <input className="input" value={editForm.name} onChange={e=>setEditForm(f=>({...f, name:e.target.value}))}/>
              <input className="input" value={editForm.description} onChange={e=>setEditForm(f=>({...f, description:e.target.value}))}/>
              <button className="btn" onClick={()=>saveEdit(p.id)}>Guardar</button>
              <button className="btn secondary" onClick={()=>setEditingId(null)}>Cancelar</button>
            </div>
          ) : (
            <div className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <strong>{p.name}</strong>
                <p className="label">{p.description}</p>
              </div>
              {isGerente && (
                <div className="row">
                  <button className="btn secondary" onClick={()=>startEdit(p)}>Editar</button>
                  <button className="btn danger" onClick={()=>removeProject(p.id)}>Eliminar</button>
                </div>
              )}
            </div>
          )}

          {/* Tareas del proyecto */}
          <div className="card" style={{ background:"#121214" }}>
            <h4>Tareas</h4>
            {tasks.filter(t=>t.projectId===p.id).map(t => (
              <div key={t.id} className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <strong>{t.title}</strong>
                  <p className="label">Asignado a: {t.assignedTo || "—"}</p>
                </div>
                <div className="row">
                  <select
                    className="select"
                    value={t.status}
                    onChange={(e)=>updateTaskStatus(t, e.target.value)}
                  >
                    <option value="todo">Por hacer</option>
                    <option value="inprogress">En progreso</option>
                    <option value="done">Hecho</option>
                  </select>
                  {isGerente && (
                    <button className="btn danger" onClick={()=>removeTask(t.id)}>Borrar</button>
                  )}
                </div>
              </div>
            ))}

            {/* Crear tarea */}
            {(isGerente || true /* ambos pueden crear si quieres limitar, pon solo isGerente */) && (
              <form onSubmit={createTask} className="row" style={{ gap: 8, marginTop: 12 }}>
                <input type="hidden" value={p.id} />
                <div style={{ flex: 2 }}>
                  <label className="label">Título</label>
                  <input className="input" value={taskForm.projectId===String(p.id)? taskForm.title : ""} onChange={e=>setTaskForm(f=>({...f, projectId:String(p.id), title:e.target.value}))}/>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Asignado a</label>
                  <input className="input" value={taskForm.projectId===String(p.id)? taskForm.assignedTo : ""} onChange={e=>setTaskForm(f=>({...f, projectId:String(p.id), assignedTo:e.target.value}))}/>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Estado</label>
                  <select className="select" value={taskForm.projectId===String(p.id)? taskForm.status : "todo"} onChange={e=>setTaskForm(f=>({...f, projectId:String(p.id), status:e.target.value}))}>
                    <option value="todo">Por hacer</option>
                    <option value="inprogress">En progreso</option>
                    <option value="done">Hecho</option>
                  </select>
                </div>
                <div style={{ alignSelf:"end" }}>
                  <button className="btn" type="submit">Agregar tarea</button>
                </div>
              </form>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
