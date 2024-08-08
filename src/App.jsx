import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import LeadManagement from './component/Lead/LeadManagement';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route
                        path="/lead-management"
                        element={isAuthenticated ? <LeadManagement onLogout={handleLogout} /> : <Navigate to="/login" />}
                    />
                    <Route path="/" element={<Navigate to={isAuthenticated ? "/lead-management" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
