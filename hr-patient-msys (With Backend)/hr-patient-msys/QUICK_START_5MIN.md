# ⚡ QUICK START - 5 Minute Setup

## Step 1: Import Database (1 minute)

### Option A: phpMyAdmin (Easiest)
```
1. Open http://localhost/phpmyadmin
2. Click "Databases" tab (top left)
3. Click "New" button
4. Create database name: hr_pms_erp
5. Click "Create"
6. Click on new "hr_pms_erp" database
7. Click "Import" tab at top
8. Click "Choose File" button
9. Select: db_setup.sql
   Location: GNE-Hospital.../hr-patient-msys/db_setup.sql
10. Scroll down and click "Import"
11. You should see: ✅ "Import successful"
```

### Option B: MySQL Command Line
```bash
mysql -u root hr_pms_erp < db_setup.sql
```

✅ **Database imported with:**
- 5 test users
- 8 employees
- 8 departments
- 6 patients
- All related data

---

## Step 2: Verify Database Import (30 seconds)

### In phpMyAdmin:
```
1. Click on hr_pms_erp database (left sidebar)
2. You should see 9 tables listed:
   □ users
   □ employees
   □ departments
   □ patients
   □ beds
   □ appointments
   □ admissions
   □ medical_records
   □ invoices
```

### Quick Verification:
```bash
mysql -u root hr_pms_erp -e "SELECT COUNT(*) as Users FROM users;"
# Should show: Users | 5
```

✅ **Ready to continue if you see 5 users**

---

## Step 3: Start Services (1 minute)

### XAMPP Control Panel:
```
1. Open XAMPP Control Panel
2. Find "Apache" row:
   □ Click START button if not running
   □ Wait for status = "Running" (green)
3. Find "MySQL" row:
   □ Click START button if not running
   □ Wait for status = "Running" (green)
```

✅ **Both services running when you see GREEN status**

---

## Step 4: Test Backend (1 minute)

### Using PowerShell or Git Bash:

**Test Login Endpoint:**
```powershell
curl.exe -X POST http://localhost/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"hr@hospital.com","password":"password123"}'
```

**Expected Output:** JSON with token
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "hr@hospital.com",
    "name": "Sarah Johnson",
    "role": "HR"
  }
}
```

✅ **If you see token: Backend is working!**

---

## Step 5: Start Frontend (1.5 minutes)

### Open Terminal/PowerShell:

**Navigate to Frontend:**
```bash
cd "GNE-Hospital-Management-System--HR-CRM-"
cd "hr-patient-msys (With Backend)"
cd "hr-patient-msys"
cd "hr-patient-msys"
```

**Install (if not done):**
```bash
npm install
```

**Start Dev Server:**
```bash
npm run dev
```

**Expected Output:**
```
➜ Local:   http://localhost:5173/
➜ press h + enter to show help
```

✅ **Ready when you see localhost:5173**

---

## Step 6: Test Login (30 seconds)

### In Browser:

```
1. Open http://localhost:5173
2. You should see GNE Hospital login form
3. Enter:
   Email:    hr@hospital.com
   Password: password123
4. Click "Sign In"
5. Wait 2-3 seconds for redirect
```

✅ **Success if you see HR Dashboard**

---

## Step 7: Verify Dashboard (30 seconds)

### HR Dashboard should show:
```
□ "HR Dashboard" title
□ Employee list table
□ Multiple employees with data:
  - Name (e.g., "Dr. James Smith")
  - Email
  - Department
  - Status
  - Salary (if visible)
□ No "Loading..." text stuck
□ No red error messages
```

✅ **Complete if dashboard loads with employee data**

---

## 🎉 Success! Your System is Running!

If you made it here, everything is working:
- ✅ Database imported
- ✅ Backend APIs responding
- ✅ Frontend loaded
- ✅ Login successful
- ✅ Dashboard displaying data

---

## 🧪 Quick Testing (Optional)

### Try Other User Roles:

**Doctor User:**
```
Email: doctor@hospital.com
Password: password123
→ Should see Doctor Dashboard (appointments)
```

**Front Desk User:**
```
Email: desk@hospital.com
Password: password123
→ Should see Patient Management Dashboard
```

**Billing User:**
```
Email: billing@hospital.com
Password: password123
→ Should see Billing/Invoice Dashboard
```

**Admin User:**
```
Email: admin@hospital.com
Password: password123
→ Should see Admin/System Dashboard
```

---

## ⚠️ If Something Goes Wrong

### CORS Error in Console?
```
Solution:
1. Verify Apache is running (XAMPP Control Panel)
2. Refresh browser (Ctrl+R)
3. Try login again
```

### "Failed to fetch" Error?
```
Solution:
1. Verify MySQL is running
2. Verify backend API:
   curl http://localhost/api/auth/login
3. If blank: Apache/PHP not working
```

### Login Shows "Invalid email or password"?
```
Solution:
1. Check email is EXACTLY: hr@hospital.com
2. Check password is EXACTLY: password123
3. In phpMyAdmin: SELECT * FROM users;
4. Verify user exists in database
```

### Dashboard Shows "Loading..." but no data?
```
Solution:
1. Open DevTools (F12)
2. Go to Network tab
3. Look for failed requests (red)
4. Check if you have employee data:
   mysql -u root hr_pms_erp -e "SELECT * FROM employees;"
```

---

## 📚 For More Help

See these files in your project directory:
```
├── FINAL_SETUP_GUIDE.md ................. Complete setup + troubleshooting
├── TESTING_QUICK_REFERENCE.md ........... Detailed testing checklist
├── SYSTEM_FIX_SUMMARY.md ................ What was fixed
├── FILES_CHANGED_REFERENCE.md ........... All files modified
└── db_setup.sql ......................... Database schema (already imported)
```

---

## 📞 Key Credentials

```
PRIMARY TEST USER:
  Email: hr@hospital.com
  Password: password123
  Role: HR
  
OTHER TEST USERS:
  doctor@hospital.com / password123 (Doctor)
  desk@hospital.com / password123 (Front Desk)
  billing@hospital.com / password123 (Billing)
  admin@hospital.com / password123 (Admin)
```

---

## ✅ Checklist - Complete When Done

- [ ] Imported db_setup.sql
- [ ] Apache running (green in XAMPP)
- [ ] MySQL running (green in XAMPP)
- [ ] Backend API responding (curl test)
- [ ] Frontend server started (npm run dev)
- [ ] Can access http://localhost:5173
- [ ] Can login with hr@hospital.com
- [ ] HR Dashboard loads with employee data
- [ ] No red errors in browser console
- [ ] No CORS errors

**All checked? You're done! 🎉**

---

## 🚀 Next: Real Usage

1. **Explore Dashboards**
   - Try different user roles
   - Check data from database
   - Verify all information displays

2. **Test Create Operations** (if implemented)
   - Add new patient
   - Book appointment
   - Create invoice
   - etc.

3. **Check API Responses**
   - Open DevTools (F12)
   - Go to Network tab
   - Watch API responses
   - Verify they contain real data

4. **Review Code**
   - Understand how data flows
   - Check models and controllers
   - Review API endpoints
   - Understand authentication

---

**Everything is ready to use. Enjoy your Hospital Management System!** 🏥✨
