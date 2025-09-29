"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Protected from "../../components/Protected";

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}

function DashboardInner() {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchAll = async () => {
    const [p, t] = await Promise.all([
      fetch("/api/projects").then(r=>r.json()),
      fetch("/api/tasks").then(r=>r.json()),
    ]);
    setProjects(p);
    setTasks(t);
  };

  useEffect(() => { fetchAll(); }, []);

  const myTasks = useMemo(
    () => tasks.filter(t => t.assignedTo === user?.username),
    [tasks, user]
  );

  const progressByProject = useMemo(() => {
    const map = {};
    projects.forEach(p => {
      const ts = tasks.filter(t => t.projectId === p.id);
      const done = ts.filter(t => t.status === "done").length;
      map[p.id] = ts.length ? Math.round((done / ts.length) * 100) : 0;
    });
    return map;
  }, [projects, tasks]);

  const totalProgress = useMemo(() => {
    const all = tasks.length;
    const done = tasks.filter(t=>t.status==="done").length;
    return all ? Math.round((done/all)*100) : 0;
  }, [tasks]);

  return (
    <>
      <div className="card">
        <h2>Dashboard</h2>
        <p>Progreso general</p>
        <div className="progress"><span style={{ width: `${totalProgress}%` }} /></div>
        <p className="label">{totalProgress}% completado</p>
      </div>

      <div className="grid">
        <div className="card col-6">
          <h3>Proyectos</h3>
          {projects.map(p => (
            <div key={p.id} className="card">
              <div className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <strong>{p.name}</strong>
                  <p className="label">{p.description}</p>
                </div>
                <div style={{minWidth: 180}}>
                  <div className="progress"><span style={{ width: `${progressByProject[p.id] || 0}%` }} /></div>
                  <p className="label">{progressByProject[p.id] || 0}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card col-6">
          <h3>Tareas asignadas a ti</h3>
          {myTasks.length === 0 && <p className="label">No tienes tareas asignadas.</p>}
          {myTasks.map(t => (
            <div key={t.id} className="card">
              <strong>{t.title}</strong>
              <p className="label">Proyecto #{t.projectId}</p>
              <span className="badge">Estado: {t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
