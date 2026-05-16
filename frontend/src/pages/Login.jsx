import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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
                    <h2 className="auth-title">Welcome back</h2>
                    <p className="auth-subtitle">Sign in to your workspace</p>
                    
                    {error && <div className="form-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
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
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-input" 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-button">Sign In</button>
                    </form>
                    <p className="auth-link-text">
                        Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
