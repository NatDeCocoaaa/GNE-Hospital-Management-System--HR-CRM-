# Quick Verification Checklist

## ✅ Code Changes Made

- [x] Fixed `apiClient.js` - Changed `username` parameter to `email`
- [x] Fixed `login.php` - Updated to match actual database schema
- [x] Removed Tailwind CDN from `index.html`
- [x] Removed demo credentials from `Login.jsx`
- [x] Created `insert_test_users.sql` with bcrypt-hashed test users

---

## 🔍 Before Starting the App

### 1. Database Verification
```bash
# Check if MySQL is running
mysql -u root -h localhost -e "SELECT 1;"

# Check if hr_pms_erp database exists
mysql -u root -h localhost -e "SHOW DATABASES; " | grep hr_pms_erp

# Verify users table structure
mysql -u root -h localhost hr_pms_erp -e "DESCRIBE users;"
```

**Expected users table structure:**
```
+------------------+-----------------------+------+-----+---------+----------------+
| Field            | Type                  | Null | Key | Default | Extra          |
+------------------+-----------------------+------+-----+---------+----------------+
| user_id          | int(11)               | NO   | PRI | NULL    | auto_increment |
| emp_id           | int(11)               | NO   | MUL | NULL    |                |
| username         | varchar(100)          | NO   | UNI | NULL    |                |
| password_hash    | varchar(255)          | NO   |     | NULL    |                |
| access_role      | enum(...)             | NO   |     | NULL    |                |
| is_active        | tinyint(1)            | YES  |     | 1       |                |
+------------------+-----------------------+------+-----+---------+----------------+
```

---

## 📝 Add Test Users

**Execute this SQL to add test users:**

```sql
INSERT INTO `users` (`emp_id`, `username`, `password_hash`, `access_role`, `is_active`) 
VALUES (6, 'hr@hospital.com', '$2y$10$8K9p/.n9U6v8NlXf0v0xueN5jH5S.WjG2F.M8A3H8k/1X8Z3.C7Q.', 'HR', 1);

INSERT INTO `users` (`emp_id`, `username`, `password_hash`, `access_role`, `is_active`) 
VALUES (7, 'doctor@hospital.com', '$2y$10$8K9p/.n9U6v8NlXf0v0xueN5jH5S.WjG2F.M8A3H8k/1X8Z3.C7Q.', 'Doctor', 1);

INSERT INTO `users` (`emp_id`, `username`, `password_hash`, `access_role`, `is_active`) 
VALUES (8, 'desk@hospital.com', '$2y$10$8K9p/.n9U6v8NlXf0v0xueN5jH5S.WjG2F.M8A3H8k/1X8Z3.C7Q.', 'FrontDesk', 1);
```

**Or execute the SQL file:**
```bash
mysql -u root hr_pms_erp < insert_test_users.sql
```

---

## 🚀 Start the Application

### Terminal 1 - Backend (XAMPP)
```bash
# Start Apache and MySQL from XAMPP Control Panel
# Or if using command line:
cd "C:\xampp"
apache_start.bat
mysql_start.bat
```

### Terminal 2 - Frontend
```bash
cd "path/to/hr-patient-msys (With Backend)/hr-patient-msys/hr-patient-msys"
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## ✔️ Test Login

1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - **Email**: `hr@hospital.com`
   - **Password**: `password123`
3. Click "Sign In"
4. **Expected**: Should redirect to HR Dashboard with no errors
5. **Check**: Browser DevTools → Application → localStorage → `hms_token` should exist

---

## 🐛 Debug Issues

### Issue: Page shows "SyntaxError: Unexpected token..."

**Check Backend Response:**
```bash
# Test login endpoint directly
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@hospital.com","password":"password123"}'
```

**Should return JSON:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "...",
  "user": {...}
}
```

**If not**, check:
1. MySQL is running: `mysql -u root -e "SELECT 1;"`
2. Database exists: `mysql -u root -e "USE hr_pms_erp;"`
3. Users table exists: `mysql -u root hr_pms_erp -e "SELECT * FROM users;"`
4. PHP can connect: Check `config/db_connection.php`

---

## 📋 Changed Files Summary

| File | Change |
|------|--------|
| `src/services/apiClient.js` | `username` → `email` parameter |
| `src/pages/Login.jsx` | Removed demo credentials |
| `index.html` | Removed Tailwind CDN script |
| `api/login.php` | Fixed database schema matching |
| `insert_test_users.sql` | **NEW** - Test user insertions |

---

## 🎯 Next Steps

1. [ ] Verify MySQL/Apache are running
2. [ ] Execute `insert_test_users.sql` to add test users
3. [ ] Start frontend with `npm run dev`
4. [ ] Test login with `hr@hospital.com` / `password123`
5. [ ] Check browser console for errors
6. [ ] Verify token in localStorage
7. [ ] Test each role (HR, Doctor, FrontDesk)

---

## 📞 Support

If you encounter issues:

1. **Check PHP error logs**: `C:\xampp\apache\logs\error.log`
2. **Check MySQL error logs**: `C:\xampp\mysql\data\*.err`
3. **Check browser console**: DevTools → Console
4. **Check network requests**: DevTools → Network

