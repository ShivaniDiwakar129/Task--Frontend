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
            <div className="auth-container" style={{maxWidth: '500px', animation: 'scaleIn 0.3s ease-out'}}>
                <h2 className="auth-title">{editingProject ? 'Edit Project' : 'Create Project'}</h2>
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
                            style={{ marginBottom: '0.5rem' }}
                        />
                        <div className="members-select-list">
                            {filteredUsers.map(u => (
                                <label key={u._id} className="member-checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.members.includes(u._id)}
                                        onChange={() => handleMemberToggle(u._id)}
                                    />
                                    <span>{u.name} ({u.email})</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                        <button type="button" className="auth-button logout-btn" style={{marginTop: 0}} onClick={closeModal}>Cancel</button>
                        <button type="submit" className="auth-button" style={{marginTop: 0}}>
                            {editingProject ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
