# Admin Login & Dashboard Guide

## Cara Mengakses Admin Dashboard

### 1. Login Otomatis Berdasarkan Role

Sistem ITVentory sekarang sudah dilengkapi dengan **automatic role-based redirection**. Ketika user login:

- **User biasa (role: USER)** → Diarahkan ke `/home`
- **Admin (role: ADMIN)** → Diarahkan ke `/admin` (Admin Dashboard)

### 2. Langkah-langkah Login Admin

1. **Buka aplikasi** di `http://localhost:5174`
2. **Login dengan akun admin** menggunakan email dan password admin
3. **Sistem otomatis mendeteksi role** dari response backend
4. **Redirect otomatis** ke admin dashboard jika role = 'ADMIN'

### 3. Test Login Admin

Untuk testing, Anda bisa menggunakan:
- **URL Test**: `http://localhost:5174/admin-test`
- Halaman ini khusus untuk testing login admin

## Fitur Authentication

### ✅ Yang Sudah Diimplementasikan:

1. **AuthContext** - Global state management untuk user authentication
2. **ProtectedRoute** - Komponen untuk melindungi rute admin
3. **Role-based Access Control** - Hanya admin yang bisa akses `/admin/*`
4. **Automatic Redirection** - Login otomatis redirect berdasarkan role
5. **Session Management** - Menggunakan cookies untuk maintain session
6. **Logout Functionality** - Logout dari admin dashboard dan navbar

### 🔐 Keamanan:

- **Protected Routes**: Semua rute admin dilindungi dengan `ProtectedRoute`
- **Role Verification**: Sistem verifikasi role sebelum akses admin
- **Session Cookies**: Menggunakan httpOnly cookies untuk keamanan
- **Auto Logout**: Logout otomatis jika session expired

## Backend Integration

Sistem ini terintegrasi dengan endpoint backend Anda:

```javascript
// Login endpoint yang mengembalikan role
POST https://pweb-be-production.up.railway.app/user/login

// Response format:
{
  "data": "ADMIN" | "USER",
  "message": "Login berhasil, token disimpan di cookie"
}
```

## Struktur File Authentication

```
src/
├── context/
│   └── AuthContext.jsx          # Global auth state
├── components/
│   ├── ProtectedRoute.jsx       # Route protection
│   ├── AdminLayout.jsx          # Admin layout with auth
│   ├── AdminTestLogin.jsx       # Test login component
│   └── Navbar.jsx              # Updated with auth
├── pages/
│   ├── LoginPage.jsx           # Updated with role detection
│   └── admin/                  # All admin pages protected
└── App.jsx                     # Routes with protection
```

## Cara Kerja Sistem

### 1. Login Process
```
User Login → Backend Validation → Role Detection → Context Update → Auto Redirect
```

### 2. Route Protection
```
Access Admin Route → Check Auth Context → Verify Admin Role → Allow/Deny Access
```

### 3. Session Management
```
Login → Store in Context → Maintain Session → Auto Logout on Expire
```

## Testing Admin Functionality

### 1. Buat Akun Admin
Gunakan endpoint register dengan role 'ADMIN':
```javascript
POST https://pweb-be-production.up.railway.app/user/register
{
  "nama_lengkap": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

### 2. Test Login
1. Login dengan akun admin
2. Verifikasi redirect ke `/admin`
3. Test semua fitur CRUD di admin dashboard
4. Test logout functionality

### 3. Test Protection
1. Coba akses `/admin` tanpa login → Redirect ke `/`
2. Login sebagai user biasa → Tidak bisa akses `/admin`
3. Login sebagai admin → Bisa akses semua fitur admin

## Troubleshooting

### Problem: Tidak redirect ke admin setelah login
**Solution**: 
- Pastikan backend mengembalikan `data: "ADMIN"` dalam response
- Check console browser untuk error
- Verifikasi cookies tersimpan

### Problem: Admin menu tidak muncul
**Solution**:
- Pastikan user sudah login sebagai admin
- Check AuthContext state di browser dev tools
- Refresh halaman

### Problem: Logout tidak berfungsi
**Solution**:
- Check network tab untuk request logout
- Clear browser cookies manually
- Restart aplikasi

## Features Summary

✅ **Automatic Role Detection** - Sistem otomatis deteksi role dari login response  
✅ **Protected Admin Routes** - Semua rute admin dilindungi  
✅ **Role-based Navigation** - Menu admin hanya muncul untuk admin  
✅ **Session Management** - Maintain login state dengan cookies  
✅ **Auto Redirect** - Redirect otomatis berdasarkan role  
✅ **Secure Logout** - Logout yang aman dengan cleanup  

Sistem authentication sekarang sudah lengkap dan siap digunakan! 🎉
