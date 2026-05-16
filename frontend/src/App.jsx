import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProjectDetails from './pages/ProjectDetails';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const DashboardRouter = () => {
    const { user } = useContext(AuthContext);
    if (user?.role === 'admin') {
        return <AdminDashboard />;
    }
    return <MemberDashboard />;
};

function App() {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
                <Route path="/project/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
