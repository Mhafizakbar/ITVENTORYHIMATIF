# Admin Dashboard Guide

Panduan lengkap untuk menggunakan Admin Dashboard ITVentory.

## Akses Admin Dashboard

1. Buka aplikasi ITVentory
2. Login dengan akun admin
3. Klik menu "Admin" di navigation bar atau navigasi ke `/admin`

## Dashboard Overview

Dashboard admin menampilkan:
- **Statistik sistem**: Total users, barang, kategori, peminjaman
- **Quick Actions**: Shortcut ke halaman management utama
- **System Status**: Status koneksi API dan database

## User Management

### Menambah User Baru
1. Klik "Add User" di halaman Users
2. Isi form dengan informasi:
   - Nama lengkap
   - Email
   - Password
   - Nomor telepon
   - Role (User/Admin)
3. Klik "Create"

### Mengedit User
1. Klik icon edit (pensil) pada user yang ingin diedit
2. Ubah informasi yang diperlukan
3. Password bisa dikosongkan jika tidak ingin diubah
4. Klik "Update"

### Menghapus User
1. Klik icon delete (trash) pada user yang ingin dihapus
2. Konfirmasi penghapusan

## Barang Management

### Menambah Barang Baru
1. Klik "Add Barang" di halaman Barang
2. Isi form dengan informasi:
   - Nama barang
   - Kategori (pilih dari dropdown)
   - Jumlah
   - Deskripsi
3. Klik "Create"

### Mengedit Barang
1. Klik icon edit pada barang yang ingin diedit
2. Ubah informasi yang diperlukan
3. Klik "Update"

### Menghapus Barang
1. Klik icon delete pada barang yang ingin dihapus
2. Konfirmasi penghapusan

## Kategori Management

### Menambah Kategori Baru
1. Klik "Add Kategori" di halaman Kategori
2. Masukkan nama kategori
3. Klik "Create"

### Mengedit Kategori
1. Klik icon edit pada kategori yang ingin diedit
2. Ubah nama kategori
3. Klik "Update"

### Menghapus Kategori
1. Klik icon delete pada kategori yang ingin dihapus
2. Konfirmasi penghapusan
3. **Perhatian**: Pastikan tidak ada barang yang menggunakan kategori ini

## Peminjaman Management

### Menambah Peminjaman Baru
1. Klik "Add Peminjaman" di halaman Peminjaman
2. Isi form dengan informasi:
   - User (pilih dari dropdown)
   - Tanggal kembali
   - Status (Aktif/Selesai/Terlambat)
3. Klik "Create"

### Mengedit Peminjaman
1. Klik icon edit pada peminjaman yang ingin diedit
2. Ubah informasi yang diperlukan
3. Klik "Update"

### Menghapus Peminjaman
1. Klik icon delete pada peminjaman yang ingin dihapus
2. Konfirmasi penghapusan

## Detail Peminjaman Management

### Menambah Detail Peminjaman
1. Klik "Add Detail" di halaman Detail Peminjaman
2. Isi form dengan informasi:
   - Peminjaman (pilih dari dropdown)
   - Barang (pilih dari dropdown)
   - Jumlah pinjam
   - Keterangan (opsional)
3. Klik "Create"

### Mengedit Detail Peminjaman
1. Klik icon edit pada detail yang ingin diedit
2. Ubah informasi yang diperlukan
3. Klik "Update"

### Menghapus Detail Peminjaman
1. Klik icon delete pada detail yang ingin dihapus
2. Konfirmasi penghapusan

## Fitur Search dan Filter

Setiap halaman management memiliki fitur search:
- **Users**: Search berdasarkan nama atau email
- **Barang**: Search berdasarkan nama barang atau kategori
- **Kategori**: Search berdasarkan nama kategori
- **Peminjaman**: Search berdasarkan nama user atau status
- **Detail**: Search berdasarkan nama barang atau keterangan

## Tips Penggunaan

1. **Backup Data**: Selalu backup data sebelum melakukan operasi delete massal
2. **Validasi Input**: Pastikan data yang diinput sudah benar sebelum submit
3. **Check Dependencies**: Sebelum menghapus kategori, pastikan tidak ada barang yang menggunakannya
4. **Monitor Status**: Pantau status peminjaman secara berkala
5. **User Roles**: Hati-hati saat mengubah role user menjadi admin

## Troubleshooting

### Error "Failed to fetch data"
- Periksa koneksi internet
- Pastikan backend API berjalan
- Refresh halaman dan coba lagi

### Modal tidak muncul
- Refresh halaman
- Clear browser cache
- Pastikan JavaScript enabled

### Data tidak tersimpan
- Periksa semua field required sudah diisi
- Pastikan format data sesuai (email, nomor, dll)
- Cek console browser untuk error message

## Keamanan

- Logout setelah selesai menggunakan admin panel
- Jangan share kredensial admin
- Monitor aktivitas user secara berkala
- Backup data secara rutin
