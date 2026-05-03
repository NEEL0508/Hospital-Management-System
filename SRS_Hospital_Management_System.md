# Software Requirements Specification
## Hospital Management System
### Version 1.0 | Date: 03/05/2026
### Prepared by: Pathan Mohin, Neel Pavasiya, Amrita Rajesh Baliram
### Institution: RKU

---

## Revision History

| Version | Date       | Author                                              | Description                                      |
|---------|------------|-----------------------------------------------------|--------------------------------------------------|
| 1.0     | 03/05/2026 | Pathan Mohin, Neel Pavasiya, Amrita Rajesh Baliram | Initial release of SRS document                  |
| 0.9     | 15/04/2026 | Pathan Mohin                                        | Draft version for internal review                |
| 0.5     | 01/03/2026 | Neel Pavasiya                                       | Preliminary outline and feature list             |

---

## Table of Contents

1. Introduction
   - 1.1 Purpose
   - 1.2 Document Conventions
   - 1.3 Intended Audience and Reading Suggestions
   - 1.4 Project Scope
   - 1.5 References
2. Overall Description
   - 2.1 Product Perspective
   - 2.2 Product Features
   - 2.3 User Classes and Characteristics
   - 2.4 Operating Environment
   - 2.5 Design and Implementation Constraints
   - 2.6 User Documentation
   - 2.7 Assumptions and Dependencies
3. System Features
   - 3.1 User Authentication and Account Management
   - 3.2 Doctor Discovery and Search
   - 3.3 Appointment Booking and Management
   - 3.4 Doctor Schedule and Slot Management
   - 3.5 Medical Records and Reports
   - 3.6 Billing and Payment
   - 3.7 Doctor Patient Management and Diagnosis
   - 3.8 Admin Dashboard and Activity Overview
   - 3.9 Doctor Ratings and Reviews
   - 3.10 Notifications and Email Alerts
4. External Interface Requirements
   - 4.1 User Interfaces
   - 4.2 Hardware Interfaces
   - 4.3 Software Interfaces
   - 4.4 Communications Interfaces
5. Other Nonfunctional Requirements
   - 5.1 Performance Requirements
   - 5.2 Safety Requirements
   - 5.3 Security Requirements
   - 5.4 Software Quality Attributes
6. Other Requirements
- Appendix A: Glossary
- Appendix B: Analysis Models
- Appendix C: Issues List

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for the Hospital Management System (HMS), version 1.0. The HMS is a full-stack web application designed to digitize and streamline the core operations of a hospital or clinic, including patient registration, appointment scheduling, doctor schedule management, medical record keeping, billing, and inter-role communication via automated email notifications.

The purpose of this document is to provide a comprehensive and unambiguous description of the system to be developed, serving as a contractual baseline between the development team and stakeholders. It defines what the system shall do, the constraints under which it must operate, and the quality attributes it must satisfy. This document will guide the design, development, testing, and maintenance phases of the project lifecycle.

### 1.2 Document Conventions

This document follows the IEEE 830-1998 standard for Software Requirements Specifications. The following conventions are used throughout:

- **SHALL** indicates a mandatory requirement that the system must fulfill without exception.
- **SHOULD** indicates a recommended but not strictly mandatory requirement.
- **MAY** indicates an optional feature or behavior.
- **REQ-[MODULE]-[N]** is the unique requirement identifier format (e.g., REQ-AUTH-1 refers to the first requirement in the Authentication module).
- Priority levels used: **High** (critical for system operation), **Medium** (important but not blocking), **Low** (nice-to-have enhancement).
- Bold text is used for key terms, requirement IDs, and UI element names.
- Code-style formatting (`monospace`) is used for API endpoints, field names, database model attributes, and technical identifiers.
- All monetary values are expressed in Indian Rupees (INR) using the Indian locale number format (e.g., 1,00,000).

### 1.3 Intended Audience and Reading Suggestions

This document is intended for the following audiences:

**Development Team (Pathan Mohin, Neel Pavasiya, Amrita Rajesh Baliram):** Read all sections in full. Section 3 (System Features) and Section 4 (External Interface Requirements) are most critical for implementation. Section 5 covers non-functional requirements that must be addressed during development and code review.

**Project Supervisors and Academic Evaluators (RKU):** Focus on Sections 1 (Introduction), 2 (Overall Description), and 3 (System Features) for a high-level understanding of the system scope and capabilities. Section 5 provides insight into quality standards and security posture.

**Testers and QA Engineers:** Sections 3 and 5 are primary references for writing test cases. Each functional requirement (REQ-*) maps directly to one or more test scenarios. The stimulus/response sequences in each subsection describe expected system behavior.

**Future Maintainers:** Section 2 (Overall Description) and Appendix A (Glossary) provide context. Section 3 details all system behaviors. Appendix C (Issues List) documents known limitations and deferred items.

**End Users (Hospital Staff, Doctors, Patients):** The User Documentation section (2.6) and the feature descriptions in Section 3 provide a plain-language overview of system capabilities organized by role.

### 1.4 Project Scope

The Hospital Management System is a web-based application that serves three distinct user roles: **Patient**, **Doctor**, and **Admin**. The system is designed for use by a single hospital or clinic and is not intended as a multi-tenant SaaS platform in its current version.

**In Scope:**
- Patient self-registration and profile management with email-based password reset
- Doctor profile management by Admin (add/delete doctors, manage specializations)
- Appointment booking with real-time 30-minute slot availability visualization
- Doctor schedule management (weekly recurring availability and date-specific overrides)
- Doctor leave management with automatic slot blocking on leave dates
- Medical record storage and retrieval (Lab Reports, Prescriptions, Scan Reports, Other)
- Itemized billing with UPI-based manual payment workflow in Indian Rupees
- In-app notification system with bell icon and read/unread state
- Automated email notifications via Gmail SMTP for key lifecycle events
- Doctor ratings (1-5 stars with review text) and patient feedback collection
- Role-based access control enforced on both frontend (ProtectedRoute) and backend (JWT middleware)
- Admin oversight of all system entities including doctors, patients, appointments, bills, and activity

**Out of Scope:**
- Integration with external Electronic Health Record (EHR) or Hospital Information System (HIS) platforms
- Insurance claim processing and third-party payer integration
- Pharmacy inventory management and drug dispensing workflows
- Multi-hospital or multi-branch support
- Native mobile applications (iOS/Android)
- Real-time video or telemedicine consultations
- Direct online payment gateway integration (payments are UPI-manual, admin-verified)
- Laboratory Information System (LIS) integration
- Bed management and inpatient ward management

### 1.5 References

1. IEEE Std 830-1998  IEEE Recommended Practice for Software Requirements Specifications.
2. React 19 Documentation  https://react.dev
3. Express.js v5 Documentation  https://expressjs.com
4. Mongoose v9 Documentation  https://mongoosejs.com
5. JSON Web Tokens (JWT)  https://jwt.io
6. Nodemailer Documentation  https://nodemailer.com
7. Node-Cron Documentation  https://github.com/node-cron/node-cron
8. Vite Build Tool Documentation  https://vitejs.dev
9. React Router DOM v7  https://reactrouter.com
10. Project GitHub Repository  https://github.com/NEEL0508/Hospital-Management-System
11. MongoDB 7.x Documentation  https://www.mongodb.com/docs
12. bcryptjs  https://github.com/dcodeIO/bcrypt.js
13. Multer File Upload Middleware  https://github.com/expressjs/multer

---

## 2. Overall Description

### 2.1 Product Perspective

The Hospital Management System is a new, self-contained web application developed as an academic project at RKU. It is not a replacement for or extension of any existing legacy system. The system operates as a three-tier architecture:

- **Presentation Tier:** A React 19 single-page application (SPA) built with Vite, served from the `dist/` directory or via the Vite development server. The frontend communicates exclusively with the backend via RESTful HTTP API calls using Axios.
- **Application Tier:** A Node.js + Express.js v5 REST API server that handles all business logic, authentication, authorization, data validation, file processing, and email dispatch.
- **Data Tier:** A MongoDB database (version 7.x) accessed via Mongoose v9 ODM, running locally at `mongodb://127.0.0.1:27017/hospital_management`.

The system is accessed through a standard web browser. No desktop client or mobile application is provided. The backend exposes a RESTful API on a configurable port (default: 5000), and the frontend is served on a separate port (default: 5173 in development). In production, the backend serves the built frontend static files from the `dist/` directory.

External dependencies include Gmail SMTP for email delivery (via Nodemailer) and the UPI payment infrastructure for payment processing (manual verification workflow). The system does not integrate with any third-party hospital systems, insurance platforms, or government health databases.

### 2.2 Product Features

The Hospital Management System provides the following high-level feature groups:

1. **User Authentication and Account Management**  Registration, login, JWT-based session management, profile editing, and email-based password reset for all three roles.
2. **Doctor Discovery and Search**  Public listing of all doctors with search and filter by specialization, display of weekly availability, and consultation fee information.
3. **Appointment Booking and Management**  Patient-initiated appointment booking with 30-minute slot selection, doctor approval workflow, rescheduling, and cancellation.
4. **Doctor Schedule and Slot Management**  Doctor-defined weekly recurring availability and date-specific schedule overrides with automatic 30-minute slot generation and lunch break exclusion.
5. **Medical Records and Reports**  Doctor upload of patient medical reports (PDF/image/document) stored as base64 in MongoDB and emailed to the patient; patient view and download of records.
6. **Billing and Payment**  Itemized bill creation by doctors/admin, UPI-based payment request workflow, admin payment verification, and automated receipt emails.
7. **Doctor Patient Management and Diagnosis**  Doctor access to full patient history, appointment-level diagnosis entry, medicine prescription with dosage/duration/notes, and prescription text.
8. **Admin Dashboard and Activity Overview**  Centralized statistics, doctor and patient management, appointment approval, billing oversight, and a comprehensive activity view.
9. **Doctor Ratings and Reviews**  Post-appointment patient ratings (1-5 stars) with review text, displayed on the public home page with aggregate statistics.
10. **Notifications and Email Alerts**  In-app notification bell with real-time unread count, plus automated Gmail SMTP emails for registration, appointments, billing, reports, and daily reminders.

### 2.3 User Classes and Characteristics

**Patient**
- Primary end-user of the system. Patients self-register via the public registration page.
- Expected to have basic computer literacy and access to a modern web browser.
- Interacts with the system to find doctors, book appointments, view medical records, pay bills, and provide feedback.
- Has access to 8 authenticated pages plus all public pages.
- Cannot access Doctor or Admin sections.

**Doctor**
- Medical professional added to the system by an Admin. Doctors do not self-register.
- Expected to be comfortable with web-based tools. May require brief onboarding.
- Interacts with the system to manage their schedule, handle appointments, record diagnoses and prescriptions, upload medical reports, manage billing, and mark leave dates.
- Has access to 7 authenticated doctor pages plus all public pages.
- Cannot access Patient-specific or Admin sections.

**Admin**
- Hospital administrator responsible for system oversight. There is typically one Admin account.
- Expected to have strong familiarity with hospital operations and the HMS system.
- Manages doctors, patients, appointments, billing, and has a full activity overview.
- Has access to 9 authenticated admin pages plus all public pages.
- Has the highest privilege level in the system.

**Unauthenticated Visitor**
- Any user who has not logged in. Can access the home page, about page, contact page, doctor listing, registration, and login pages.
- Cannot access any role-specific functionality.

### 2.4 Operating Environment

**Server Environment:**
- Runtime: Node.js v18 or higher (tested on Node.js v22.13.0)
- Operating System: Windows 10/11, macOS 12+, or Ubuntu 20.04+ LTS
- Database: MongoDB 7.x running locally on `mongodb://127.0.0.1:27017/hospital_management`
- Memory: Minimum 2 GB RAM recommended for the server process
- Storage: Minimum 10 GB available disk space (medical records stored as base64 in MongoDB can be large)

**Client Environment:**
- Modern web browser: Google Chrome 120+, Mozilla Firefox 120+, Microsoft Edge 120+, Safari 17+
- JavaScript must be enabled
- Minimum screen resolution: 1024x768 (responsive design supports mobile viewports)
- Internet connection required for email features; local network sufficient for core functionality

**Development Environment:**
- Frontend dev server: Vite on port 5173
- Backend API server: Express.js on port 5000 (configurable via `.env`)
- MongoDB: Local instance on port 27017
- Node.js package manager: npm

### 2.5 Design and Implementation Constraints

1. **Technology Stack Fixed:** The system must use React 19 + Vite for the frontend and Node.js + Express.js v5 + MongoDB + Mongoose v9 for the backend, as specified by the project requirements.
2. **Authentication via JWT:** All authenticated API endpoints must use JSON Web Tokens (Bearer token in Authorization header). Session-based authentication is not used.
3. **Password Security:** All passwords must be hashed using bcryptjs with a minimum of 10 salt rounds before storage. Plaintext passwords must never be stored.
4. **File Storage as Base64:** Medical report files are stored as base64-encoded strings in the MongoDB `MedicalRecord.fileUrl` field. This approach avoids the need for a separate file storage service but limits practical file sizes.
5. **Request Body Size Limit:** The Express.js server enforces a 10 MB request body size limit to prevent abuse and memory exhaustion.
6. **Email Dependency:** Email features depend on a valid Gmail SMTP configuration in the `.env` file. If not configured, email sending fails silently without breaking core functionality.
7. **Single-Tenant Architecture:** The system is designed for a single hospital. There is no tenant isolation, multi-organization support, or data partitioning by institution.
8. **UPI Payment Manual Verification:** The payment system does not integrate with a payment gateway API. Payment verification is a manual admin action after the patient submits a UPI payment request.
9. **Rate Limiting:** The rate limiter middleware is disabled in the development environment and must be enabled in production to prevent brute-force attacks.
10. **Environment Variables:** All sensitive configuration (database URI, JWT secret, email credentials, UPI details) must be stored in a `.env` file that is excluded from version control via `.gitignore`.
11. **MongoDB Local Dependency:** The system requires a locally running MongoDB instance. There is no built-in support for MongoDB Atlas or other cloud database providers without modifying the connection string.

### 2.6 User Documentation

The following user documentation is provided or planned for the Hospital Management System:

- **README.md**  Located in the project root. Contains setup instructions, environment variable configuration guide, available npm scripts, project structure overview, and feature summary. Available at the GitHub repository.
- **CONTRIBUTING.md**  Located in the project root. Provides guidelines for contributors including branching strategy, code style, and pull request process.
- **In-App Guidance**  The application uses React Toastify for real-time success and error notifications that guide users through actions. Form validation messages provide inline feedback.
- **API Documentation**  Not formally documented in this version. The route files in `backend/routes/` serve as the primary API reference for developers.
- **This SRS Document**  Serves as the primary technical reference for all system requirements and behaviors.

### 2.7 Assumptions and Dependencies

**Assumptions:**
1. The hospital has a single Admin user who manages the system. Multi-admin support is not required in v1.0.
2. All doctors are added by the Admin. Doctors cannot self-register.
3. Patients are responsible for providing accurate personal information during registration.
4. The UPI payment ID configured in the `.env` file belongs to the hospital and is valid.
5. The Gmail account used for SMTP is configured to allow less-secure app access or uses an App Password.
6. Appointment slots are always 30 minutes in duration. Variable slot durations are not supported.
7. All dates and times are handled in the server's local timezone. No multi-timezone support is implemented.
8. The system will be deployed on a machine with a stable internet connection for email functionality.
9. MongoDB is running and accessible at the configured URI before the backend server starts.

**Dependencies:**
- **Node.js v18+**  Required runtime for the backend server.
- **MongoDB 7.x**  Required database engine. Must be running before the backend starts.
- **Gmail SMTP**  Required for all email notification features. Depends on valid credentials in `.env`.
- **npm**  Required for installing and managing all JavaScript dependencies.
- **React 19 / Vite**  Frontend framework and build tool. All frontend dependencies are listed in the root `package.json`.
- **Express.js v5**  Backend web framework. All backend dependencies are listed in `backend/package.json`.
- **jsonwebtoken**  Required for JWT generation and verification.
- **bcryptjs**  Required for password hashing and comparison.
- **Nodemailer**  Required for email dispatch.
- **Node-Cron**  Required for the daily 8 AM appointment reminder job.
- **Multer**  Required for handling multipart/form-data file uploads.

---

## 3. System Features

### 3.1 User Authentication and Account Management

#### 3.1.1 Description and Priority

The authentication module handles user registration, login, session management via JWT, profile management, and password recovery. This is a **High Priority** feature as all other system functionality depends on authenticated access. The system supports three roles: Patient, Doctor, and Admin. Patients self-register; Doctors are created by Admin; the Admin account is seeded or created directly in the database.

#### 3.1.2 Stimulus/Response Sequences

- **Patient Registration:** User fills the registration form (name, email, password, phone, blood group, address) and submits. The system validates inputs, checks for duplicate email, hashes the password with bcryptjs (10 salt rounds), creates a User document with role=Patient, sends a welcome email via Gmail SMTP, and returns a JWT token. The user is redirected to the patient dashboard.
- **Login (All Roles):** User submits email and password. The system finds the user by email, compares the password hash using bcryptjs, generates a JWT token (signed with the JWT_SECRET from `.env`), and returns the token along with the user's role. The frontend stores the token and role in AuthContext and localStorage, then redirects to the appropriate role dashboard.
- **Forgot Password:** User submits their registered email. The system generates a cryptographically random reset token, stores its hash and a 30-minute expiry in the User document (`resetPasswordToken`, `resetPasswordExpire`), and sends a password reset link to the user's email.
- **Reset Password:** User clicks the reset link, submits a new password. The system validates the token against the stored hash and checks expiry, hashes the new password, updates the User document, clears the reset token fields, and confirms success.
- **Profile Update:** Authenticated user submits updated profile fields. The system validates the JWT, updates the allowed fields (name, phone, bloodGroup, address), and returns the updated user object.

#### 3.1.3 Functional Requirements

- **REQ-AUTH-1:** The system SHALL allow new users to register as Patients by providing name, email, password, phone number, blood group, and address. Email must be unique across all users.
- **REQ-AUTH-2:** The system SHALL hash all passwords using bcryptjs with a minimum of 10 salt rounds before storing them in the database. Plaintext passwords SHALL NOT be stored.
- **REQ-AUTH-3:** The system SHALL send a welcome email to the patient's registered email address upon successful registration using Nodemailer with Gmail SMTP.
- **REQ-AUTH-4:** The system SHALL authenticate users of all roles (Patient, Doctor, Admin) via a single login endpoint (`POST /api/auth/login`) that returns a signed JWT token upon successful credential verification.
- **REQ-AUTH-5:** The system SHALL implement a forgot-password flow that generates a secure random token, stores its expiry (30 minutes), and emails a reset link to the user's registered email address.
- **REQ-AUTH-6:** The system SHALL validate the password reset token against the stored hash and reject expired tokens. Upon successful reset, the token fields SHALL be cleared from the User document.
- **REQ-AUTH-7:** The system SHALL allow authenticated users to view and update their own profile information (name, phone, bloodGroup, address) via `GET /api/auth/profile` and `PUT /api/auth/profile`. Users SHALL NOT be able to change their role or email via this endpoint.
- **REQ-AUTH-8:** The system SHALL enforce role-based access control on all protected routes. The frontend SHALL use a `ProtectedRoute` component that checks the user's role from AuthContext and redirects unauthorized users to the login page or a 404 page.

---

### 3.2 Doctor Discovery and Search

#### 3.2.1 Description and Priority

The doctor discovery feature allows any visitor (authenticated or not) to browse the list of all active doctors, search by name or specialization, and view each doctor's profile including their weekly availability schedule and consultation fees. This is a **High Priority** feature as it is the entry point for the appointment booking workflow.

#### 3.2.2 Stimulus/Response Sequences

- **Browse Doctors:** User navigates to `/find-doctors`. The system calls `GET /api/doctors` and returns all active doctor records with their associated user information (name, email) and doctor-specific fields (specialization, experience, feesPerConsultation, availability). The frontend renders a card grid of doctors.
- **Search/Filter:** User types in the search box or selects a specialization filter. The frontend filters the already-loaded doctor list client-side by name or specialization string match.
- **View Doctor Schedule:** User clicks on a doctor card. The frontend displays the doctor's weekly availability (days, start/end times) and consultation fee. A "Book Appointment" button is shown to authenticated patients.

#### 3.2.3 Functional Requirements

- **REQ-FIND-1:** The system SHALL expose a public endpoint (`GET /api/doctors`) that returns all active doctor records including their user profile (name, email), specialization, years of experience, consultation fee, and weekly availability array. No authentication SHALL be required for this endpoint.
- **REQ-FIND-2:** The system SHALL display each doctor's weekly availability schedule showing the day of the week, start time, and end time for each available slot block.
- **REQ-FIND-3:** The frontend SHALL provide a search input that filters the displayed doctor list by doctor name or specialization in real time without additional API calls.
- **REQ-FIND-4:** The system SHALL display each doctor's consultation fee in Indian Rupees (INR) formatted using the Indian locale number format.

---

### 3.3 Appointment Booking and Management

#### 3.3.1 Description and Priority

The appointment module is the core transactional feature of the system. It allows patients to book appointments with doctors by selecting a date and a 30-minute time slot, and allows doctors and admins to manage appointment status. This is a **High Priority** feature.

#### 3.3.2 Stimulus/Response Sequences

- **Book Appointment:** Authenticated patient navigates to `/book-appointment`, selects a doctor, selects a date, and the system calls `GET /api/schedules/slots/:doctorId/:date` to retrieve available 30-minute slots. The slot grid is displayed with color coding: white (available), green (patient's own existing booking), red (booked by another patient). Patient selects a slot, enters reason for visit, and submits. The system creates an Appointment document with status=Pending and notifies the doctor.
- **Doctor Approves Appointment:** Doctor navigates to `/doctor/appointments`, sees pending appointments, and clicks Approve. The system updates the appointment status to Approved and sends an approval email to the patient.
- **Doctor Completes Appointment:** Doctor marks an appointment as Completed, entering diagnosis, medicines (name, dosage, duration, notes), prescription text, and charges. The system updates the appointment, auto-generates a Bill document, and notifies the patient.
- **Patient Reschedules:** Patient selects a new date and time slot for an existing Pending or Approved appointment. The system updates the appointment date/time and resets status to Pending.
- **Patient Cancels:** Patient cancels a Pending or Approved appointment. The system updates status to Cancelled and notifies the doctor.
- **Admin Manages:** Admin can view all appointments, approve pending ones, or cancel any appointment from `/admin/appointments`.

#### 3.3.3 Functional Requirements

- **REQ-APT-1:** The system SHALL allow authenticated Patients to book appointments by selecting a doctor, a date, and an available 30-minute time slot. The appointment SHALL be created with an initial status of Pending.
- **REQ-APT-2:** The system SHALL prevent double-booking by checking existing approved/pending appointments for the selected doctor, date, and time slot before confirming a new booking.
- **REQ-APT-3:** The system SHALL prevent booking appointments on dates when the doctor has marked a leave (`DoctorLeave` document exists for that doctor and date).
- **REQ-APT-4:** The system SHALL display the slot availability grid with color coding: white for available slots, green for the current patient's own bookings on that date, and red for slots booked by other patients.
- **REQ-APT-5:** The system SHALL allow Doctors to update appointment status to Approved, Rejected, Completed, or Cancelled via `PUT /api/appointments/:id/status`.
- **REQ-APT-6:** The system SHALL allow Doctors to record diagnosis text, prescription text, and an array of medicines (each with name, dosage, duration, and notes) when marking an appointment as Completed.
- **REQ-APT-7:** The system SHALL automatically generate a Bill document when a Doctor marks an appointment as Completed, using the doctor's `feesPerConsultation` as the initial bill item.
- **REQ-APT-8:** The system SHALL allow Patients to reschedule a Pending or Approved appointment to a new date and time slot via `PUT /api/appointments/:id/reschedule`. The appointment status SHALL revert to Pending after rescheduling.
- **REQ-APT-9:** The system SHALL allow Patients to cancel their own Pending or Approved appointments. Completed or Rejected appointments SHALL NOT be cancellable by the patient.
- **REQ-APT-10:** The system SHALL return appointments filtered by role: Patients see only their own appointments, Doctors see only appointments assigned to them, and Admins see all appointments system-wide.

---

### 3.4 Doctor Schedule and Slot Management

#### 3.4.1 Description and Priority

The schedule management module allows doctors to define their availability at two levels: a weekly recurring schedule (stored in the Doctor model's `availability` array) and date-specific overrides (stored as `DoctorSchedule` documents). The slot generation algorithm uses the date-specific schedule if one exists for the requested date, falling back to the weekly schedule otherwise. This is a **High Priority** feature as it directly controls appointment booking availability.

#### 3.4.2 Stimulus/Response Sequences

- **Set Weekly Availability:** Doctor navigates to `/doctor/schedule` and sets recurring availability for each day of the week (day name, start time, end time). The system calls `PUT /api/doctors/availability` and updates the Doctor document's `availability` array.
- **Create Date-Specific Schedule:** Doctor selects a specific date and sets morning session (morningStart, morningEnd), lunch break (lunchStart, lunchEnd), and evening session (eveningStart, eveningEnd). The system creates or updates a `DoctorSchedule` document for that date. An `isOff` flag can mark the doctor as unavailable for the entire day.
- **Slot Generation:** When a patient or doctor requests slots for a date via `GET /api/schedules/slots/:doctorId/:date`, the system checks for a `DoctorSchedule` document for that date. If found, it generates 30-minute slots from the morning and evening sessions, excluding the lunch break. If not found, it falls back to the weekly `availability` array for the day of the week.
- **View Slot Bookings:** Doctor views the slot grid for any date showing which slots are booked (red) and which are free (white).
- **Mark Leave:** Doctor marks a date as a leave day via `POST /api/leaves`. The system creates a `DoctorLeave` document. Patients attempting to book on that date will be blocked.

#### 3.4.3 Functional Requirements

- **REQ-SCH-1:** The system SHALL allow Doctors to define a weekly recurring availability schedule specifying the day of the week, start time, and end time for each available period via `PUT /api/doctors/availability`.
- **REQ-SCH-2:** The system SHALL allow Doctors to create date-specific schedule overrides via `POST /api/schedules`, specifying morning session start/end, lunch break start/end, and evening session start/end for a specific calendar date.
- **REQ-SCH-3:** The slot generation endpoint (`GET /api/schedules/slots/:doctorId/:date`) SHALL prioritize a date-specific `DoctorSchedule` document over the weekly availability when generating available 30-minute slots.
- **REQ-SCH-4:** The system SHALL generate 30-minute time slots from the defined session windows, excluding the lunch break period, and return them as an array of time strings (e.g., "09:00", "09:30", "10:00").
- **REQ-SCH-5:** The system SHALL allow Doctors to mark specific dates as leave days via `POST /api/leaves`. On leave dates, no slots SHALL be returned and patient booking SHALL be blocked.
- **REQ-SCH-6:** The system SHALL allow Doctors to delete date-specific schedules via `DELETE /api/schedules/:id` and remove leave entries via `DELETE /api/leaves/:id`.
- **REQ-SCH-7:** The system SHALL provide a leave check endpoint (`GET /api/leaves/check/:doctorId/:date`) that returns whether a doctor is on leave for a given date, used by the booking flow to prevent invalid bookings.

---

### 3.5 Medical Records and Reports

#### 3.5.1 Description and Priority

The medical records module allows doctors to upload patient medical reports (Lab Reports, Prescriptions, Scan Reports, or Other) which are stored as base64-encoded strings in MongoDB and emailed to the patient. Patients can view, preview, and download their records. This is a **Medium-High Priority** feature.

#### 3.5.2 Stimulus/Response Sequences

- **Doctor Uploads Report:** Doctor navigates to a patient's record, selects a file (PDF, image, or document), enters a title and type, and submits. The system uses Multer to handle the multipart upload, converts the file to base64, creates a `MedicalRecord` document with `fileUrl` as the base64 string, and sends an email to the patient with the file as an attachment.
- **Patient Views Records:** Patient navigates to `/medical-records`. The system calls `GET /api/records/my-records` and returns all `MedicalRecord` documents for the patient. The frontend displays a list with title, type, date, and doctor name.
- **Patient Previews/Downloads:** Patient clicks on a record. The frontend decodes the base64 `fileUrl` and renders a preview (PDF viewer or image tag). A download button triggers a browser download of the file.

#### 3.5.3 Functional Requirements

- **REQ-REC-1:** The system SHALL allow authenticated Doctors to upload medical report files (PDF, image formats, or document formats) for a specific patient via `POST /api/reports/send`.
- **REQ-REC-2:** The system SHALL store uploaded medical report files as base64-encoded strings in the `MedicalRecord.fileUrl` field in MongoDB. No separate file system storage SHALL be used for report files.
- **REQ-REC-3:** The system SHALL create a `MedicalRecord` document for each uploaded report, storing the patient reference, doctor reference, record type (Lab Report, Prescription, Scan Report, Other), title, date, and base64 file URL.
- **REQ-REC-4:** The system SHALL send an email to the patient with the uploaded medical report file as an attachment upon successful upload, using Nodemailer with Gmail SMTP.
- **REQ-REC-5:** The system SHALL allow authenticated Patients to retrieve all their own medical records via `GET /api/records/my-records`. Patients SHALL NOT be able to access other patients' records.
- **REQ-REC-6:** The frontend SHALL provide a file preview capability for medical records, rendering PDF files in a PDF viewer and image files in an image tag, decoded from the base64 `fileUrl`. A download button SHALL allow the patient to save the file locally.

---

### 3.6 Billing and Payment

#### 3.6.1 Description and Priority

The billing module manages the financial transactions between patients and the hospital. Bills are created automatically when appointments are completed or manually by doctors/admin. The payment workflow is UPI-based with manual admin verification. All amounts are in Indian Rupees. This is a **High Priority** feature.

#### 3.6.2 Stimulus/Response Sequences

- **Auto Bill Generation:** When a Doctor marks an appointment as Completed, the system automatically creates a Bill document with the doctor's consultation fee as the first line item, status=Unpaid, and a due date.
- **Manual Bill Creation:** Doctor or Admin creates a bill manually via `POST /api/bills`, specifying patient, appointment, itemized charges (description + amount), total amount, and due date.
- **Patient Views Bills:** Patient navigates to `/my-bills`. The system calls `GET /api/bills/my-bills` and returns all bills for the patient with status, total amount, paid amount, and due date.
- **Patient Requests Payment:** Patient clicks "Pay" on an Unpaid bill. The system updates the bill status to "Payment Requested" and sends a notification email to the Admin with the patient's UPI payment details.
- **Admin Verifies Payment:** Admin navigates to `/admin/billing`, sees bills with "Payment Requested" status, verifies the UPI payment externally, and marks the bill as Paid. The system updates the bill status to Paid, sets paidAmount = totalAmount, and sends a payment receipt email to the patient.
- **Admin Adds Charges:** Admin can update an existing bill to add extra charge items via `PUT /api/bills/:id`.

#### 3.6.3 Functional Requirements

- **REQ-BILL-1:** The system SHALL automatically create a Bill document when a Doctor marks an appointment as Completed, using the doctor's `feesPerConsultation` as the initial itemized charge.
- **REQ-BILL-2:** The system SHALL allow Doctors and Admins to create bills manually via `POST /api/bills` with itemized line items (description and amount), total amount, patient reference, appointment reference, and due date.
- **REQ-BILL-3:** The system SHALL support bill statuses: Unpaid, Partial, Payment Requested, and Paid. Status transitions SHALL follow the defined workflow (Unpaid -> Payment Requested -> Paid).
- **REQ-BILL-4:** The system SHALL allow authenticated Patients to submit a payment request for their own Unpaid bills via `POST /api/bills/:id/pay`, changing the bill status to "Payment Requested".
- **REQ-BILL-5:** Upon a patient's payment request, the system SHALL send an email notification to the Admin containing the bill details and the hospital's UPI payment ID for verification.
- **REQ-BILL-6:** The system SHALL allow Admins to mark a bill as Paid via `PUT /api/bills/:id`, setting the `paidAmount` to the `totalAmount` and updating the status to Paid.
- **REQ-BILL-7:** Upon an Admin marking a bill as Paid, the system SHALL send a payment receipt email to the patient confirming the payment.
- **REQ-BILL-8:** All monetary amounts in the billing module SHALL be displayed in Indian Rupees (INR) using the Indian locale number format (`toLocaleString('en-IN')`).

---

### 3.7 Doctor Patient Management and Diagnosis

#### 3.7.1 Description and Priority

This module provides doctors with a comprehensive view of their patients, including full appointment history, medical records, and bills. It also covers the clinical workflow of recording diagnosis, medicines, and prescriptions on completed appointments. This is a **High Priority** feature for the doctor role.

#### 3.7.2 Stimulus/Response Sequences

- **View Patient List:** Doctor navigates to `/doctor/patients`. The system calls `GET /api/doctors/my-patients` and returns a list of all unique patients who have had appointments with this doctor.
- **View Patient Details:** Doctor clicks on a patient. The system calls `GET /api/doctors/patient/:id/details` and returns the patient's full profile, all appointments with this doctor, all medical records, and all bills.
- **Record Diagnosis:** During or after an appointment, the doctor opens the appointment detail, enters diagnosis text, prescription text, and adds medicines (each with name, dosage, duration, and notes). The doctor submits via `PUT /api/appointments/:id/status` with status=Completed.
- **Create Bill:** Doctor navigates to `/doctor/billing` and creates a bill for a patient with itemized charges.

#### 3.7.3 Functional Requirements

- **REQ-DIAG-1:** The system SHALL allow authenticated Doctors to retrieve a list of all patients who have had at least one appointment with them via `GET /api/doctors/my-patients`.
- **REQ-DIAG-2:** The system SHALL allow authenticated Doctors to view full patient details including profile information, all appointments (with this doctor), all medical records, and all bills via `GET /api/doctors/patient/:id/details`.
- **REQ-DIAG-3:** The system SHALL allow Doctors to record a diagnosis text and prescription text on any appointment assigned to them when updating the appointment status.
- **REQ-DIAG-4:** The system SHALL allow Doctors to add an array of medicines to an appointment, where each medicine entry contains name, dosage, duration, and notes fields.
- **REQ-DIAG-5:** The system SHALL display the recorded diagnosis, prescription, and medicines to the Patient on their completed appointment detail view.
- **REQ-DIAG-6:** The system SHALL allow Doctors to create itemized bills for their patients via `POST /api/bills`, specifying multiple line items with description and amount.

---

### 3.8 Admin Dashboard and Activity Overview

#### 3.8.1 Description and Priority

The admin module provides hospital administrators with a centralized control panel for managing all system entities and monitoring system-wide activity. This is a **High Priority** feature for the Admin role.

#### 3.8.2 Stimulus/Response Sequences

- **Dashboard Stats:** Admin navigates to `/admin/dashboard`. The system calls `GET /api/admin/stats` and returns aggregate counts: total doctors, total patients, total appointments, total departments, pending appointment count, and upcoming appointment count. The dashboard renders these as stat cards.
- **Manage Doctors:** Admin navigates to `/admin/manage-doctors`. The system returns all doctor records. Admin can add a new doctor via `/admin/add-doctor` (calls `POST /api/doctors`) or delete a doctor (calls `DELETE /api/doctors/:id`).
- **Manage Patients:** Admin navigates to `/admin/patients`. The system calls `GET /api/admin/patients` and returns all patient users. Admin clicks a patient to open a detail modal with tabs for Appointments, Medical Records, and Bills.
- **Activity Overview:** Admin navigates to `/admin/activity`. The system calls `GET /api/admin/activity` and returns a comprehensive view of all doctors (with their schedules, leaves, slot availability by date, and recent appointments) and all patients (with their appointments, records, and bills).
- **Manage Billing:** Admin navigates to `/admin/billing`. The system returns all bills. Admin can create new bills, add extra charges to existing bills, verify UPI payments, and mark bills as Paid.

#### 3.8.3 Functional Requirements

- **REQ-ADMIN-1:** The system SHALL provide an admin statistics endpoint (`GET /api/admin/stats`) returning total counts of doctors, patients, appointments, and departments, plus counts of pending and upcoming appointments.
- **REQ-ADMIN-2:** The system SHALL allow Admins to add new Doctor accounts via `POST /api/doctors`, creating both a User document (role=Doctor) and a linked Doctor document with specialization, experience, and consultation fee.
- **REQ-ADMIN-3:** The system SHALL allow Admins to delete Doctor accounts via `DELETE /api/doctors/:id`, removing both the Doctor document and the associated User document.
- **REQ-ADMIN-4:** The system SHALL allow Admins to view all patient records via `GET /api/admin/patients` and view full patient details (appointments, medical records, bills) via `GET /api/admin/patients/:id/details`.
- **REQ-ADMIN-5:** The system SHALL allow Admins to approve or cancel any appointment in the system via `PUT /api/appointments/:id/status`.
- **REQ-ADMIN-6:** The system SHALL provide a comprehensive activity overview endpoint (`GET /api/admin/activity`) that returns all doctors with their schedules, leaves, and recent appointments, and all patients with their appointments, records, and bills.
- **REQ-ADMIN-7:** The system SHALL allow Admins to manage all bills in the system: create new bills, update existing bills (add charges), verify payment requests, and mark bills as Paid via the billing endpoints.
- **REQ-ADMIN-8:** The system SHALL allow Admins to view all doctor schedules and slot availability for any date from the activity overview page.

---

### 3.9 Doctor Ratings and Reviews

#### 3.9.1 Description and Priority

The ratings module allows patients to rate their doctors after a completed appointment. Ratings (1-5 stars) and review text are stored and displayed on the public home page as social proof. This is a **Medium Priority** feature.

#### 3.9.2 Stimulus/Response Sequences

- **Submit Rating:** Patient navigates to their completed appointment. A rating widget is displayed. Patient selects 1-5 stars and optionally enters review text, then submits. The system calls `POST /api/ratings` and creates a `DoctorRating` document linked to the doctor, patient, and appointment.
- **View Ratings on Home Page:** The home page Reviews section calls `GET /api/ratings/all` and displays all ratings with review text, the reviewer's name, the doctor's name, the star rating, and aggregate statistics (average rating, total reviews, 5-star count).
- **View Doctor Ratings:** The doctor profile or listing page calls `GET /api/ratings/doctor/:doctorId` to display ratings specific to a doctor.
- **Check Own Rating:** When a patient views a completed appointment, the system calls `GET /api/ratings/my/:doctorId` to check if the patient has already rated this doctor for this appointment, preventing duplicate ratings.

#### 3.9.3 Functional Requirements

- **REQ-RATE-1:** The system SHALL allow authenticated Patients to submit a rating (integer 1-5) and optional review text for a Doctor after a completed appointment via `POST /api/ratings`.
- **REQ-RATE-2:** The system SHALL prevent a Patient from submitting more than one rating per Doctor per appointment. The system SHALL check for an existing `DoctorRating` document for the same patient-doctor-appointment combination before creating a new one.
- **REQ-RATE-3:** The system SHALL expose a public endpoint (`GET /api/ratings/all`) that returns all ratings with review text, reviewer name, doctor name, star rating, and aggregate statistics (average rating, total review count, 5-star count) for display on the home page.
- **REQ-RATE-4:** The system SHALL provide an endpoint (`GET /api/ratings/doctor/:doctorId`) to retrieve all ratings for a specific doctor, used for doctor profile pages.
- **REQ-RATE-5:** The system SHALL provide an endpoint (`GET /api/ratings/my/:doctorId`) for a Patient to check their own existing rating for a specific doctor, enabling the frontend to show the existing rating or the rating submission form appropriately.

---

### 3.10 Notifications and Email Alerts

#### 3.10.1 Description and Priority

The notification module provides two channels of communication: in-app notifications (stored in MongoDB, displayed via a bell icon in the header) and automated email notifications via Gmail SMTP (Nodemailer). A Node-Cron job sends daily appointment reminders at 8 AM. This is a **Medium-High Priority** feature.

#### 3.10.2 Stimulus/Response Sequences

- **In-App Notification:** When a key event occurs (appointment booked, approved, cancelled, bill generated, payment received), the system creates a `Notification` document for the relevant user. The frontend's `NotificationBell` component polls or fetches notifications via `GET /api/notifications` and displays an unread count badge. User clicks the bell to see the notification list and can mark individual notifications as read via `PUT /api/notifications/:id/read`.
- **Email on Registration:** After patient registration, the system sends a welcome email with the patient's name and a brief introduction to the HMS.
- **Email on Appointment Approval:** When a doctor approves an appointment, the system sends an email to the patient confirming the appointment date, time, and doctor name.
- **Email on Appointment Cancellation:** When an appointment is cancelled (by patient, doctor, or admin), the relevant parties receive a cancellation notification email.
- **Email on Bill Generation:** When a bill is created, the patient receives an email with the bill details and the hospital's UPI payment ID.
- **Email on Payment Request:** When a patient submits a payment request, the admin receives an email notification.
- **Email on Payment Confirmation:** When admin marks a bill as Paid, the patient receives a payment receipt email.
- **Email on Medical Report Upload:** When a doctor uploads a medical report, the patient receives an email with the report file as an attachment.
- **Daily Reminder (Node-Cron):** At 8:00 AM every day, the cron job queries all appointments scheduled for that day with status=Approved and sends reminder emails to the respective patients.

#### 3.10.3 Functional Requirements

- **REQ-NOTIF-1:** The system SHALL create an in-app `Notification` document for the relevant user(s) when key events occur, including: appointment booked, appointment approved, appointment cancelled, bill generated, payment requested, and payment confirmed.
- **REQ-NOTIF-2:** The system SHALL provide an endpoint (`GET /api/notifications`) that returns all notifications for the authenticated user, ordered by creation date descending.
- **REQ-NOTIF-3:** The system SHALL provide an endpoint (`PUT /api/notifications/:id/read`) that marks a specific notification as read (`isRead: true`) for the authenticated user.
- **REQ-NOTIF-4:** The system SHALL send a welcome email to new patients upon successful registration via Nodemailer with Gmail SMTP.
- **REQ-NOTIF-5:** The system SHALL send email notifications for appointment lifecycle events: approval, rejection, cancellation, and completion (bill generated).
- **REQ-NOTIF-6:** The system SHALL send email notifications for billing events: bill creation (with UPI payment details), patient payment request (to admin), and payment confirmation (receipt to patient).
- **REQ-NOTIF-7:** The system SHALL run a Node-Cron scheduled job at 8:00 AM daily that queries all appointments scheduled for the current day with status=Approved and sends reminder emails to the respective patients. If email credentials are not configured, the job SHALL fail silently without crashing the server.

---

## 4. External Interface Requirements

### 4.1 User Interfaces

The Hospital Management System provides a responsive single-page application (SPA) built with React 19 and Vite. The UI is organized into role-specific sections with dedicated navigation sidebars.

**Public Pages:**
- `/` (Home)  Hero section with call-to-action, statistics panel (total doctors, patients, appointments), services overview, and a Reviews section displaying real patient ratings from the database with average rating, total review count, and 5-star percentage.
- `/about`  Information about the hospital and the HMS system.
- `/contact`  Contact form and hospital contact details.
- `/register`  Patient registration form with fields: Full Name, Email, Password, Phone, Blood Group (dropdown), Address. Includes client-side validation and React Toastify notifications.
- `/login`  Email and password login form for all roles. Redirects to role-appropriate dashboard on success.
- `/forgot-password`  Email input form to initiate password reset.
- `/reset-password/:token`  New password entry form, accessed via the emailed reset link.

**Patient Pages (authenticated, role=Patient):**
- `/dashboard`  Welcome panel, upcoming appointments summary, recent notifications.
- `/find-doctors`  Doctor card grid with search bar and specialization filter. Each card shows doctor name, specialization, experience, consultation fee, and weekly availability.
- `/book-appointment`  Multi-step booking: select doctor, select date (date picker), view 30-minute slot grid (color-coded), enter reason for visit, confirm booking.
- `/my-appointments`  List of all patient appointments with status badges, appointment details, and action buttons (reschedule, cancel). Completed appointments show diagnosis, medicines, and prescription. Rating widget shown for completed appointments.
- `/medical-records`  List of all medical records with type badge, title, date, and doctor name. File preview modal and download button.
- `/feedback`  Feedback submission form with star rating, category dropdown, subject, and message.
- `/profile`  Profile view and edit form.
- `/my-bills`  List of all bills with status, total amount, due date, and Pay button for Unpaid bills.

**Doctor Pages (authenticated, role=Doctor):**
- `/doctor/dashboard`  Stats cards (total patients, total appointments, pending appointments, completed appointments).
- `/doctor/appointments`  Appointment list with status filter. Action buttons: Approve, Complete (opens diagnosis/medicine form), Cancel. Completed appointments show full clinical details.
- `/doctor/patients`  Patient list with search. Click to open patient detail panel with tabs: Appointments, Medical Records, Bills. Upload report button.
- `/doctor/billing`  Bill list and bill creation form with itemized line items.
- `/doctor/leave`  Calendar or date picker to mark/unmark leave dates. List of existing leave entries.
- `/doctor/schedule`  Date-specific schedule form: select date, set morning session, lunch break, evening session. View existing schedules. Slot visualization for any date.
- `/doctor/profile`  Profile view and edit form including specialization, experience, and consultation fee.

**Admin Pages (authenticated, role=Admin):**
- `/admin/dashboard`  Stats cards: total doctors, patients, appointments, departments, pending approvals, upcoming appointments.
- `/admin/manage-doctors`  Doctor list with delete button. Link to Add Doctor page.
- `/admin/add-doctor`  Form to add a new doctor: name, email, password, phone, specialization, experience, consultation fee.
- `/admin/departments`  List of departments derived from doctor specializations.
- `/admin/patients`  Patient list with search. Click to open patient detail modal with Appointments, Medical Records, and Bills tabs.
- `/admin/appointments`  All appointments with status filter. Approve and Cancel action buttons.
- `/admin/billing`  All bills list. Create bill form. Update bill form (add charges). Mark as Paid button for Payment Requested bills.
- `/admin/activity`  Comprehensive activity view: all doctors (schedule, leaves, slot availability by date, recent appointments) and all patients (appointments, records, bills).
- `/admin/profile`  Admin profile view and edit.

**UI Components:**
- `Header`  Navigation bar with logo, public links, login/register buttons (unauthenticated) or user menu with notification bell (authenticated).
- `NotificationBell`  Bell icon with unread count badge. Dropdown showing notification list with mark-as-read functionality.
- `Sidebar` / `DoctorSidebar` / `AdminSidebar`  Role-specific navigation sidebars for authenticated pages.
- `ProtectedRoute`  HOC that checks authentication and role before rendering a page, redirecting unauthorized users.
- `LoadingSpinner`  Displayed during API calls.
- `Footer`  Site footer with links and copyright.

**UI Library and Styling:**
- Icons: Lucide React icon library.
- Notifications: React Toastify for toast messages (success, error, info, warning).
- Styling: Custom CSS in `src/index.css` and `src/App.css`.

### 4.2 Hardware Interfaces

The Hospital Management System does not directly interface with any hardware devices. All interactions are mediated through the web browser and operating system. The following hardware is required:

- **Server Machine:** A computer capable of running Node.js v18+ and MongoDB 7.x. Minimum 2 GB RAM, 2-core CPU, 10 GB storage.
- **Client Machine:** Any computer or tablet with a modern web browser. Minimum 1 GB RAM. Keyboard and mouse/touchpad for input.
- **Network Interface:** Standard Ethernet or Wi-Fi network interface card for HTTP communication between client and server.
- **Storage:** Server-side storage for the MongoDB data directory. Medical records stored as base64 in MongoDB can significantly increase database size; 10 GB minimum is recommended.

No specialized medical hardware (e.g., diagnostic devices, barcode scanners, card readers) is integrated in this version.

### 4.3 Software Interfaces

The system interfaces with the following external software components:

| Interface | Software | Version | Purpose |
|-----------|----------|---------|---------|
| Database | MongoDB | 7.x | Primary data store for all application data |
| ODM | Mongoose | 9.x | Object-Document Mapping for MongoDB in Node.js |
| Email Service | Gmail SMTP via Nodemailer | Latest | Sending all automated email notifications |
| Frontend Framework | React | 19 | Building the user interface SPA |
| Build Tool | Vite | Latest | Frontend development server and production build |
| HTTP Client | Axios | Latest | Frontend-to-backend API communication |
| Backend Framework | Express.js | 5.x | REST API server framework |
| Auth Library | jsonwebtoken | Latest | JWT generation and verification |
| Password Hashing | bcryptjs | Latest | Secure password hashing |
| File Upload | Multer | Latest | Handling multipart/form-data file uploads |
| Scheduler | Node-Cron | Latest | Daily appointment reminder cron job |
| Routing | React Router DOM | 7.x | Client-side routing for the SPA |
| Icons | Lucide React | Latest | SVG icon components |
| Notifications | React Toastify | Latest | In-app toast notification UI |

### 4.4 Communications Interfaces

**HTTP/HTTPS Protocol:**
- The frontend communicates with the backend exclusively via RESTful HTTP API calls using Axios.
- In development, the frontend (port 5173) communicates with the backend (port 5000) via HTTP. CORS is configured on the backend to allow requests from the frontend origin.
- In production, the backend serves the built frontend static files and all communication is on a single port.
- All API requests to protected endpoints include a `Authorization: Bearer <token>` header containing the JWT.

**Email (SMTP):**
- The backend uses Nodemailer with Gmail SMTP (smtp.gmail.com, port 587, STARTTLS) to send all automated emails.
- Email credentials (Gmail address and App Password) are stored in the `.env` file as `EMAIL_USER` and `EMAIL_PASS`.
- If email credentials are not configured, email sending fails silently (graceful fallback) without affecting core API functionality.

**Request/Response Format:**
- All API requests and responses use JSON format (`Content-Type: application/json`).
- File uploads use `multipart/form-data` encoding (handled by Multer).
- The maximum request body size is 10 MB, enforced by Express.js middleware.

**CORS Configuration:**
- The backend Express.js server uses the `cors` middleware to allow cross-origin requests from the configured frontend origin.
- In development, CORS is permissive to allow the Vite dev server origin.
- In production, CORS should be restricted to the deployed frontend domain.

---

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements

- **NFR-PERF-1:** The backend API SHALL respond to standard GET requests (e.g., appointment list, patient list) within 500 milliseconds under normal load (up to 50 concurrent users) on the recommended server hardware.
- **NFR-PERF-2:** The slot generation endpoint (GET /api/schedules/slots/:doctorId/:date) SHALL return a complete slot array within 300 milliseconds, as it is called on every date selection during appointment booking.
- **NFR-PERF-3:** The frontend SPA SHALL achieve an initial page load time of under 3 seconds on a standard broadband connection (10 Mbps+) after the Vite production build is served.
- **NFR-PERF-4:** The MongoDB database SHALL support at least 10,000 appointment documents, 1,000 patient records, and 500 medical record documents without degradation in query response time beyond 1 second.
- **NFR-PERF-5:** File uploads for medical reports SHALL be limited to 10 MB per file. The system SHALL reject files exceeding this limit with an appropriate error message.
- **NFR-PERF-6:** The daily Node-Cron reminder job SHALL complete processing of all eligible appointments within 5 minutes of its 8:00 AM trigger time, regardless of the number of appointments scheduled for that day.
- **NFR-PERF-7:** The Admin Activity Overview page (GET /api/admin/activity) aggregates data across all doctors and patients. This endpoint SHOULD complete within 2 seconds for a system with up to 50 doctors and 500 patients.

### 5.2 Safety Requirements

- **NFR-SAFE-1:** The system SHALL NOT allow any user to access, modify, or delete data belonging to another user of the same role. Patients SHALL only see their own appointments, bills, and medical records. Doctors SHALL only see appointments and patients assigned to them.
- **NFR-SAFE-2:** The system SHALL validate all user inputs on the backend before processing, regardless of frontend validation, to prevent injection attacks and data corruption.
- **NFR-SAFE-3:** Medical report files uploaded by doctors SHALL be stored as base64 strings in the database. Temporary files created during upload processing SHALL be deleted from the server filesystem immediately after processing, whether the operation succeeds or fails.
- **NFR-SAFE-4:** The system SHALL NOT expose sensitive patient medical information (diagnosis, medicines, prescriptions, medical records) to any user other than the treating doctor, the patient themselves, and the Admin.
- **NFR-SAFE-5:** Password reset tokens SHALL expire after 30 minutes. Expired tokens SHALL be rejected and the user SHALL be required to initiate a new password reset request.
- **NFR-SAFE-6:** The system SHALL prevent appointment double-booking by checking for existing Pending or Approved appointments for the same doctor, date, and time slot before confirming a new booking.
- **NFR-SAFE-7:** The system SHALL prevent patients from booking appointments on dates when the doctor has marked a leave, providing a clear error message indicating the doctor is unavailable.

### 5.3 Security Requirements

- **NFR-SEC-1:** All passwords SHALL be hashed using bcryptjs with a minimum of 10 salt rounds before storage in MongoDB. Plaintext passwords SHALL NEVER be stored, logged, or transmitted.
- **NFR-SEC-2:** All authenticated API endpoints SHALL require a valid JWT Bearer token in the Authorization header. Requests without a valid token SHALL receive a 401 Unauthorized response.
- **NFR-SEC-3:** JWT tokens SHALL be signed using a secret key stored in the JWT_SECRET environment variable. The secret SHALL be at least 32 characters long and SHALL NOT be committed to version control.
- **NFR-SEC-4:** The system SHALL implement role-based access control (RBAC) at the API level. Admin-only endpoints SHALL verify eq.user.role === 'Admin'. Doctor-only endpoints SHALL verify eq.user.role === 'Doctor'. Unauthorized role access SHALL return a 403 Forbidden response.
- **NFR-SEC-5:** The backend SHALL set the following HTTP security headers on all responses: X-Content-Type-Options: nosniff, X-Frame-Options: DENY, X-XSS-Protection: 1; mode=block.
- **NFR-SEC-6:** The rate limiter middleware SHALL be enabled in production environments to limit repeated requests to authentication endpoints (login, register, forgot-password) to a maximum of 5 requests per 15-minute window per IP address, preventing brute-force attacks.
- **NFR-SEC-7:** All sensitive configuration values (database URI, JWT secret, email credentials, UPI ID) SHALL be stored in a .env file that is listed in .gitignore and SHALL NOT be committed to the version control repository.
- **NFR-SEC-8:** The system SHALL validate and sanitize all user-supplied inputs on the backend using the validation middleware before processing. Invalid inputs SHALL return a 400 Bad Request response with a descriptive error message.
- **NFR-SEC-9:** The frontend SHALL implement a ProtectedRoute component that checks the user's authentication status and role from the AuthContext before rendering any protected page. Unauthenticated users SHALL be redirected to /login. Users with an incorrect role SHALL be redirected to their own dashboard.
- **NFR-SEC-10:** The request body size SHALL be limited to 10 MB on the Express.js server to prevent denial-of-service attacks via large payload submissions.

### 5.4 Software Quality Attributes

- **Usability:** The system SHALL provide clear, role-specific navigation sidebars so that users can reach any feature within 2 clicks from their dashboard. All form submissions SHALL provide immediate feedback via React Toastify toast notifications (success or error). Error messages SHALL be human-readable and actionable.
- **Reliability:** The system SHALL handle email delivery failures gracefully. If the Gmail SMTP service is unavailable or credentials are not configured, the system SHALL log a warning and continue processing the API request without returning an error to the client. Core functionality SHALL NOT depend on email delivery.
- **Maintainability:** The codebase SHALL follow a modular architecture with clear separation of concerns: routes, controllers, models, middleware, and utilities in the backend; pages, components, context, and hooks in the frontend. Each backend route file SHALL correspond to a single resource domain.
- **Portability:** The system SHALL run on any operating system that supports Node.js v18+ and MongoDB 7.x (Windows, macOS, Linux). The frontend build output SHALL be deployable to any static file hosting service.
- **Scalability:** The MongoDB data models SHALL use indexed fields (email on User, compound index on DoctorRating for doctor+patient) to support efficient queries as data volume grows. The stateless JWT authentication model allows horizontal scaling of the backend without shared session state.
- **Testability:** All functional requirements (REQ-*) SHALL be independently testable. The backend API endpoints SHALL be testable via HTTP client tools (e.g., Postman, curl) without requiring the frontend. Input validation middleware SHALL be unit-testable in isolation.
- **Availability:** The system SHALL be available 24/7 when deployed on a server with a stable internet connection. The Node-Cron reminder job SHALL not block the main event loop and SHALL not affect API availability.
- **Correctness:** All monetary calculations (bill totals, payment amounts, due amounts) SHALL use integer arithmetic or precise decimal handling to avoid floating-point rounding errors. All amounts SHALL be stored as numbers in MongoDB and displayed with Indian locale formatting.

---

## 6. Other Requirements

### 6.1 Database Requirements

- The system SHALL use MongoDB 7.x as the primary database. The connection URI SHALL be configurable via the MONGO_URI environment variable.
- The following MongoDB collections SHALL be created and maintained by Mongoose models: users, doctors, ppointments, ills, medicalrecords, doctorschedules, doctorleaves, doctorratings, eedbacks, 
otifications.
- The users collection SHALL have a unique index on the email field to enforce email uniqueness across all user roles.
- The doctorratings collection SHALL have a compound unique index on {doctor: 1, patient: 1} to enforce one rating per patient per doctor.
- The doctorschedules collection SHALL have a compound unique index on {doctor: 1, date: 1} to enforce one schedule per doctor per date.
- MongoDB timestamps (createdAt, updatedAt) SHALL be enabled on all models to support audit trails and sorting.

### 6.2 Internationalization Requirements

- The system is designed for use in India. All monetary values SHALL be displayed in Indian Rupees (₹) using the en-IN locale for number formatting (e.g., ₹1,00,000).
- All dates SHALL be displayed using the Indian date format (dd/mm/yyyy) via 	oLocaleDateString('en-IN').
- The system is currently English-only. Multi-language support is not required in v1.0.

### 6.3 Legal and Compliance Requirements

- This system is developed for educational purposes at RKU and is not intended for production use in a regulated healthcare environment.
- In a production deployment, the system would need to comply with applicable data protection regulations (e.g., India's Digital Personal Data Protection Act, 2023) regarding the storage and processing of patient health information.
- Medical records and patient data stored in the system are confidential. Access controls (RBAC) are implemented to restrict data access to authorized users only.

### 6.4 Deployment Requirements

- The system SHALL be deployable by following the instructions in README.md without requiring specialized DevOps knowledge.
- The backend SHALL start successfully and connect to MongoDB before accepting API requests. If MongoDB is unavailable at startup, the process SHALL exit with a non-zero exit code and a descriptive error message.
- Environment variables SHALL be loaded from a .env file in the ackend/ directory using the dotenv package.

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **HMS** | Hospital Management System  the software product described in this SRS. |
| **SRS** | Software Requirements Specification  this document. |
| **JWT** | JSON Web Token  a compact, URL-safe token format used for authentication and authorization. |
| **RBAC** | Role-Based Access Control  a security model where access to resources is determined by the user's assigned role (Patient, Doctor, Admin). |
| **SPA** | Single-Page Application  a web application that loads a single HTML page and dynamically updates content without full page reloads. |
| **REST** | Representational State Transfer  an architectural style for designing networked applications using HTTP methods (GET, POST, PUT, DELETE). |
| **API** | Application Programming Interface  a set of defined endpoints through which the frontend communicates with the backend. |
| **ODM** | Object-Document Mapper  a library (Mongoose) that maps JavaScript objects to MongoDB documents. |
| **SMTP** | Simple Mail Transfer Protocol  the protocol used by Nodemailer to send emails via Gmail. |
| **UPI** | Unified Payments Interface  India's real-time payment system used for bill payments in this application. |
| **INR** | Indian National Rupee (₹)  the currency used for all monetary values in the system. |
| **bcryptjs** | A JavaScript library for hashing passwords using the bcrypt algorithm. |
| **Multer** | A Node.js middleware for handling multipart/form-data, used for file uploads. |
| **Node-Cron** | A Node.js library for scheduling tasks using cron syntax. Used for daily appointment reminders. |
| **Base64** | A binary-to-text encoding scheme used to store file contents as strings in MongoDB. |
| **Slot** | A 30-minute time block within a doctor's schedule that can be booked by a patient for an appointment. |
| **Leave** | A date on which a doctor is marked as unavailable, blocking all appointment bookings for that date. |
| **DoctorSchedule** | A date-specific schedule document that overrides the doctor's weekly recurring availability for a particular calendar date. |
| **Diagnosis** | Clinical findings recorded by a doctor on a completed appointment, stored in the Appointment.diagnosis field. |
| **Prescription** | Textual medical instructions recorded by a doctor on a completed appointment, stored in Appointment.prescription. |
| **Bill** | A financial document itemizing charges for a patient's medical services, with a payment status and UPI payment workflow. |
| **MedicalRecord** | A document storing a patient's medical report (Lab Report, Prescription, Scan Report, or Other) with an optional base64-encoded file. |
| **Notification** | An in-app message stored in MongoDB and displayed to a user via the notification bell icon in the header. |
| **ProtectedRoute** | A React component that wraps route elements to enforce authentication and role-based access control on the frontend. |
| **AuthContext** | A React Context that stores the authenticated user's information (token, role, name) and provides login/logout functions to all components. |
| **Vite** | A modern frontend build tool and development server used to build and serve the React SPA. |
| **Mongoose** | A MongoDB ODM library for Node.js that provides schema validation, query building, and middleware hooks. |
| **Express.js** | A minimal and flexible Node.js web application framework used to build the REST API backend. |

---

## Appendix B: Analysis Models

### B.1 System Architecture Diagram

`

                        CLIENT BROWSER                           
     
                React 19 SPA (Vite)                           
                        
     Patient      Doctor      Admin                   
      Pages       Pages       Pages                   
                        
           AuthContext (JWT) + ProtectedRoute                 
                      Axios HTTP Client                       
     

                               HTTP/REST (port 5000)
                              

                   NODE.JS + EXPRESS.JS v5                       
    
                      Middleware Stack                         
    CORS  JSON Parser  Security Headers  Rate Limiter      
    JWT Auth Middleware  Input Validation  Error Handler    
    
    
                        API Routes                            
    /api/auth  /api/doctors  /api/appointments                
    /api/schedules  /api/bills  /api/records                  
    /api/admin  /api/ratings  /api/feedback                   
    /api/notifications  /api/leaves  /api/reports             
    
    
                       Utilities                              
    sendEmail (Nodemailer)    reminderJob (Node-Cron)        
    logger    generateToken (JWT)                           
    

          Mongoose ODM                     Gmail SMTP
                                          
              
   MongoDB 7.x                   Gmail SMTP       
  (port 27017)                   (Nodemailer)     
                                                 
  Collections:                   Email Events:   
  users                          - Registration  
  doctors                        - Appointments  
  appointments                   - Bills         
  bills                          - Reports       
  medicalrecords                 - Reminders     
  doctorschedules              
  doctorleaves   
  doctorratings  
  feedbacks      
  notifications  

`

### B.2 User Role Hierarchy

`
                    
                        ADMIN      (Highest Privilege)
                                   - Manage all entities
                                   - View all data
                    
                           
              
                                       
                  
          DOCTOR                  PATIENT   
                                            
        - Own appts             - Own appts 
        - Own sched             - Own bills 
        - Own bills             - Own records
        - Own leaves            - Rate docs 
                  
`

### B.3 Appointment State Machine

`
                    
                     PENDING   Patient books appointment
                    
                         
           
                                     
                                     
          
       APPROVED    REJECTED    CANCELLED 
          
           
            Doctor marks complete
           
      
       COMPLETED   Auto-generate Bill
           Record Diagnosis/Medicines
`

### B.4 Bill Payment State Machine

`
         
          UNPAID   Bill created (auto or manual)
         
              Patient clicks "Pay"
             
    
     PAYMENT REQUESTED  Email notification to Admin
    
              Admin verifies UPI payment
             
         
          PAID   Receipt email to Patient
         

    
     PARTIAL   Admin records partial payment
    
`

### B.5 Entity-Relationship Overview

`
User (1)  (1) Doctor
                           
   (Patient)               
                           
   (many) Appointment 
           
            (many) Bill
            (1) MedicalRecord (prescription)
  
   (many) MedicalRecord (uploaded reports)
   (many) Bill
   (many) Notification
   (many) Feedback
   (many) DoctorRating

Doctor  (many) DoctorSchedule
        (many) DoctorLeave
        (many) DoctorRating
`

---

## Appendix C: Issues List

The following is a list of known limitations, open issues, and deferred items for the Hospital Management System v1.0:

| ID | Issue | Status | Priority | Notes |
|----|-------|--------|----------|-------|
| ISS-001 | Medical report files stored as base64 in MongoDB can significantly increase database size for large files or many patients. A dedicated file storage service (e.g., AWS S3, Cloudinary) would be more scalable. | Open | Medium | Deferred to v2.0 |
| ISS-002 | The Admin account must be created manually by setting ole: "Admin" directly in MongoDB. There is no admin registration UI or seeding script. | Open | Low | Acceptable for v1.0 academic scope |
| ISS-003 | The payment system relies on manual UPI verification by the Admin. There is no automated payment gateway integration (e.g., Razorpay, PayU). | Open | Medium | Deferred to v2.0 |
| ISS-004 | The rate limiter is disabled in development mode. Production deployment requires manual verification that NODE_ENV=production is set in the .env file. | Open | High | Must be addressed before any production deployment |
| ISS-005 | Email notifications depend on Gmail SMTP with an App Password. If Google changes its App Password policy, email functionality will break. | Open | Medium | Consider migrating to a dedicated email service (SendGrid, AWS SES) in v2.0 |
| ISS-006 | The Admin Activity Overview page (GET /api/admin/activity) performs N+1 database queries (one per doctor and one per patient). This may cause performance issues with large datasets. | Open | Medium | Optimize with MongoDB aggregation pipelines in v2.0 |
| ISS-007 | There is no pagination on any list endpoint (appointments, patients, bills, etc.). All records are returned in a single response, which may cause performance issues with large datasets. | Open | Medium | Deferred to v2.0 |
| ISS-008 | The system does not support multi-timezone operation. All dates and times are stored and displayed in the server's local timezone. | Open | Low | Not required for single-hospital deployment |
| ISS-009 | Doctor ratings allow one rating per patient per doctor (not per appointment). A patient who has multiple appointments with the same doctor can only submit one rating. | Open | Low | Acceptable for v1.0 |
| ISS-010 | The DoctorSchedule model stores files as base64 strings. There is no cleanup mechanism for orphaned medical records if a patient or doctor account is deleted. | Open | Low | Deferred to v2.0 |
| ISS-011 | The frontend does not implement token refresh. When the JWT expires, the user is silently redirected to the login page via the Axios 401 interceptor. | Open | Low | Acceptable for v1.0 academic scope |
| ISS-012 | There is no audit log for admin actions (e.g., who deleted a doctor, who marked a bill as paid). | Open | Low | Deferred to v2.0 |
