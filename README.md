# ITVentory - Inventory Management System

ITVentory adalah sistem manajemen inventaris yang dibangun dengan React dan Vite. Sistem ini menyediakan interface untuk mengelola barang, kategori, peminjaman, dan detail peminjaman.

## Fitur Utama

### User Interface
- **Home Page**: Dashboard utama dengan overview inventaris
- **Barang**: Halaman untuk melihat daftar barang
- **Loan**: Formulir peminjaman barang
- **Details**: Riwayat detail peminjaman

### Admin Dashboard
- **Dashboard Admin**: Overview statistik dan quick actions
- **User Management**: CRUD operations untuk user
- **Barang Management**: CRUD operations untuk barang
- **Kategori Management**: CRUD operations untuk kategori
- **Peminjaman Management**: CRUD operations untuk peminjaman
- **Detail Peminjaman Management**: CRUD operations untuk detail peminjaman

## API Endpoints

Aplikasi ini terhubung dengan backend API dengan endpoint berikut:

1. **User Login**: `https://pweb-be-production.up.railway.app/user/login`
2. **Barang**: `https://pweb-be-production.up.railway.app/barang`
3. **Kategori**: `https://pweb-be-production.up.railway.app/kategori`
4. **Peminjaman**: `https://pweb-be-production.up.railway.app/peminjaman`
5. **Detail**: `https://pweb-be-production.up.railway.app/detail`

## Teknologi yang Digunakan

- **React 19.1.0**: Library JavaScript untuk membangun user interface
- **Vite 6.3.5**: Build tool dan development server
- **React Router DOM 7.6.2**: Routing untuk aplikasi React
- **Tailwind CSS 4.1.8**: Framework CSS untuk styling
- **Lucide React 0.511.0**: Icon library

## Instalasi dan Menjalankan Aplikasi

1. Clone repository
```bash
git clone <repository-url>
cd itventory
```

2. Install dependencies
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

4. Buka browser dan akses `http://localhost:5173` atau port yang ditampilkan

## Struktur Folder

```
src/
├── components/
│   ├── AdminLayout.jsx      # Layout untuk halaman admin
│   └── Navbar.jsx           # Navigation bar
├── pages/
│   ├── admin/               # Halaman-halaman admin
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminBarang.jsx
│   │   ├── AdminKategori.jsx
│   │   ├── AdminPeminjaman.jsx
│   │   └── AdminDetailPeminjaman.jsx
│   ├── Barang.jsx
│   ├── DetailPeminjaman.jsx
│   ├── HomePage.jsx
│   ├── Loan.jsx
│   └── LoginPage.jsx
├── App.jsx                  # Main app component
└── main.jsx                 # Entry point
```

## Fitur Admin Dashboard

### 1. User Management (`/admin/users`)
- Melihat daftar user
- Menambah user baru
- Mengedit informasi user
- Menghapus user
- Search dan filter user

### 2. Barang Management (`/admin/barang`)
- Melihat daftar barang
- Menambah barang baru
- Mengedit informasi barang
- Menghapus barang
- Search barang berdasarkan nama atau kategori

### 3. Kategori Management (`/admin/kategori`)
- Melihat daftar kategori
- Menambah kategori baru
- Mengedit nama kategori
- Menghapus kategori
- Search kategori

### 4. Peminjaman Management (`/admin/peminjaman`)
- Melihat daftar peminjaman
- Menambah peminjaman baru
- Mengedit status peminjaman
- Menghapus peminjaman
- Filter berdasarkan status

### 5. Detail Peminjaman Management (`/admin/detail`)
- Melihat detail item yang dipinjam
- Menambah detail peminjaman
- Mengedit jumlah dan keterangan
- Menghapus detail peminjaman

## Akses Admin

Untuk mengakses admin dashboard, navigasi ke `/admin` atau klik menu "Admin" di navigation bar.

## Build untuk Production

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Catatan Pengembangan

- Semua halaman admin menggunakan `AdminLayout` component untuk konsistensi UI
- API calls menggunakan `credentials: 'include'` untuk session management
- Error handling tersedia di setiap halaman admin
- Loading states ditampilkan saat fetching data
- Modal forms digunakan untuk create/edit operations
- Search dan filter functionality tersedia di setiap management page
