# 🚀 QUICK START (5 Minutes)

## Prerequisites Check

```bash
# Verify XAMPP is in your system
# - Apache should be running
# - MySQL should be running
# - Open http://localhost - should load XAMPP page
```

---

## Step 1: Database Setup (MySQL)

```bash
# 1. Open phpMyAdmin
http://localhost/phpmyadmin

# 2. Click "New" or "Create Database"
# 3. Name it: hr_pms_erp
# 4. Click "Create"

# 5. Select the hr_pms_erp database from left panel
# 6. Click "Import" tab at top
# 7. Choose file: db_setup.sql
# 8. Click "Go"

# Wait for import to complete, repeat for insert_test_users.sql
```

**Or using command line (faster):**
```bash
# Open MySQL Command Prompt (from XAMPP)
mysql -u root -p
# Press Enter when asked for password (empty)

# In MySQL shell:
CREATE DATABASE hr_pms_erp;
USE hr_pms_erp;
SOURCE C:\Users\[YourName]\XAMPP-control panel\htdocs\GNE-Hospital-Management-System--HR-CRM-\hr-patient-msys (With Backend)\hr-patient-msys\hr-patient-mysys-backend\hr-pms\db_setup.sql;
SOURCE C:\Users\[YourName]\XAMPP-control panel\htdocs\GNE-Hospital-Management-System--HR-CRM-\hr-patient-msys (With Backend)\hr-patient-msys\hr-patient-mysys-backend\hr-pms\insert_test_users.sql;
```

---

## Step 2: Start Frontend (React)

```bash
# Open PowerShell/Command Prompt
cd "C:\Users\[YourName]\XAMPP-control panel\htdocs\GNE-Hospital-Management-System--HR-CRM-\hr-patient-msys (With Backend)\hr-patient-msys\hr-patient-msys"

# First time only: install dependencies
npm install

# Start development server
npm run dev

# Browser will open automatically (http://localhost:5173)
# OR check terminal for the URL
```

---

## Step 3: Login & Test

**On the login screen, use:**
```
Email: juan.delacruz@hospital.com
Password: password123
```

**Or use:**
```
Email: maria.santos@hospital.com
Password: password123
```

**Or use:**
```
Email: jose.reyes@hospital.com
Password: password123
```

✅ You should see green "Login successful!" message and be redirected to dashboard.

---

## ✨ What You Should See

- ✅ Login page loads
- ✅ No red error messages
- ✅ Can enter email and password
- ✅ Green success message on login
- ✅ Redirect to HR/Doctor/Front Desk dashboard

---

## ⚠️ If You Get an Error

### Error: "Failed to fetch"
- Check if Apache is running in XAMPP
- Check if MySQL is running
- Try the database setup again

### Error: "Invalid username/email or password"
- Check spelling of email (must match exactly)
- Verify password is "password123"
- Run `insert_test_users.sql` again

### Error: Page won't load
- Check if npm dev server is running
- Check if there are any error messages in terminal
- Restart the dev server

---

## 🎉 You're Done!

The system is now working. You can:
- Explore all dashboards
- Navigate between modules
- Test the functionality

**For more details, see: `COMPLETE_SETUP_GUIDE.md`**
