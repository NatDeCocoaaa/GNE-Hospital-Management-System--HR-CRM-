# Login System Debug & Fix Guide

## Issues Fixed

### 1. ✅ API Parameter Mismatch
**Problem**: Frontend was sending `username` but authContext expected `email`
**Fix**: Updated `apiClient.js` to use `email` as the parameter name consistently

### 2. ✅ Database Schema Mismatch  
**Problem**: `login.php` was querying for columns that don't exist in the users table
- Expected: `id, email, password, name, role, department`
- Actual: `user_id, emp_id, username, password_hash, access_role, is_active`

**Fix**: Updated `login.php` to:
- Query `users` table with correct column names
- Join with `employees` table to fetch email, name, and department
- Handle bcrypt-hashed passwords properly
- Return consistent user object structure

### 3. ✅ Tailwind CDN Conflict
**Problem**: index.html had both CDN script AND PostCSS Tailwind config
**Fix**: Removed `<script src="https://cdn.tailwindcss.com"></script>`

### 4. ✅ Demo Credentials Removed
**Problem**: Login page showed hardcoded demo credentials
**Fix**: 
- Removed `DEMO_CREDENTIALS` array
- Removed `fillDemo()` function
- Removed demo UI buttons

---

## Setup Instructions

### Step 1: Add Test Users to Database

**Option A: Using MySQL/phpMyAdmin**
1. Open phpMyAdmin
2. Select database `hr_pms_erp`
3. Click "SQL" tab
4. Copy and paste contents of `insert_test_users.sql`
5. Execute the query

**Option B: Using Command Line**
```bash
mysql -u root hr_pms_erp < insert_test_users.sql
```

### Step 2: Test Login Credentials

After adding users, you can login with:

| Role | Email/Username | Password |
|------|---|---|
| HR | `hr@hospital.com` | `password123` |
| Doctor | `doctor@hospital.com` | `password123` |
| Front Desk | `desk@hospital.com` | `password123` |

**Note**: These are test accounts. The passwords are bcrypt-hashed. Don't use these credentials in production.

### Step 3: Verify Database Connection

Test the database connection:

```bash
# Windows Command Prompt
mysql -u root -h localhost hr_pms_erp -e "SELECT user_id, username, access_role FROM users LIMIT 5;"
```

Expected output:
```
+--------+-----------------------+-----------+
| user_id | username              | access_role |
+--------+-----------------------+-----------+
| 16     | juan.delacruz.hr@... | HR        |
| 17     | mc.santos.doctor@... | Doctor    |
| 18     | paeng.reyes.fd@...   | FrontDesk |
+--------+-----------------------+-----------+
```

### Step 4: Start the Application

**Terminal 1 - Start Backend (Apache)**
```bash
# Make sure XAMPP Apache is running
# Or start from XAMPP Control Panel
```

**Terminal 2 - Start Frontend**
```bash
cd "hr-patient-msys (With Backend)\hr-patient-msys\hr-patient-msys"
npm run dev
```

The app will run at `http://localhost:5173`

### Step 5: Test Login Flow

1. Open `http://localhost:5173/login`
2. Enter credentials (e.g., `hr@hospital.com` / `password123`)
3. Click "Sign In"
4. Should redirect to HR Dashboard
5. Check browser console for any errors
6. Verify token is stored in localStorage (storage in DevTools)

---

## Troubleshooting

### Problem: "Invalid JSON is not valid JSON" Error

**Cause**: Backend is returning HTML error instead of JSON

**Solution**:
1. Check PHP error logs in XAMPP
2. Verify MySQL is running
3. Run database connection test:
   ```bash
   mysql -u root -h localhost hr_pms_erp -e "SELECT 1;"
   ```
4. Check that users table exists:
   ```bash
   mysql -u root -h localhost hr_pms_erp -e "DESCRIBE users;"
   ```

### Problem: "Invalid username/email or password"

**Cause**: User doesn't exist in database or password is wrong

**Solution**:
1. Verify test users were inserted:
   ```bash
   mysql -u root -h localhost hr_pms_erp -e "SELECT * FROM users;"
   ```
2. Check password hash is valid (should start with `$2y$10$`)
3. Try with exact credentials from `insert_test_users.sql`

### Problem: "User account is inactive"

**Cause**: User's `is_active` field is 0

**Solution**:
```bash
mysql -u root -h localhost hr_pms_erp -e "UPDATE users SET is_active = 1 WHERE username = 'hr@hospital.com';"
```

### Problem: CORS errors when logging in

**Cause**: Backend CORS headers not set correctly

**Solution**: 
1. Verify `login.php` has CORS headers:
   ```php
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: POST, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type");
   ```
2. Verify `/api/index.php` router includes `login.php`
3. Restart browser and clear cache/cookies

---

## API Integration Summary

### Login Endpoint
- **URL**: `POST http://localhost/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "hr@hospital.com",
    "password": "password123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJ...",
    "user": {
      "id": 16,
      "emp_id": 6,
      "username": "hr@hospital.com",
      "email": "hr@hospital.com",
      "name": "Juan Dela Cruz",
      "role": "HR",
      "department": "Human Resources"
    }
  }
  ```
- **Error Response** (401):
  ```json
  {
    "success": false,
    "message": "Invalid username/email or password"
  }
  ```

---

## Files Modified

### Frontend Changes
1. **src/services/apiClient.js**
   - Changed `login(username, password)` → `login(email, password)`
   - Now sends `{email, password}` to backend

2. **src/pages/Login.jsx**
   - Removed `DEMO_CREDENTIALS` array
   - Removed `fillDemo()` function
   - Removed demo credential buttons

3. **index.html**
   - Removed Tailwind CDN script

### Backend Changes
1. **api/login.php**
   - Updated to query actual database schema
   - Joins `users` and `employees` tables
   - Properly handles bcrypt-hashed passwords
   - Returns consistent response format
   - Includes better error handling

2. **insert_test_users.sql** (New)
   - Contains INSERT statements for test users
   - All passwords bcrypt-hashed

---

## Security Notes

⚠️ **For Production Use**:
1. Change `JWT_SECRET` in login.php
2. Remove test users or change their passwords
3. Enable HTTPS only
4. Use environment variables for database credentials
5. Hash all passwords with bcrypt (use password_hash())
6. Implement CSRF protection
7. Rate limit login attempts
8. Use secure session handling

---

## Next Steps

1. ✅ Insert test users into database
2. ✅ Start backend and frontend
3. ✅ Test login with provided credentials
4. ✅ Verify token is stored and user is redirected
5. ⏳ Create additional test users as needed
6. ⏳ Implement password reset functionality
7. ⏳ Set up user management in HR dashboard
8. ⏳ Configure production database credentials

