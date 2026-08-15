import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type ProjectStatus = 'status-progress' | 'status-testing' | 'status-completed'

type Project = {
  id: string
  name: string
  lab: string
  labLabel: string
  status: ProjectStatus
  createdAt: string
}

type LabOption = {
  name: string
  path: string
  icon: string
}

const labs: LabOption[] = [
  { name: 'Embedded Lab', path: '/lab/iot', icon: 'fa-laptop-code' },
  { name: 'Assembly', path: '/lab/assembly', icon: 'fa-code' },
  { name: 'Circuit', path: '/lab/circuit', icon: 'fa-bolt' },
  { name: 'Network Lab', path: '/lab/network', icon: 'fa-microchip' },
]

const statusOrder: ProjectStatus[] = ['status-progress', 'status-testing', 'status-completed']

const suggestions = [
  { name: 'Smart Energy Monitor', lab: '/lab/circuit' },
  { name: 'Robotic Arm Controller', lab: '/lab/assembly' },
  { name: 'Control Gateway Demo', lab: '/lab/iot' },
  { name: 'Secure Mesh Network', lab: '/lab/network' },
]

function getSavedProjects(): Project[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem('myProjects')
    return raw ? (JSON.parse(raw) as Project[]) : []
  } catch {
    return []
  }
}

function getLabLabel(path: string) {
  return labs.find((lab) => lab.path === path)?.name ?? path
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>(() => getSavedProjects())
  const [activity, setActivity] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []

    const stored = window.localStorage.getItem('recentActivity')
    if (stored) {
      try {
        return JSON.parse(stored) as string[]
      } catch {
        return []
      }
    }

    return []
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [selectedLab, setSelectedLab] = useState(labs[0].path)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('myProjects', JSON.stringify(projects))
    }
  }, [projects])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('recentActivity', JSON.stringify(activity))
    }
  }, [activity])

  const filteredLabs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return []

    return labs.filter((lab) => lab.name.toLowerCase().includes(query))
  }, [searchQuery])

  const stats = useMemo(() => {
    const completed = projects.filter((project) => project.status === 'status-completed').length
    const pending = Math.max(projects.length - completed, 0)
    const reviews = Number(typeof window !== 'undefined' ? window.localStorage.getItem('aiReviews') ?? '0' : '0') || 0
    const hours = Number(typeof window !== 'undefined' ? window.localStorage.getItem('simHours') ?? '0' : '0') || 0

    return { completed, pending, reviews, hours }
  }, [projects])

  const latestProject = projects[0] ?? null

  const closeModal = () => {
    setModalOpen(false)
    setProjectName('')
  }

  const addProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = projectName.trim()
    if (!trimmed) return

    const newProject: Project = {
      id: `project_${Date.now()}`,
      name: trimmed,
      lab: selectedLab,
      labLabel: getLabLabel(selectedLab),
      status: 'status-progress',
      createdAt: new Date().toISOString(),
    }

    setProjects((current) => [newProject, ...current])
    setActivity((current) => [`${trimmed} was added to ${newProject.labLabel}.`, ...current].slice(0, 4))
    closeModal()
  }

  const addSuggestedProject = (name: string, labPath: string) => {
    const nextProject: Project = {
      id: `project_${Date.now()}`,
      name,
      lab: labPath,
      labLabel: getLabLabel(labPath),
      status: 'status-progress',
      createdAt: new Date().toISOString(),
    }

    setProjects((current) => [nextProject, ...current])
    setActivity((current) => [`${name} was added to ${nextProject.labLabel}.`, ...current].slice(0, 4))
  }

  const removeProject = (projectId: string) => {
    setProjects((current) => {
      const removed = current.find((project) => project.id === projectId)
      if (removed && typeof window !== 'undefined') {
        window.localStorage.removeItem(`projectProgress_${removed.id}`)
      }
      return current.filter((project) => project.id !== projectId)
    })
  }

  const cycleProjectStatus = (projectId: string) => {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project

        const currentIndex = statusOrder.indexOf(project.status)
        const nextIndex = (currentIndex + 1) % statusOrder.length

        return {
          ...project,
          status: statusOrder[nextIndex],
        }
      }),
    )
  }

  const latestLab = latestProject ? getLabLabel(latestProject.lab) : null

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <h2>Virtual Hub</h2>
        <ul className="dashboard-nav">
          {labs.map((lab) => (
            <li
              key={lab.path}
              className={latestProject && latestProject.lab === lab.path ? 'active' : ''}
              onClick={() => navigate(lab.path)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(lab.path)
                }
              }}
              tabIndex={0}
              role="link"
            >
              <i className={`fa-solid ${lab.icon}`} />
              <span>{lab.name}</span>
            </li>
          ))}
        </ul>

        <div className="dashboard-ai-agent">
          <div className="dashboard-ai-circle">
            <img src="/images/robot.dashboard.png" alt="Robot assistant" />
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="dashboard-search-wrapper">
            <label className="sr-only" htmlFor="dashboard-search-input">
              Search labs
            </label>
            <i className="fa-solid fa-magnifying-glass dashboard-search-icon" aria-hidden="true" />
            <input
              id="dashboard-search-input"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search Lab..."
              autoComplete="off"
            />

            {searchQuery.trim() && (
              <div className="dashboard-search-results" style={{ display: 'block' }}>
                {filteredLabs.length > 0 ? (
                  filteredLabs.map((lab) => (
                    <div key={lab.path} className="dashboard-search-item" onClick={() => navigate(lab.path)}>
                      <i className={`fa-solid ${lab.icon}`} />
                      <span>{lab.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="dashboard-search-item no-match">No labs found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <section className="dashboard-cards" aria-label="Dashboard statistics">
          <div className="dashboard-card">
            <i className="fa-solid fa-flask" />
            <h3>Completed Labs</h3>
            <h1>{stats.completed}</h1>
          </div>

          <div className="dashboard-card">
            <i className="fa-solid fa-clock" />
            <h3>Simulation Hours</h3>
            <h1>{stats.hours}h</h1>
          </div>

          <div className="dashboard-card">
            <i className="fa-solid fa-robot" />
            <h3>AI Reviews</h3>
            <h1>{stats.reviews}</h1>
          </div>

          <div className="dashboard-card">
            <i className="fa-solid fa-list-check" />
            <h3>Pending Labs</h3>
            <h1>{stats.pending}</h1>
          </div>
        </section>

        <div className="dashboard-hero">
          <div className="dashboard-welcome">
            <h1>{latestProject ? `Continue ${latestProject.name}` : 'Welcome to Virtual Hub'}</h1>
            <p>
              {latestProject
                ? `Jump back into ${latestLab} and keep building your project.`
                : 'Practice your engineering labs using AI-powered simulations.'}
            </p>
            <div className="dashboard-welcome-meta">
              {latestProject ? (
                <>
                  <span className="meta-pill">{latestProject.labLabel}</span>
                  <span className="meta-pill">{projects.length} project{projects.length === 1 ? '' : 's'}</span>
                </>
              ) : (
                <>
                  <span className="meta-pill">4 active labs</span>
                  <span className="meta-pill">AI insights</span>
                </>
              )}
            </div>

            {latestProject && (
              <button type="button" className="dashboard-welcome-action" onClick={() => navigate(latestProject.lab)}>
                Continue Project <i className="fa-solid fa-arrow-right" />
              </button>
            )}
          </div>

          <div className="dashboard-hero-image">
            <img src="/images/robot.dashboard.png" alt="Robot image" />
          </div>
        </div>

        <div className="dashboard-bottom">
          <section className="dashboard-projects-panel">
            <div className="dashboard-panel-header">
              <h2>My Projects</h2>
              <button type="button" className="dashboard-add-btn" onClick={() => setModalOpen(true)}>
                + Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <p className="dashboard-empty-note">No projects yet — add one or pick a suggestion below.</p>
            ) : (
              <div className="dashboard-project-list">
                {projects.map((project) => (
                  <div key={project.id} className="dashboard-project-item">
                    <div className="dashboard-project-main">
                      <span className="dashboard-project-name" onClick={() => navigate(project.lab)}>
                        {project.name}
                      </span>
                      <span className="dashboard-lab-tag">{project.labLabel}</span>
                    </div>

                    <div className="dashboard-project-actions">
                      <button
                        type="button"
                        className={`dashboard-status ${project.status}`}
                        onClick={() => cycleProjectStatus(project.id)}
                      >
                        {project.status === 'status-progress'
                          ? 'In Progress'
                          : project.status === 'status-testing'
                            ? 'Testing'
                            : 'Completed'}
                      </button>
                      <span className="dashboard-delete-project" onClick={() => removeProject(project.id)}>
                        ×
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 className="dashboard-suggestions-title">Suggested Projects</h3>
            <div className="dashboard-suggestions">
              {suggestions.map((suggestion) => (
                <div key={suggestion.name} className="dashboard-suggestion-item">
                  <div className="dashboard-suggestion-copy">
                    <span className="dashboard-suggestion-name">{suggestion.name}</span>
                    <span className="dashboard-lab-tag">{getLabLabel(suggestion.lab)}</span>
                  </div>
                  <button type="button" className="dashboard-add-suggestion-btn" onClick={() => addSuggestedProject(suggestion.name, suggestion.lab)}>
                    Add
                  </button>
                </div>
              ))}
            </div>
          </section>

          <aside className="dashboard-activity-panel">
            <h2>Recent Lab Activity</h2>
            <div className="dashboard-activity-list">
              {activity.length > 0 ? (
                activity.map((entry, index) => <p key={`${entry}-${index}`}>{entry}</p>)
              ) : (
                <p>No activity yet — complete a lab to see it here.</p>
              )}
            </div>
          </aside>
        </div>
      </main>

      {modalOpen && (
        <div className="dashboard-modal-overlay" onClick={closeModal}>
          <div className="dashboard-modal-box" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="dashboard-modal-close" onClick={closeModal} aria-label="Close add project dialog">
              ×
            </button>

            <form className="dashboard-project-form" onSubmit={addProject}>
              <h3>Add Project</h3>
              <label htmlFor="project-name">Project name</label>
              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="e.g. Smart Sensor Network"
                required
              />

              <label htmlFor="project-lab">Lab</label>
              <select id="project-lab" value={selectedLab} onChange={(event) => setSelectedLab(event.target.value)}>
                {labs.map((lab) => (
                  <option key={lab.path} value={lab.path}>
                    {lab.name}
                  </option>
                ))}
              </select>

              <button type="submit" className="dashboard-submit-btn">
                Save Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
