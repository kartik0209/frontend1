// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              path="/forgot-password" 
              element={<ForgotPassword />} />
            <Route 
              path="/dashboard" 
              element={
              
                  <Dashboard />
              
              } 
            />
            <Route 
              path="/users" 
              element={
          
                  <Users />
             
              } 
            />
            <Route 
              path="/settings" 
              element={
                
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Settings Page</h2>
                    <p>Coming Soon...</p>
                  </div>
              
              } 
            />
          </Routes>
        </Layout>
      </Router>

  );
}

export default App;