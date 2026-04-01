import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorProfile from './pages/doctor/DoctorProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import AddDoctor from './pages/admin/AddDoctor';
import ManageDepartments from './pages/admin/ManageDepartments';
import EditDepartment from './pages/admin/EditDepartment';
import AddDepartment from './pages/admin/AddDepartment';
import ManagePatients from './pages/admin/ManagePatients';
import ManageAppointments from './pages/admin/ManageAppointments';
import AdminDoctorSchedule from './pages/admin/AdminDoctorSchedule';
import EditDoctorSchedule from './pages/admin/EditDoctorSchedule';
import AddDoctorSchedule from './pages/admin/AddDoctorSchedule';
import AdminProfile from './pages/admin/AdminProfile';
import ForgotPassword from './pages/ForgotPassword';
import CheckEmail from './pages/CheckEmail';

function App() {
  return (
    <Router>
      <div className="app flex-column min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/about" element={<About />} />
             <Route path="/contact" element={<Contact />} />
             <Route path="/register" element={<Register />} />
             <Route path="/login" element={<Login />} />
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/find-doctors" element={<FindDoctors />} />
             <Route path="/book-appointment" element={<BookAppointment />} />
             <Route path="/my-appointments" element={<MyAppointments />} />
             <Route path="/medical-records" element={<MedicalRecords />} />
             <Route path="/feedback" element={<Feedback />} />
             <Route path="/profile" element={<Profile />} />
             <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
             <Route path="/doctor/appointments" element={<DoctorAppointments />} />
             <Route path="/doctor/schedule" element={<DoctorSchedule />} />
             <Route path="/doctor/profile" element={<DoctorProfile />} />
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
             <Route path="/admin/manage-doctors" element={<ManageDoctors />} />
             <Route path="/admin/add-doctor" element={<AddDoctor />} />
             <Route path="/admin/departments" element={<ManageDepartments />} />
             <Route path="/admin/edit-department" element={<EditDepartment />} />
             <Route path="/admin/add-department" element={<AddDepartment />} />
             <Route path="/admin/patients" element={<ManagePatients />} />
             <Route path="/admin/appointments" element={<ManageAppointments />} />
             <Route path="/admin/doctor-schedule" element={<AdminDoctorSchedule />} />
             <Route path="/admin/edit-schedule" element={<EditDoctorSchedule />} />
             <Route path="/admin/add-schedule" element={<AddDoctorSchedule />} />
             <Route path="/admin/profile" element={<AdminProfile />} />
             <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/check-email" element={<CheckEmail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
