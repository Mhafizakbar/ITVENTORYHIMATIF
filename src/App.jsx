import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Barang from './pages/Barang';
import Loan from './pages/Loan';
import DetailPeminjaman from './pages/DetailPeminjaman';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBarang from './pages/admin/AdminBarang';
import AdminKategori from './pages/admin/AdminKategori';
import AdminPeminjaman from './pages/admin/AdminPeminjaman';
import AdminDetailPeminjaman from './pages/admin/AdminDetailPeminjaman';
import ProtectedRoute from './components/ProtectedRoute';
import AdminTestLogin from './components/AdminTestLogin';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin-test" element={<AdminTestLogin />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/barang" element={
            <ProtectedRoute>
              <Barang />
            </ProtectedRoute>
          } />
          <Route path="/loan" element={
            <ProtectedRoute>
              <Loan />
            </ProtectedRoute>
          } />
          <Route path="/detail" element={
            <ProtectedRoute>
              <DetailPeminjaman />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/barang" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminBarang />
            </ProtectedRoute>
          } />
          <Route path="/admin/kategori" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminKategori />
            </ProtectedRoute>
          } />
          <Route path="/admin/peminjaman" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPeminjaman />
            </ProtectedRoute>
          } />
          <Route path="/admin/detail" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDetailPeminjaman />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;