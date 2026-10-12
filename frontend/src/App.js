import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import SurveyList from './components/Survey/SurveyList';
import GrievanceList from './components/Grievance/GrievanceList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && (
          <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">🇮🇳 CJP Platform</h1>
              <div className="space-x-4">
                <a href="/dashboard" className="hover:underline">Dashboard</a>
                <a href="/surveys" className="hover:underline">Surveys</a>
                <a href="/grievances" className="hover:underline">Grievances</a>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}
        
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/surveys" 
            element={user ? <SurveyList user={user} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/grievances" 
            element={user ? <GrievanceList user={user} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
