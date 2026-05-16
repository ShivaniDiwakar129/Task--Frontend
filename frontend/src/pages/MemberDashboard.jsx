import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MemberDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
            } catch (err) {
                console.error("Failed to fetch projects");
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="dashboard-layout animate-fade-in">
            <header className="dashboard-header animate-fade-in stagger-1">
                <div>
                    <h1 className="auth-title" style={{textAlign: 'left', marginBottom: '0.25rem'}}>My Workspace</h1>
                    <p className="auth-subtitle" style={{textAlign: 'left', marginBottom: 0}}>Welcome back, {user?.name}</p>
                </div>
                <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                    <span className="role-badge member">Team Member</span>
                    <button className="auth-button secondary" style={{marginTop: 0, padding: '0.6rem 1.5rem'}} onClick={logout}>Sign Out</button>
                </div>
            </header>

            <div className="dashboard-actions animate-fade-in stagger-2">
                <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Assigned Projects</h2>
            </div>

            <div className="projects-grid animate-fade-in stagger-3">
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
                            <div className="member-list" style={{lineHeight: 1.5}}>
                                <strong style={{color:'var(--text-primary)', fontWeight:600}}>Team:</strong> {project.members?.map(m => m.name).join(', ') || 'None'}
                            </div>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="project-card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '4rem'}}>
                        <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>You have not been assigned to any projects yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberDashboard;
