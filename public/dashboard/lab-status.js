/* Shared helpers used by the simulation lab pages to persist
   project progress and register projects in the dashboard's
   "My Projects" list (stored in localStorage). */

function getProjectIdFromURL() {
  const params = new URLSearchParams(location.search);
  return params.get('project') || null;
}

function loadProjectProgress(projectId) {
  if (!projectId) return null;
  try {
    return JSON.parse(localStorage.getItem('projectProgress_' + projectId) || 'null');
  } catch (e) {
    console.error('Failed to load project progress:', e);
    return null;
  }
}

function saveProjectProgress(projectId, data) {
  if (!projectId) return;
  try {
    localStorage.setItem('projectProgress_' + projectId, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save project progress:', e);
  }
}

function saveCurrentAsProject(name, lab) {
  if (!name || !name.trim()) return null;

  const id = 'project_' + Date.now();
  const projects = JSON.parse(localStorage.getItem('myProjects') || '[]');

  projects.unshift({
    id,
    name: name.trim(),
    lab,
    status: 'status-progress',
    createdAt: new Date().toISOString()
  });

  localStorage.setItem('myProjects', JSON.stringify(projects));
  return id;
}
