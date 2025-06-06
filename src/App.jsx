import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Barang from './pages/Barang';
import Loan from './pages/Loan';
import DetailPeminjaman from './pages/DetailPeminjaman';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/barang" element={<Barang />} />
          <Route path="/loan" element={<Loan />} />
          <Route path="/detail" element={<DetailPeminjaman />} />
      </Routes>
    </Router>
  );
}

export default App;