# 🏥 Hospital Management System

A full-stack web application for managing hospital operations including patient appointments, doctor schedules, billing, medical records, and more.

---

## 🚀 Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM
- Axios
- React Toastify
- Lucide React (icons)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (email notifications)
- Multer (file uploads)
- Node-Cron (scheduled reminders)

---

## ✨ Features

### 👤 Patient Portal
- Register / Login / Forgot Password (email reset link)
- Book appointments with doctor schedule & leave validation
- Reschedule or cancel appointments
- View & pay bills (UPI payment request system)
- View medical records & prescriptions
- In-app notifications (bell icon)
- Submit feedback
- Welcome email on registration

### 👨‍⚕️ Doctor Panel
- View & manage appointments (approve / complete / cancel)
- Add prescriptions when completing appointments
- Auto-generate bill after appointment completion
- View all patients with visit history
- Upload & email medical reports to patients
- Set weekly availability schedule
- Mark leave dates (blocks patient booking)
- Manage billing for patients

### 🛡️ Admin Panel
- Dashboard with stats (doctors, patients, appointments, departments)
- Add / delete doctors
- View all patients
- Approve / cancel appointments
- Create & manage bills (add extra charges)
- Verify payments and mark bills as Paid
- View departments (auto-grouped by doctor specialization)
- Admin profile management

### 📧 Email Notifications
- Welcome email on registration
- Password reset link
- Appointment approval / cancellation
- Bill generated with UPI payment details
- Payment request notification to admin
- Payment receipt to patient
- Medical report attachment
- Daily appointment reminders (8 AM cron job)

---

## 📁 Project Structure

```
Hospital-Management-System/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   │   ├── admin/
│   │   ├── doctor/
│   │   └── (patient pages)
│   ├── api.js
│   └── App.jsx
├── public/
└── index.html
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Gmail account with App Password

### 1. Clone the repository
```bash
git clone https://github.com/NEEL0508/Hospital-Management-System.git
cd Hospital-Management-System
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd backend
npm install
```

### 4. Create backend `.env` file
Create `backend/.env` with the following:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hospital_management
JWT_SECRET=your_jwt_secret_key

# Email (Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173

# Hospital UPI ID for payments
HOSPITAL_UPI_ID=your_upi_id@bank
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate

### 5. Run the project

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

### 6. Open in browser
```
http://localhost:5173
```

---

## 👥 Default Roles

| Role | How to Create |
|------|--------------|
| Patient | Register from the website |
| Doctor | Admin adds from Admin Panel → Manage Doctors |
| Admin | Manually set `role: "Admin"` in MongoDB for a user |

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| `/` | Home page |
| `/register` | Patient registration |
| `/login` | Login for all roles |
| `/dashboard` | Patient dashboard |
| `/book-appointment` | Book appointment with doctor |
| `/my-appointments` | View, reschedule, cancel appointments |
| `/my-bills` | View bills and submit payment request |
| `/medical-records` | View prescriptions and records |
| `/doctor/dashboard` | Doctor overview |
| `/doctor/appointments` | Manage appointments + billing |
| `/doctor/patients` | Patient list + report upload |
| `/doctor/leave` | Mark unavailable dates |
| `/admin/dashboard` | Admin overview |
| `/admin/billing` | Manage all bills |
| `/admin/appointments` | Approve/cancel appointments |

---

## 🔐 Security
- JWT-based authentication
- Role-based route protection (Patient / Doctor / Admin)
- `.env` file excluded from version control
- Passwords hashed with bcryptjs

---

## 📄 License

This project is for educational purposes.

---

## 🙋‍♂️ Author

**Neel Pavasiya**  
[GitHub](https://github.com/NEEL0508)
