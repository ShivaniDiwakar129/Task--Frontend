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
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div>
                    <h1 className="auth-title" style={{textAlign: 'left', marginBottom: 0}}>Admin Dashboard</h1>
                    <p className="auth-subtitle" style={{textAlign: 'left', marginBottom: 0}}>Welcome, {user?.name}</p>
                </div>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <span className="role-badge admin">Admin</span>
                    <button className="auth-button logout-btn" style={{marginTop: 0, padding: '0.5rem 1rem'}} onClick={logout}>Log Out</button>
                </div>
            </header>

            {analytics && (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
                    <div className="project-card" style={{padding: '1rem', textAlign: 'center'}}>
                        <h3 style={{fontSize: '2rem', margin: 0, color: 'var(--primary-color)'}}>{analytics.totalTasks}</h3>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Total Tasks</p>
                    </div>
                    <div className="project-card" style={{padding: '1rem', textAlign: 'center'}}>
                        <h3 style={{fontSize: '2rem', margin: 0, color: '#10b981'}}>{analytics.statusCounts.find(s => s._id === 'Done')?.count || 0}</h3>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Tasks Done</p>
                    </div>
                    <div className="project-card" style={{padding: '1rem', textAlign: 'center'}}>
                        <h3 style={{fontSize: '2rem', margin: 0, color: '#ef4444'}}>{analytics.overdueTasks}</h3>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Overdue Tasks</p>
                    </div>
                </div>
            )}

            <div className="dashboard-actions">
                <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Projects</h2>
                <button className="auth-button" style={{width: 'auto', marginTop: 0}} onClick={openCreateModal}>+ Create Project</button>
            </div>

            <div className="projects-grid">
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
                            <span>Created by: {project.createdBy?.name || 'Unknown'}</span>
                            <span>Members: {project.members?.length || 0}</span>
                        </div>
                        <div className="project-actions">
                            <button className="action-btn edit" onClick={(e) => openEditModal(e, project)}>Edit</button>
                            <button className="action-btn delete" onClick={(e) => handleDelete(e, project._id)}>Delete</button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <p style={{color: 'var(--text-secondary)'}}>No projects found. Create one to get started.</p>
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
