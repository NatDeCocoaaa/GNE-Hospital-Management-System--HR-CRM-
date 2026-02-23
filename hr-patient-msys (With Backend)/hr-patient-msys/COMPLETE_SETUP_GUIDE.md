# Complete Setup Guide - Hospital Management System

## ✅ System Status: READY FOR TESTING

All code has been fixed and finalized. Follow these steps to get your system running.

---

## 🔧 Prerequisites

1. **XAMPP** - Running on your machine (Apache + MySQL)
2. **Node.js** - Installed for the frontend
3. **Database** - MySQL database `hr_pms_erp` created and populated

---

## 📋 Step 1: Database Setup

### Option A: Using The Setup Script
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database: `hr_pms_erp`
3. Import the SQL files in order:
   - `db_setup.sql` - Creates all tables
   - `insert_test_users.sql` - Adds test users

### Option B: Manual Command Line
```bash
# Open MySQL
mysql -u root -p

# In MySQL:
CREATE DATABASE hr_pms_erp;
USE hr_pms_erp;
SOURCE /path/to/db_setup.sql;
SOURCE /path/to/insert_test_users.sql;
```

---

## 👥 Test User Credentials

After database setup, use these credentials to login:

```
Email: juan.delacruz@hospital.com
Password: password123
Role: HR Admin

Email: maria.santos@hospital.com
Password: password123
Role: Doctor

Email: jose.reyes@hospital.com
Password: password123
Role: Front Desk
```

---

## 🚀 Step 2: Start the Backend (PHP/XAMPP)

1. **Start Apache & MySQL in XAMPP Control Panel**
   - Click "Start" on Apache
   - Click "Start" on MySQL

2. **Verify Backend is Working**
   - Open: http://localhost/GNE-Hospital-Management-System--HR-CRM-/hr-patient-msys%20(With%20Backend)/hr-patient-msys/hr-patient-mysys-backend/hr-pms/api/login.php
   - You should see: `Invalid JSON input` (or similar message - this means PHP is working)

---

## 🎨 Step 3: Start the Frontend (React/Vite)

1. **Navigate to Frontend Directory**
   ```bash
   cd "hr-patient-msys (With Backend)/hr-patient-msys/hr-patient-msys"
   ```

2. **Install Dependencies (first time only)**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - The dev server will output a URL (usually http://localhost:5173)
   - Press 'o' in the terminal to open automatically, or
   - Manually navigate to the URL shown

---

## 🧪 Step 4: Test the Login

1. **Access Login Page**
   - Frontend should be open in your browser
   - You'll see the "GNE Medical Hospital" login page

2. **Login with Test Credentials**
   - Email: `juan.delacruz@hospital.com`
   - Password: `password123`
   - Click "Sign in"

3. **Expected Results**
   - ✅ No red error boxes
   - ✅ "Login successful! Redirecting..." message (green)
   - ✅ Redirected to HR Dashboard

---

## 🔍 Troubleshooting

### Error: "Failed to fetch" on Login

**Cause:** Backend not accessible  
**Solution:**
1. Check if Apache is running in XAMPP
2. Check if MySQL is running
3. Verify database exists: `hr_pms_erp`
4. Check if test users are inserted

**Test Backend Directly:**
```bash
# Make a POST request to test the login endpoint
curl -X POST http://localhost/GNE-Hospital-Management-System--HR-CRM-/hr-patient-msys%20(With%20Backend)/hr-patient-msys/hr-patient-mysys-backend/hr-pms/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"juan.delacruz@hospital.com","password":"password123"}'
```

### Error: "Invalid username/email or password"

**Cause:** Test users not created or database empty  
**Solution:**
1. Check phpMyAdmin to verify `users` table has entries
2. Re-run `insert_test_users.sql`
3. Verify email addresses match exactly

### Error: "Database connection failed"

**Cause:** MySQL not running or wrong credentials  
**Solution:**
1. Start MySQL in XAMPP Control Panel
2. Check database credentials in `/api/../config/db_connection.php`
3. Default: username=`root`, password=`` (empty)

### Login Works but No Data on Dashboard

**Cause:** API endpoints might not be correctly configured  
**Solution:**
1. Check browser console (F12 -> Console tab)
2. Look for "API Call Failed" messages
3. Ensure all `/api/` endpoints are being proxied correctly

---

## 📁 Key Files Changed

### Frontend
- `vite.config.js` - ✅ Added proxy configuration for API calls
- `.env` - ✅ Set API base URL to `/api`
- `src/services/apiClient.js` - ✅ Verified API client structure
- `src/services/authService.js` - ✅ Verified auth logic

### Backend
- `api/login.php` - ✅ Verified JWT token generation
- `config/db_connection.php` - ✅ Verified database connection
- `.htaccess` - ✅ CORS headers configured

---

## 🌐 Architecture Overview

```
┌─────────────────┐
│   Browser       │
│  (React App)    │
│  Port: 5173     │
└────────┬────────┘
         │ /api/* (via Vite proxy)
         ▼
┌─────────────────┐
│   Vite Dev      │
│   Server        │
└────────┬────────┘
         │ Rewrite to full path
         ▼
┌──────────────────────────────────────────────────────────┐
│              Apache (localhost:80)                        │
│  /GNE-Hospital.../hr-pms/api/login.php                   │
│  /GNE-Hospital.../hr-pms/api/get_patients.php            │
│  /GNE-Hospital.../hr-pms/api/...                         │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│              MySQL Database                              │
│         hr_pms_erp                                       │
│  ├── users (login credentials)                           │
│  ├── employees (employee info)                           │
│  ├── patients (patient data)                             │
│  └── ... (other tables)                                  │
└──────────────────────────────────────────────────────────┘
```

---

## ✨ Features Now Available

After successful login, you'll have access to:

1. **HR Dashboard** - Manage employees, departments, schedules
2. **Doctor Dashboard** - View appointments, medical records
3. **Front Desk Dashboard** - Manage patients, appointments, admissions
4. **Billing Dashboard** - Process billing and payments

---

## 🔐 Security Notes

- JWT tokens are stored in `localStorage`
- Tokens expire after 24 hours
- Passwords are hashed with bcrypt
- CORS enabled for frontend communication
- All API calls require authentication (except login endpoint)

---

## 📞 Next Steps

1. ✅ Set up database
2. ✅ Start backend
3. ✅ Start frontend  
4. ✅ Test login
5. **Populate test data** (optional): Add more employees, patients, etc.
6. **Deploy to production** (when ready)

---

**System Ready for Use!** 🎉

If you encounter any issues, check the browser console (F12) for detailed error messages.
