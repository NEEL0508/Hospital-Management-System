import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FindDoctors from './pages/FindDoctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MedicalRecords from './pages/MedicalRecords';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import MyBills from './pages/MyBills';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorBilling from './pages/doctor/DoctorBilling';
import DoctorLeave from './pages/doctor/DoctorLeave';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import AddDoctor from './pages/admin/AddDoctor';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManagePatients from './pages/admin/ManagePatients';
import ManageAppointments from './pages/admin/ManageAppointments';
import AdminProfile from './pages/admin/AdminProfile';
import ManageBills from './pages/admin/ManageBills';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app flex-column min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Patient */}
            <Route path="/dashboard" element={<ProtectedRoute roles={['Patient']}><Dashboard /></ProtectedRoute>} />
            <Route path="/find-doctors" element={<ProtectedRoute><FindDoctors /></ProtectedRoute>} />
            <Route path="/book-appointment" element={<ProtectedRoute roles={['Patient']}><BookAppointment /></ProtectedRoute>} />
            <Route path="/my-appointments" element={<ProtectedRoute roles={['Patient']}><MyAppointments /></ProtectedRoute>} />
            <Route path="/medical-records" element={<ProtectedRoute roles={['Patient']}><MedicalRecords /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute roles={['Patient']}><Feedback /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-bills" element={<ProtectedRoute roles={['Patient']}><MyBills /></ProtectedRoute>} />

            {/* Doctor */}
            <Route path="/doctor/dashboard" element={<ProtectedRoute roles={['Doctor']}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/appointments" element={<ProtectedRoute roles={['Doctor']}><DoctorAppointments /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute roles={['Doctor']}><DoctorPatients /></ProtectedRoute>} />
            <Route path="/doctor/billing" element={<ProtectedRoute roles={['Doctor']}><DoctorBilling /></ProtectedRoute>} />
            <Route path="/doctor/leave" element={<ProtectedRoute roles={['Doctor']}><DoctorLeave /></ProtectedRoute>} />
            <Route path="/doctor/schedule" element={<ProtectedRoute roles={['Doctor']}><DoctorSchedule /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute roles={['Doctor']}><DoctorProfile /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/manage-doctors" element={<ProtectedRoute roles={['Admin']}><ManageDoctors /></ProtectedRoute>} />
            <Route path="/admin/add-doctor" element={<ProtectedRoute roles={['Admin']}><AddDoctor /></ProtectedRoute>} />
            <Route path="/admin/departments" element={<ProtectedRoute roles={['Admin']}><ManageDepartments /></ProtectedRoute>} />
            <Route path="/admin/patients" element={<ProtectedRoute roles={['Admin']}><ManagePatients /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute roles={['Admin']}><ManageAppointments /></ProtectedRoute>} />
            <Route path="/admin/billing" element={<ProtectedRoute roles={['Admin']}><ManageBills /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute roles={['Admin']}><AdminProfile /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
