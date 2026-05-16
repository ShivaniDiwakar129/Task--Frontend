import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProjectModal from '../components/ProjectModal';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const fetchData = async () => {
        try {
            const projRes = await api.get('/projects');
            setProjects(projRes.data);
            
            const analyticsRes = await api.get('/dashboard');
            setAnalytics(analyticsRes.data);
        } catch (err) {
            console.error("Failed to fetch data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if(window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchData();
            } catch (err) {
                console.error("Failed to delete");
            }
        }
    };

    const openEditModal = (e, project) => {
        e.stopPropagation();
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    return (
        <div className="dashboard-layout animate-fade-in">
            <header className="dashboard-header animate-fade-in stagger-1">
                <div>
                    <h1 className="auth-title" style={{textAlign: 'left', marginBottom: '0.25rem'}}>Admin Dashboard</h1>
                    <p className="auth-subtitle" style={{textAlign: 'left', marginBottom: 0}}>Welcome back, {user?.name}</p>
                </div>
                <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                    <span className="role-badge admin">Administrator</span>
                    <button className="auth-button secondary" style={{marginTop: 0, padding: '0.6rem 1.5rem'}} onClick={logout}>Sign Out</button>
                </div>
            </header>

            {analytics && (
                <div className="stats-grid animate-fade-in stagger-2">
                    <div className="stat-card">
                        <h3 className="stat-value" style={{color: 'var(--accent-primary)'}}>{analytics.totalTasks}</h3>
                        <p className="stat-label">Total Tasks</p>
                    </div>
                    <div className="stat-card">
                        <h3 className="stat-value" style={{color: 'var(--success-color)'}}>{analytics.statusCounts.find(s => s._id === 'Done')?.count || 0}</h3>
                        <p className="stat-label">Completed Tasks</p>
                    </div>
                    <div className="stat-card" style={{border: analytics.overdueTasks > 0 ? '1px solid rgba(244, 63, 94, 0.3)' : ''}}>
                        <h3 className="stat-value" style={{color: 'var(--error-color)'}}>{analytics.overdueTasks}</h3>
                        <p className="stat-label">Overdue Tasks</p>
                    </div>
                </div>
            )}

            <div className="dashboard-actions animate-fade-in stagger-3">
                <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Active Projects</h2>
                <button className="auth-button" style={{width: 'auto', marginTop: 0, padding: '0.75rem 1.5rem'}} onClick={openCreateModal}>+ New Project</button>
            </div>

            <div className="projects-grid animate-fade-in stagger-4">
                {projects.map(project => (
                    <div 
                        key={project._id} 
                        className="project-card" 
                        onClick={() => navigate(`/project/${project._id}`)}
                        style={{cursor: 'pointer'}}
                    >
                        <h3 className="project-title">{project.projectName}</h3>
                        <p className="project-desc">{project.description || 'No description provided.'}</p>
                        <div className="project-meta">
                            <span><strong style={{color:'var(--text-primary)', fontWeight:600}}>Created by:</strong> {project.createdBy?.name || 'Unknown'}</span>
                            <span><strong style={{color:'var(--text-primary)', fontWeight:600}}>Team Members:</strong> {project.members?.length || 0}</span>
                        </div>
                        <div className="project-actions">
                            <button className="action-btn edit" onClick={(e) => openEditModal(e, project)}>Edit</button>
                            <button className="action-btn delete" onClick={(e) => handleDelete(e, project._id)}>Delete</button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="project-card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '4rem'}}>
                        <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>No projects found. Create one to get started.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <ProjectModal 
                    closeModal={() => setIsModalOpen(false)} 
                    refreshProjects={fetchData}
                    editingProject={editingProject}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
