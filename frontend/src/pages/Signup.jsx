import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'member' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="split-layout animate-fade-in">
            <div className="split-left">
                <div className="hero-badge stagger-1 animate-fade-in">Collaborative Work OS</div>
                <h1 className="hero-title stagger-2 animate-fade-in">Task planning that<br/>feels calm, sharp,<br/>and real-time.</h1>
                <p className="hero-subtitle stagger-3 animate-fade-in">
                    A secure workspace for projects, tasks, teams, deadlines, comments, dashboards, and admin-controlled workflows.
                </p>
                
                <div style={{display: 'flex', gap: '3rem', marginTop: '4rem'}} className="stagger-4 animate-fade-in">
                    <div>
                        <div style={{fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>PROJECTS</div>
                        <div style={{fontWeight: 600, fontSize: '1.1rem'}}>Live collaboration</div>
                    </div>
                    <div>
                        <div style={{fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>TASKS</div>
                        <div style={{fontWeight: 600, fontSize: '1.1rem'}}>Real-time updates</div>
                    </div>
                    <div>
                        <div style={{fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>MEMBERS</div>
                        <div style={{fontWeight: 600, fontSize: '1.1rem'}}>Role-based access</div>
                    </div>
                </div>
            </div>

            <div className="split-right">
                <div className="auth-container animate-scale-in stagger-2">
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join the workspace to get started</p>
                    
                    {error && <div className="form-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Account Type</label>
                            <div className="role-selector">
                                <div 
                                    className={`role-chip ${formData.role === 'member' ? 'active' : ''}`}
                                    onClick={() => setFormData({...formData, role: 'member'})}
                                >
                                    Team Member
                                </div>
                                <div 
                                    className={`role-chip ${formData.role === 'admin' ? 'active' : ''}`}
                                    onClick={() => setFormData({...formData, role: 'admin'})}
                                >
                                    Administrator
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input 
                                type="email" 
                                className="form-input" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                        <div style={{display: 'flex', gap: '1rem'}}>
                            <div className="form-group" style={{flex: 1}}>
                                <label className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className="form-input" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{flex: 1}}>
                                <label className="form-label">Confirm</label>
                                <input 
                                    type="password" 
                                    className="form-input" 
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="auth-button">Sign Up</button>
                    </form>
                    <p className="auth-link-text">
                        Already have an account? <Link to="/login" className="auth-link">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
