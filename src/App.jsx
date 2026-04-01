import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FindDoctors from './pages/FindDoctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MedicalRecords from './pages/MedicalRecords';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';

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
             <Route path="/find-doctors" element={<FindDoctors />} />
             <Route path="/book-appointment" element={<BookAppointment />} />
             <Route path="/my-appointments" element={<MyAppointments />} />
             <Route path="/medical-records" element={<MedicalRecords />} />
             <Route path="/feedback" element={<Feedback />} />
             <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
