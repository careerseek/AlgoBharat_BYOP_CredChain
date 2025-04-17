import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import DigilockerAuth from './components/DigilockerAuth';
import MyDocuments from './components/Mydocuments';
import Layout from './components/Layout';
import Verify from './components/VerifyDocuments';
import About from './components/About';
import GetFromDigilocker from './components/GetFromDigiLocker';



function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a spinner

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        
        element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />}
      />
      <Route path="/get/digilocker" element={<Layout><GetFromDigilocker /></Layout>} />
      <Route
        path="/digilocker/auth"
        element={user ? <DigilockerAuth /> : <Navigate to="/login" />}
      />
      <Route path="/documents" element={<Layout><MyDocuments /></Layout>} />
      <Route path="/verify" element={<Layout><Verify /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}