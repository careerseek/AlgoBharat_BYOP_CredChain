/* eslint-disable prettier/prettier */
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import './styles/main.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
        path="/dashboard"
        element={
          localStorage.getItem("cred_user")
            ? <Dashboard />
            : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}