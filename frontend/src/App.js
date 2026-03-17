import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/payment/:bookingId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/ticket/:bookingId" element={<ProtectedRoute><TicketPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
