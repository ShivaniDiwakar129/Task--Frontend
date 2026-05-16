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
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div>
                    <h1 className="auth-title" style={{textAlign: 'left', marginBottom: 0}}>My Projects</h1>
                    <p className="auth-subtitle" style={{textAlign: 'left', marginBottom: 0}}>Welcome, {user?.name}</p>
                </div>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <span className="role-badge member">Member</span>
                    <button className="auth-button logout-btn" style={{marginTop: 0, padding: '0.5rem 1rem'}} onClick={logout}>Log Out</button>
                </div>
            </header>

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
                            <div className="member-list">
                                Team: {project.members?.map(m => m.name).join(', ') || 'None'}
                            </div>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <p style={{color: 'var(--text-secondary)'}}>You have not been assigned to any projects yet.</p>
                )}
            </div>
        </div>
    );
};

export default MemberDashboard;
