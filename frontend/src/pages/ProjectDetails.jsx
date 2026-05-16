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

    if (!project) return (
        <div className="dashboard-layout animate-fade-in" style={{justifyContent: 'center', alignItems: 'center'}}>
            <div style={{fontSize: '1.25rem', color: 'var(--text-secondary)'}}>Loading project...</div>
        </div>
    );

    return (
        <div className="dashboard-layout animate-fade-in">
            <header className="dashboard-header animate-fade-in stagger-1" style={{alignItems: 'flex-start', flexDirection: 'column'}}>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    style={{background:'transparent', border:'none', color:'var(--accent-secondary)', cursor:'pointer', marginBottom:'1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600}}
                >
                    <span style={{fontSize: '1.2rem'}}>←</span> Back to Dashboard
                </button>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <div>
                        <h1 className="auth-title" style={{textAlign: 'left', marginBottom: '0.5rem'}}>{project.projectName}</h1>
                        <p className="auth-subtitle" style={{textAlign: 'left', marginBottom: 0, maxWidth: '800px'}}>{project.description}</p>
                    </div>
                    {user?.role === 'admin' && (
                        <button className="auth-button" style={{width: 'auto', marginTop: 0, padding: '0.75rem 1.5rem'}} onClick={openCreateModal}>+ Create Task</button>
                    )}
                </div>
            </header>

            <div className="dashboard-actions animate-fade-in stagger-2">
                <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Project Tasks</h2>
            </div>

            <div className="projects-grid animate-fade-in stagger-3">
                {tasks.map(task => {
                    const statusClass = task.status === 'Done' ? 'status-done' : task.status === 'In Progress' ? 'status-progress' : 'status-todo';
                    const priorityClass = task.priority === 'High' ? 'priority-high' : task.priority === 'Medium' ? 'priority-medium' : 'priority-low';
                    
                    return (
                        <div key={task._id} className={`project-card ${priorityClass}`}>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: '1rem'}}>
                                <h3 className="project-title" style={{fontSize: '1.25rem', marginBottom: 0}}>{task.title}</h3>
                                <span className={`status-badge ${statusClass}`}>{task.status}</span>
                            </div>
                            <p className="project-desc">{task.description || 'No description provided.'}</p>
                            
                            <div className="project-meta">
                                <span style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span><strong style={{color:'var(--text-primary)', fontWeight:600}}>Assigned to:</strong> {task.assignedTo?.name || 'Unassigned'}</span>
                                    <span><strong style={{color:'var(--text-primary)', fontWeight:600}}>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                                </span>
                            </div>
                            
                            <div className="project-actions" style={{marginTop:'1.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
                                {(user?.role === 'admin' || (task.assignedTo && task.assignedTo._id === user?._id)) && (
                                    <select 
                                        className="form-input" 
                                        style={{padding:'0.5rem 1rem', width:'auto', fontSize:'0.85rem', marginBottom: 0, background: 'rgba(0,0,0,0.5)', borderColor: 'var(--border-subtle)'}}
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                )}
                                
                                {user?.role === 'admin' && (
                                    <div style={{display:'flex', gap:'0.75rem', marginLeft:'auto'}}>
                                        <button className="action-btn edit" onClick={() => openEditModal(task)}>Edit</button>
                                        <button className="action-btn delete" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {tasks.length === 0 && (
                    <div className="project-card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '4rem'}}>
                        <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>No tasks found for this project. {user?.role === 'admin' && 'Create one to get started.'}</p>
                    </div>
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
