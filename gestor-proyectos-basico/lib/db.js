// ¡Solo para demo! Se reinicia al reiniciar el servidor.
let projectId = 2;
let taskId = 3;

export let projects = [
  { id: 1, name: "Proyecto Demo", description: "Primer proyecto", owner: "admin" },
];

export let tasks = [
  { id: 1, projectId: 1, title: "Configurar repo", status: "done", assignedTo: "admin" },
  { id: 2, projectId: 1, title: "Crear UI básica", status: "inprogress", assignedTo: "ana" },
];

export function getProjects() { return projects; }
export function getProjectById(id) { return projects.find(p => p.id === id) || null; }
export function createProject(data) {
  const p = { id: projectId++, ...data };
  projects.push(p);
  return p;
}
export function updateProject(id, data) {
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...data };
  return projects[idx];
}
export function deleteProject(id) {
  projects = projects.filter(p => p.id !== id);
  tasks = tasks.filter(t => t.projectId !== id);
  return true;
}

export function getTasks(projectId) {
  return projectId ? tasks.filter(t => t.projectId === projectId) : tasks;
}
export function createTask(data) {
  const t = { id: taskId++, ...data };
  tasks.push(t);
  return t;
}
export function updateTask(id, data) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...data };
  return tasks[idx];
}
export function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  return true;
}
