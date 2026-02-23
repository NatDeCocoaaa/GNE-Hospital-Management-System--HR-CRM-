# Complete Hospital Management System - Setup & Testing Guide

## ✅ System Status: READY FOR TESTING

All components have been configured to work with your database. The system is now ready for:
1. Login testing with real credentials from your database
2. API endpoint verification
3. Full system testing

---

## 📋 What Was Fixed

### ✅ Fixed Components:

1. **API Routing (Root Level)**
   - Created `/api/` proxy directory in htdocs
   - Created `index.php` as main router
   - Created `.htaccess` with CORS headers
   - Maps all frontend requests to backend PHP files

2. **Database Models Updated**
   - ✅ Employee model - uses employees table columns correctly
   - ✅ Patient model - uses patients table columns correctly
   - ✅ Department model - updated to use departments table
   - ✅ Appointment model - matches appointments table schema
   - ✅ Admission model - matches admissions table schema
   - ✅ Billing model - uses invoices table
   - ✅ Bed model - uses beds table with status instead of is_occupied
   - ✅ MedicalRecord model - uses medical_records table

3. **Frontend Configuration**
   - ✅ API base URL set to `http://localhost/api`
   - ✅ Proxy routing configured
   - ✅ All endpoints mapped to backend files

4. **CORS Headers**
   - ✅ Enabled at multiple levels (db_connection.php, index.php router, individual endpoints)
   - ✅ Supports preflight OPTIONS requests
   - ✅ Allows credentials and custom headers

5. **Login Authentication**
   - ✅ Fetches from users table in database
   - ✅ JWT token generation working
   - ✅ No hardcoded demo credentials - all from database

---

## 🚀 Quick Start Guide

### Step 1: Ensure Database is Set Up

```bash
# In phpMyAdmin:
1. Create database: hr_pms_erp
2. Import db_setup.sql file (already created)
   - Contains all tables
   - Includes 5 test users
   - Includes sample data for all modules
```

**Test Users Available:**
```
Email: hr@hospital.com | Password: password123 | Role: HR
Email: doctor@hospital.com | Password: password123 | Role: Doctor
Email: desk@hospital.com | Password: password123 | Role: FrontDesk
Email: billing@hospital.com | Password: password123 | Role: Billing
Email: admin@hospital.com | Password: password123 | Role: Admin
```

### Step 2: Start XAMPP Services

```
1. Open XAMPP Control Panel
2. Start "Apache" service
3. Start "MySQL" service
4. Verify both show "Running" in green
```

### Step 3: Test Backend API Directly

**Test Login Endpoint:**
```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@hospital.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "hr@hospital.com",
    "name": "Sarah Johnson",
    "role": "HR",
    "department": "Human Resources"
  }
}
```

**Test Employees Endpoint:**
```bash
curl http://localhost/api/employee/get_all
```

**Test Patients Endpoint:**
```bash
curl http://localhost/api/patient/get_all
```

**Test Departments Endpoint:**
```bash
curl http://localhost/api/department/get_all
```

### Step 4: Start Frontend Dev Server

```bash
# Navigate to frontend directory:
cd GNE-Hospital-Management-System--HR-CRM-/hr-patient-msys\ \(With\ Backend\)/hr-patient-msys/hr-patient-msys/

# Install dependencies (if not already done):
npm install

# Start dev server:
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### Step 5: Test Frontend Login

1. Open http://localhost:5173 in browser
2. You should see the GNE Hospital login form
3. Enter credentials:
   - Email: `hr@hospital.com`
   - Password: `password123`
4. Click "Sign In"
5. Should redirect to HR Dashboard with employee data loaded from database

---

## 🔍 Troubleshooting

### Issue: "CORS policy error" in console

**Solution:**
1. Ensure Apache is running (XAMPP Control Panel)
2. Verify http://localhost/api/auth/login is accessible
3. Check that `/api/index.php` exists in htdocs

### Issue: "Failed to fetch" without CORS error

**Solution:**
1. Check if Apache is actually running
2. Verify MySQL is running
3. Check `/api/index.php` for errors (add error logging)

### Issue: Login fails with "Invalid email or password"

**Solution:**
1. Verify database is imported (check hr_pms_erp database exists)
2. Check users table has data: `SELECT * FROM users;`
3. Verify user email exactly matches (case-sensitive)
4. Confirm password is "password123"

### Issue: Dashboard loads but no employee data shows

**Solution:**
1. Test API directly: `curl http://localhost/api/employee/get_all`
2. Check if employees table has data: `SELECT COUNT(*) FROM employees;`
3. Check browser Network tab for API response

### Issue: API returns "Backend service unavailable"

**Solution:**
1. Verify path in `/api/index.php` is correct for your system
2. Check that backend files exist in the nested directory
3. Verify PHP can access files with spaces in folder names

---

## 📁 System Architecture After Setup

```
htdocs/
├── api/                              # ← NEW PROXY LAYER
│   ├── index.php                    # Main router
│   ├── .htaccess                    # CORS & routing rules
│   ├── login.php                    # Auth proxy
│   ├── employees.php                # HR proxy
│   ├── patients.php                 # Patient proxy
│   ├── departments.php              # Department proxy
│   ├── billing.php                  # Billing proxy
│   └── beds.php                     # Bed proxy
│
└── GNE-Hospital-Management-System--HR-CRM-/
    └── hr-patient-msys (With Backend)/
        └── hr-patient-msys/
            ├── hr-patient-mysys/   # ← Frontend (React/Vite)
            │   └── src/
            │       ├── services/
            │       │   └── apiClient.js  (Updated base URL)
            │       ├── pages/
            │       │   ├── Login.jsx
            │       │   ├── HRDashboard.jsx
            │       │   ├── DoctorDashboard.jsx
            │       │   ├── FrontDeskDashboard.jsx
            │       │   └── BillingDashboard.jsx
            │       └── context/
            │           └── AuthContext.jsx
            │
            └── hr-patient-mysys-backend/
                └── hr-pms/          # ← Backend (PHP)
                    ├── api/         # API endpoints
                    ├── config/
                    │   └── db_connection.php
                    ├── controller/  # Controllers
                    ├── model/       # Models (UPDATED)
                    └── db_setup.sql # ← Database schema
```

---

## ✨ Key Endpoints Available

### Authentication
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/logout` - Logout

### HR Module
- `GET /api/employee/get_all` - List all employees
- `GET /api/department/get_all` - List departments
- `GET /api/schedule/get_all` - List schedules

### Patient Module (PMS)
- `GET /api/patient/get_all` - List patients
- `POST /api/patient/register` - Register new patient
- `GET /api/appointment/get_all` - List appointments
- `POST /api/appointment/book` - Book appointment
- `GET /api/bed/get_available` - Get available beds
- `GET /api/admission/get_all` - List admissions
- `POST /api/admission/admit` - Admit patient
- `POST /api/admission/discharge/:id` - Discharge patient

### Billing Module
- `GET /api/billing/get_all` - List invoices
- `POST /api/billing/create` - Create invoice
- `POST /api/billing/pay/:id` - Process payment

### Medical Records
- `GET /api/medical_record/get_all` - List records
- `POST /api/medical_record/create` - Create record

---

## 🗄️ Database Schema Reference

### Users Table
- `id` - Primary key
- `email` - User email (unique)
- `username` - Username
- `password` - Password (plain text in demo, use hashing in production)
- `name` - User full name
- `role` - HR, Doctor, FrontDesk, Billing, Admin
- `department` - Department name

### Employees Table
- `id` - Primary key
- `name`, `email`, `phone`, `role`, `department`
- `status` - Active, On Leave, Inactive
- `salary`, `joined` - Employment details

### Patients Table
- `id` - Primary key
- `name`, `email`, `phone`, `dob`, `gender`, `address`
- `status` - Active, Admitted, Discharged

### Appointments Table
- `id` - Primary key
- `patient_id`, `doctor_id` - Foreign keys
- `appointment_date` - Scheduled date/time
- `status` - Scheduled, Completed, Cancelled, No-Show
- `notes` - Appointment notes

### Admissions Table
- `id` - Primary key
- `patient_id`, `doctor_id`, `bed_id` - Foreign keys
- `admission_date`, `discharge_date` - Dates
- `status` - Active, Discharged, Transferred
- `diagnosis` - Medical diagnosis

### Invoices Table
- `id` - Primary key
- `patient_id`, `admission_id` - Foreign keys
- `invoice_number`, `total_amount`, `paid_amount`
- `status` - Unpaid, Partial, Paid, Overdue
- `payment_method`, `due_date`, `paid_date`

---

## 🔒 Security Notes

### Current Implementation:
- ✅ JWT tokens stored in localStorage
- ✅ Token expiry: 24 hours
- ✅ CORS enabled for development
- ⚠️ Passwords stored in plain text (demo only)

### Production Recommendations:
- 🔴 **Hash passwords** using `password_hash()` and `password_verify()`
- 🔴 **Use HTTPS** instead of HTTP
- 🔴 **Restrict CORS** to specific domains
- 🔴 **Add rate limiting** for login attempts
- 🔴 **Use environment variables** for sensitive config
- 🔴 **Implement refresh tokens** for better security
- 🔴 **Add input validation** and sanitization

---

## 📞 Common Commands

### Test Database Connection:
```bash
mysql -u root hr_pms_erp
SELECT VERSION();
SELECT COUNT(*) FROM users;
```

### View All Users:
```bash
mysql -u root -e "SELECT email, role FROM hr_pms_erp.users;"
```

### Check if Apache is Running:
```bash
curl http://localhost/
```

### Check if API is Accessible:
```bash
curl http://localhost/api/auth/login
```

### Clear Browser Cache (if needed):
```javascript
// Open browser console and run:
localStorage.clear();
sessionStorage.clear();
```

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] XAMPP Apache service is running (green)
- [ ] XAMPP MySQL service is running (green)
- [ ] Database `hr_pms_erp` exists in phpMyAdmin
- [ ] All tables are populated with data
- [ ] Users table has at least 5 test users
- [ ] Can access http://localhost/api/auth/login (shows PHP)
- [ ] Frontend is running at http://localhost:5173
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows successful response from API

---

## 📞 Next Steps

1. **Start XAMPP** - Both Apache and MySQL
2. **Verify Database** - Check phpMyAdmin for data
3. **Test Backend Directly** - Use curl or Postman
4. **Start Frontend** - Run `npm run dev`
5. **Test Login** - Use test credentials
6. **Verify Dashboards** - Check data displays correctly

**You're all set! The system should now work end-to-end.** 🎉
