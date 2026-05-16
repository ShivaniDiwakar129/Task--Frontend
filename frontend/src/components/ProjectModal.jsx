import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProjectModal = ({ closeModal, refreshProjects, editingProject }) => {
    const [formData, setFormData] = useState({
        projectName: editingProject?.projectName || '',
        description: editingProject?.description || '',
        members: editingProject?.members?.map(m => m._id) || []
    });
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/auth/users');
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users");
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, formData);
            } else {
                await api.post('/projects', formData);
            }
            refreshProjects();
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleMemberToggle = (userId) => {
        setFormData(prev => {
            const isMember = prev.members.includes(userId);
            if (isMember) {
                return { ...prev, members: prev.members.filter(id => id !== userId) };
            } else {
                return { ...prev, members: [...prev.members, userId] };
            }
        });
    };

    return (
        <div className="modal-overlay">
            <div className="auth-container" style={{maxWidth: '540px'}}>
                <h2 className="auth-title" style={{fontSize: '1.75rem', marginBottom: '1.5rem'}}>{editingProject ? 'Edit Project' : 'Create Project'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Project Name</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={formData.projectName}
                            onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea 
                            className="form-input" 
                            rows="3"
                            style={{resize: 'vertical'}}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Assign Members</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Search users by name or email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ marginBottom: '1rem' }}
                        />
                        <div className="members-select-list">
                            {filteredUsers.map(u => (
                                <label key={u._id} className="member-checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.members.includes(u._id)}
                                        onChange={() => handleMemberToggle(u._id)}
                                    />
                                    <span style={{fontSize: '0.9rem'}}>
                                        <strong style={{color: 'var(--text-primary)'}}>{u.name}</strong> <span style={{color: 'var(--text-secondary)'}}>({u.email})</span>
                                    </span>
                                </label>
                            ))}
                            {filteredUsers.length === 0 && (
                                <div style={{padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)'}}>
                                    No users found
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '1rem', marginTop: '2.5rem'}}>
                        <button type="button" className="auth-button secondary" style={{marginTop: 0}} onClick={closeModal}>Cancel</button>
                        <button type="submit" className="auth-button" style={{marginTop: 0}}>
                            {editingProject ? 'Save Changes' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
