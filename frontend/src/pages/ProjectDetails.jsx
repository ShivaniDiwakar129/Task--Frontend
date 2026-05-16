import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchData = async () => {
        try {
            const projRes = await api.get(`/projects/${id}`);
            setProject(projRes.data);
            const taskRes = await api.get(`/tasks?projectId=${id}`);
            setTasks(taskRes.data);
        } catch (err) {
            console.error("Failed to load project details");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            fetchData();
        } catch (err) {
            console.error("Failed to update status");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if(window.confirm('Delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchData();
            } catch (err) {
                console.error("Failed to delete task");
            }
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    if (!project) return <div style={{color:'white', padding:'2rem'}}>Loading...</div>;

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div>
                    <button onClick={() => navigate('/dashboard')} style={{background:'transparent', border:'none', color:'var(--text-secondary)', cursor:'pointer', marginBottom:'0.5rem'}}>← Back to Dashboard</button>
                    <h1 className="auth-title" style={{textAlign: 'left', marginBottom: 0}}>{project.projectName}</h1>
                    <p className="auth-subtitle" style={{textAlign: 'left', marginBottom: 0}}>{project.description}</p>
                </div>
            </header>

            <div className="dashboard-actions">
                <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Tasks</h2>
                {user?.role === 'admin' && (
                    <button className="auth-button" style={{width: 'auto', marginTop: 0}} onClick={openCreateModal}>+ Create Task</button>
                )}
            </div>

            <div className="projects-grid">
                {tasks.map(task => (
                    <div key={task._id} className="project-card" style={{borderTop: `4px solid ${task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981'}`}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                            <h3 className="project-title" style={{fontSize: '1.1rem'}}>{task.title}</h3>
                            <span className="role-badge" style={{background: 'rgba(255,255,255,0.1)', color:'white', border:'none'}}>{task.status}</span>
                        </div>
                        <p className="project-desc">{task.description}</p>
                        
                        <div className="project-meta">
                            <span>Assigned to: {task.assignedTo?.name || 'Unassigned'}</span>
                            <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                        </div>
                        
                        <div className="project-actions" style={{marginTop:'1rem', flexWrap: 'wrap'}}>
                            {(user?.role === 'admin' || (task.assignedTo && task.assignedTo._id === user?._id)) && (
                                <select 
                                    className="form-input" 
                                    style={{padding:'0.25rem 0.5rem', width:'auto', fontSize:'0.75rem', marginBottom:'0.5rem'}}
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            )}
                            
                            {user?.role === 'admin' && (
                                <div style={{display:'flex', gap:'0.5rem', marginLeft:'auto'}}>
                                    <button className="action-btn edit" onClick={() => openEditModal(task)}>Edit</button>
                                    <button className="action-btn delete" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p style={{color: 'var(--text-secondary)'}}>No tasks found for this project.</p>
                )}
            </div>

            {isModalOpen && user?.role === 'admin' && (
                <TaskModal 
                    closeModal={() => setIsModalOpen(false)} 
                    refreshTasks={fetchData}
                    editingTask={editingTask}
                    projectId={project._id}
                    projectMembers={project.members}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
