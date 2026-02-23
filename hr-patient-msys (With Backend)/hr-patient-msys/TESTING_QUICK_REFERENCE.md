# 🚀 Quick Testing Checklist

## Before You Start:
- ✅ Database imported with all tables
- ✅ All models updated to match database schema  
- ✅ API router created at /api/index.php
- ✅ CORS headers configured
- ✅ No hardcoded demo data

---

## Phase 1: Backend Verification (5 minutes)

### 1.1 Check XAMPP Status
```
❑ Apache running? (Green in XAMPP Control Panel)
❑ MySQL running? (Green in XAMPP Control Panel)
```

### 1.2 Test Database Access
```bash
# In your terminal or browser navigation bar, test if files exist:
http://localhost/api/index.php
# Should show PHP code, not an error
```

### 1.3 Test Login Endpoint
```bash
# Using Git Bash, PowerShell, or cURL:
curl -X POST http://localhost/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"hr@hospital.com\",\"password\":\"password123\"}"

# Expected: JSON response with token
# If error: Check database has users table with data
```

### 1.4 Test Employee Endpoint
```bash
curl http://localhost/api/employee/get_all
# Expected: JSON array of employees
```

### 1.5 Test Patient Endpoint
```bash
curl http://localhost/api/patient/get_all
# Expected: JSON array of patients
```

### 1.6 Test Department Endpoint
```bash
curl http://localhost/api/department/get_all
# Expected: JSON array of departments
```

---

## Phase 2: Frontend Verification (5 minutes)

### 2.1 Start Frontend Server
```bash
# In project frontend directory:
npm run dev

# Expected output:
# ➜ Local:   http://localhost:5173/
# ➜ press h + enter to show help
```

### 2.2 Check Browser Console
```
❑ Open http://localhost:5173
❑ Open DevTools (F12)
❑ Go to Console tab
❑ Should be NO red errors about CORS or fetch
```

### 2.3 Check Network Tab
```
❑ Go to Network tab in DevTools
❑ Check each API call:
  - Should show status 200 or 201
  - Should NOT show CORS errors
  - Response should be valid JSON
```

---

## Phase 3: Login Flow Testing (5 minutes)

### 3.1 Test Login Screen
```
❑ Page shows login form
❑ Form has email/password fields
❑ "Sign In" button is visible and clickable
```

### 3.2 Test With Correct Credentials
```
Credentials:
  Email: hr@hospital.com
  Password: password123

❑ Click "Sign In"
❑ Should NOT show any CORS errors in console
❑ Should NOT show "Failed to fetch" errors
❑ Should redirect to HR Dashboard after 2-3 seconds
```

### 3.3 Verify Token in Storage
```javascript
// In browser console, run:
console.log(localStorage.getItem('hms_token'));

❑ Should print a long JWT token (starts with eyJ...)
❑ Should NOT be null or undefined
```

### 3.4 Test With Wrong Credentials
```
Credentials:
  Email: hr@hospital.com
  Password: wrongpassword

❑ Click "Sign In"
❑ Should show error message: "Invalid email or password"
❑ Should NOT redirect
❑ Form should clear password field
```

---

## Phase 4: Dashboard Verification (5 minutes)

### 4.1 HR Dashboard (Login with hr@hospital.com)
```
Expected to see:
❑ "HR Dashboard" title
❑ Employee list with data from database:
  - Names of employees
  - Departments
  - Status (Active/On Leave/Inactive)
❑ Table with at least 5 employees
❑ No "Loading..." text staying on screen
```

### 4.2 Doctor Dashboard (Login with doctor@hospital.com)
```
Expected to see:
❑ "Doctor Dashboard"or "Appointments" section
❑ List of appointments
❑ Patient information
❑ Medical records section (if implemented)
```

### 4.3 Front Desk Dashboard (Login with desk@hospital.com)
```
Expected to see:
❑ Patient management interface
❑ Patient list from database
❑ Admit/Discharge options (if implemented)
❑ Appointment booking capability
```

### 4.4 Billing Dashboard (Login with billing@hospital.com)
```
Expected to see:
❑ Invoice list
❑ Billing data from database
❑ Payment status indicators
❑ Invoice details
```

---

## Phase 5: API Testing (Advanced, 10 minutes)

### 5.1 Using Postman or Insomnia

**Import these requests:**

1. **Login Request**
   - Method: POST
   - URL: http://localhost/api/auth/login
   - Body (JSON):
     ```json
     {
       "email": "hr@hospital.com",
       "password": "password123"
     }
     ```
   - Headers: Content-Type: application/json
   - ✅ Should return: token + user data

2. **Get Employees**
   - Method: GET
   - URL: http://localhost/api/employee/get_all
   - Headers: Content-Type: application/json
   - ✅ Should return: Array of employees

3. **Get Patients**
   - Method: GET
   - URL: http://localhost/api/patient/get_all
   - ✅ Should return: Array of patients

4. **Get Departments**
   - Method: GET
   - URL: http://localhost/api/department/get_all
   - ✅ Should return: Array of departments

5. **Get Billing**
   - Method: GET
   - URL: http://localhost/api/billing/get_all
   - ✅ Should return: Array of invoices

6. **Get Available Beds**
   - Method: GET
   - URL: http://localhost/api/bed/get_available
   - ✅ Should return: Array of available beds

---

## ⚠️ Common Issues & Solutions

### Issue: "Access to fetch ... blocked by CORS"
```
Solution:
1. Verify Apache is running
2. Check /api/index.php exists
3. Check .htaccess file in /api/ folder
4. Restart Apache
```

### Issue: "Failed to fetch" (no CORS error)
```
Solution:
1. Make sure MySQL is running
2. Check http://localhost/api/index.php loads
3. Verify database exists: hr_pms_erp
4. Check Apache error logs
```

### Issue: Login shows "Invalid email or password"
```
Solution:
1. Verify users exist in database:
   SELECT * FROM users;
2. Check password is exactly: password123
3. Check email is exact match (case-sensitive)
4. Verify db_connection.php connects successfully
```

### Issue: Dashboard loads but shows "Loading..."
```
Solution:
1. Check Network tab for failed API requests
2. Test API endpoint directly: 
   curl http://localhost/api/employee/get_all
3. Verify employee table has data
4. Check for JavaScript errors in console
```

### Issue: Folder path error in API messages
```
Solution:
1. Verify folder structure matches expected path
2. Check /api/index.php has correct backend path
3. Update path in index.php if needed
```

---

## 📊 Data Verification SQL Queries

### Check Users Exist
```sql
SELECT id, email, name, role FROM users;
-- Should show 5 users
```

### Check Employees Exist
```sql
SELECT id, name, role, department, status FROM employees;
-- Should show 8 employees
```

### Check Patients Exist
```sql
SELECT id, name, email, status FROM patients;
-- Should show 6 patients
```

### Check Departments Exist
```sql
SELECT id, name, head, budget FROM departments;
-- Should show 8 departments
```

### Check Appointments Exist
```sql
SELECT * FROM appointments;
-- Should show several appointments
```

### Check Beds Exist
```sql
SELECT id, bed_number, ward, status FROM beds;
-- Should show 10 beds
```

---

## ✅ Success Criteria

Your system is working correctly if:
1. ✅ Can login with hr@hospital.com / password123
2. ✅ Dashboard loads without CORS errors
3. ✅ Employee data displays in HR Dashboard
4. ✅ Patient data displays in Front Desk Dashboard
5. ✅ All API endpoints return valid JSON data
6. ✅ Can switch between user roles (rolemail uses)
7. ✅ Token is stored in localStorage
8. ✅ Token is used for authenticated requests
9. ✅ No "Failed to fetch" errors in console
10. ✅ Page title updates based on user role

---

## 🎯 Final Verification

After completing all phases, run this final test:

```bash
# 1. Open browser console (F12)
# 2. Clear storage
localStorage.clear();

# 3. Refresh page
# 4. Try login again with hr@hospital.com / password123
# 5. Should see dashboard load successfully
# 6. Check token is set
console.log('Token:', localStorage.getItem('hms_token'));
console.log('User:', localStorage.getItem('hms_user'));

# 7. Open Network tab and verify:
# - All API calls show status 200 or 201
# - No CORS errors shown
# - Response JSON is valid
```

---

**If all checks pass: System is ready for production testing!** 🎉
