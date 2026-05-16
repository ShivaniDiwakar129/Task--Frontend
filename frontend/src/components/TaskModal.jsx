import React, { useState } from 'react';
import api from '../services/api';

const TaskModal = ({ closeModal, refreshTasks, editingTask, projectId, projectMembers }) => {
    const [formData, setFormData] = useState({
        title: editingTask?.title || '',
        description: editingTask?.description || '',
        assignedTo: editingTask?.assignedTo?._id || '',
        priority: editingTask?.priority || 'Medium',
        status: editingTask?.status || 'To Do',
        dueDate: editingTask?.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : '',
        project: projectId
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            refreshTasks();
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="auth-container" style={{maxWidth: '500px', animation: 'scaleIn 0.3s ease-out'}}>
                <h2 className="auth-title">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Task Title</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea 
                            className="form-input" 
                            rows="2"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    
                    <div style={{display:'flex', gap:'1rem'}}>
                        <div className="form-group" style={{flex: 1}}>
                            <label className="form-label">Assign To</label>
                            <select 
                                className="form-input"
                                value={formData.assignedTo}
                                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                            >
                                <option value="">Unassigned</option>
                                {projectMembers.map(m => (
                                    <option key={m._id} value={m._id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{flex: 1}}>
                            <label className="form-label">Due Date</label>
                            <input 
                                type="date" 
                                className="form-input" 
                                value={formData.dueDate}
                                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={{display:'flex', gap:'1rem'}}>
                        <div className="form-group" style={{flex: 1}}>
                            <label className="form-label">Priority</label>
                            <select 
                                className="form-input"
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="form-group" style={{flex: 1}}>
                            <label className="form-label">Status</label>
                            <select 
                                className="form-input"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                        <button type="button" className="auth-button logout-btn" style={{marginTop: 0}} onClick={closeModal}>Cancel</button>
                        <button type="submit" className="auth-button" style={{marginTop: 0}}>
                            {editingTask ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
