import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app flex-column min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/register" element={<Register />} />
             <Route path="/login" element={<Login />} />
             <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
