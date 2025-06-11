import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';
import { useAlert } from '../hooks/useModal';
import {
  getCurrentDate,
  getMinReturnDate,
  validateLoanDates,
  formatDateToIndonesian
} from '../utils/dateUtils';
import { FormDateDisplay, DateStatus } from '../components/RealTimeDate';
import { TimezoneInfo } from '../components/IndonesiaTimezone';
import { Loader2, AlertCircle } from 'lucide-react';

const Loan = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const alert = useAlert();

  const [formData, setFormData] = useState({
    nama: '',
    tanggalPinjam: getCurrentDate(), // Auto-set ke hari ini menggunakan utility
    tanggalKembali: '',
    barangDipinjam: [],
  });
  const [barangBaru, setBarangBaru] = useState({
    id_barang: '', // Menggunakan id_barang dari API
    jumlah: 1,
    keterangan: '',
  });
  const [barangTersedia, setBarangTersedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication and fetch data barang dari API
  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate('/');
      return;
    }

    const fetchBarang = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://pweb-be-production.up.railway.app/barang', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching barang: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setBarangTersedia(data);
      } catch (err) {
        console.error('Error fetching barang:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBarang();

    // Set tanggal peminjaman ke hari ini setiap kali komponen dimount
    const today = getCurrentDate();
    setFormData(prev => ({
      ...prev,
      tanggalPinjam: today
    }));
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBarangChange = (e) => {
    const { name, value } = e.target;
    setBarangBaru((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const tambahBarang = () => {
    if (barangBaru.id_barang.trim() !== '') {
      const selectedBarang = barangTersedia.find(
        (barang) => barang.id_barang === parseInt(barangBaru.id_barang)
      );

      // Validasi stok tersedia
      if (!selectedBarang) {
        alert('Barang tidak ditemukan!');
        return;
      }

      const stokTersedia = selectedBarang.jumlah || 0;
      const jumlahPinjam = parseInt(barangBaru.jumlah);

      // Cek apakah barang sudah ada di daftar peminjaman
      const existingItem = formData.barangDipinjam.find(
        item => parseInt(item.id_barang) === parseInt(barangBaru.id_barang)
      );

      const totalJumlahPinjam = existingItem ?
        existingItem.jumlah + jumlahPinjam :
        jumlahPinjam;

      if (totalJumlahPinjam > stokTersedia) {
        alert(`Stok tidak mencukupi! Stok tersedia: ${stokTersedia}, Total yang akan dipinjam: ${totalJumlahPinjam}`);
        return;
      }

      if (existingItem) {
        // Update jumlah jika barang sudah ada
        setFormData((prev) => ({
          ...prev,
          barangDipinjam: prev.barangDipinjam.map(item =>
            parseInt(item.id_barang) === parseInt(barangBaru.id_barang)
              ? { ...item, jumlah: totalJumlahPinjam, keterangan: barangBaru.keterangan }
              : item
          ),
        }));
      } else {
        // Tambah barang baru
        setFormData((prev) => ({
          ...prev,
          barangDipinjam: [
            ...prev.barangDipinjam,
            {
              id: Date.now(),
              id_barang: barangBaru.id_barang,
              namaBarang: selectedBarang?.nama_barang || 'Unknown',
              jumlah: jumlahPinjam,
              stokTersedia: stokTersedia,
              keterangan: barangBaru.keterangan,
            },
          ],
        }));
      }

      setBarangBaru({
        id_barang: '',
        jumlah: 1,
        keterangan: '',
      });
    }
  };

  const hapusBarang = (id) => {
    setFormData((prev) => ({
      ...prev,
      barangDipinjam: prev.barangDipinjam.filter((barang) => barang.id !== id),
    }));
  };

  const updateStokBarang = async () => {
    try {
      // Update stok untuk setiap barang yang dipinjam
      for (const barang of formData.barangDipinjam) {
        const selectedBarang = barangTersedia.find(
          (item) => item.id_barang === parseInt(barang.id_barang)
        );

        if (selectedBarang) {
          const newStok = selectedBarang.jumlah - parseInt(barang.jumlah);

          const updateResponse = await fetch(`https://pweb-be-production.up.railway.app/barang/${barang.id_barang}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nama_barang: selectedBarang.nama_barang,
              id_kategori: selectedBarang.id_kategori,
              jumlah: newStok,
              deskripsi: selectedBarang.deskripsi || ''
            }),
          });

          if (!updateResponse.ok) {
            console.error(`Failed to update stock for barang ${barang.id_barang}`);
          }
        }
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Check if user is logged in
  if (!isLoggedIn()) {
    alert.showError('Login Required', 'Anda harus login terlebih dahulu!');
    setTimeout(() => navigate('/'), 2000);
    return;
  }

  // Validasi form
  if (!formData.nama || !formData.tanggalPinjam || !formData.tanggalKembali) {
    alert.showWarning('Form Incomplete', 'Mohon lengkapi semua field yang wajib diisi!');
    return;
  }

  if (formData.barangDipinjam.length === 0) {
    alert.showWarning('No Items', 'Mohon tambahkan minimal satu barang untuk dipinjam!');
    return;
  }

  // Validasi tanggal menggunakan utility function
  const dateValidation = validateLoanDates(formData.tanggalPinjam, formData.tanggalKembali);
  if (!dateValidation.isValid) {
    alert.showWarning('Invalid Date', dateValidation.message);
    return;
  }

  try {
    // Coba dapatkan user ID dari endpoint users berdasarkan email
    let userId = 1; // Default fallback

    try {
      const usersResponse = await fetch('https://pweb-be-production.up.railway.app/user', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const currentUser = users.find(u => u.email === user.email);
        if (currentUser) {
          userId = currentUser.id_pengguna || currentUser.id;
        }
      }
    } catch (userFetchError) {
      console.log('Could not fetch user ID, using default:', userFetchError);
    }

    // Format data untuk dikirim ke API
    const peminjamanData = {
      id_pengguna: userId,
      tanggal_kembali: formData.tanggalKembali,
      detail: formData.barangDipinjam.map((barang) => ({
        id_barang: parseInt(barang.id_barang),
        jumlah_pinjam: parseInt(barang.jumlah),
        keterangan: barang.keterangan || '',
      })),
    };

    // Submit peminjaman data
    const response = await fetch('https://pweb-be-production.up.railway.app/peminjaman', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(peminjamanData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear local storage and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        alert.showError('Session Expired', 'Sesi Anda telah berakhir. Silakan login ulang.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Peminjaman berhasil:', result);

    // Update stok barang setelah peminjaman berhasil
    await updateStokBarang();

    alert.showSuccess(
      'Success!',
      'Formulir peminjaman berhasil disubmit! Stok barang telah diperbarui.'
    );

    // Reset form dengan tanggal peminjaman tetap hari ini
    const today = getCurrentDate();
    setFormData({
      nama: '',
      tanggalPinjam: today,
      tanggalKembali: '',
      barangDipinjam: [],
    });
  } catch (err) {
    console.error('Error submitting peminjaman:', err);
    if (err.message.includes('login') || err.message.includes('Sesi')) {
      // Redirect to login if authentication error
      setTimeout(() => navigate('/'), 2000);
    }
    alert.showError('Error!', `Terjadi kesalahan: ${err.message}`);
  }
};

  // Background image URL
  const backgroundImage = 'fixbg.jpg';

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen page-background">
        <div className="content-wrapper">
          <Navbar />
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin mx-auto mb-4 text-[#096B68]" />
              <p className="text-base sm:text-lg text-slate-600">Memuat data barang...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen page-background">
        <div className="content-wrapper">
          <Navbar />
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Terjadi Kesalahan</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-4 px-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 sm:px-6 py-2 bg-[#096B68] text-white rounded-lg hover:bg-[#085854] transition-colors text-sm sm:text-base"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx="true">{`
        /* Background styles with enhanced blur */
        .page-background {
          background-image: url('${backgroundImage}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          position: relative;
          min-height: 100vh;
        }

        .page-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.6),
            rgba(255, 255, 255, 0.7)
          );
          backdrop-filter: blur(8px);
          z-index: 1;
        }

        .page-background::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(4px);
          z-index: 2;
        }

        .content-wrapper {
          position: relative;
          z-index: 3;
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(144, 209, 202, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(144, 209, 202, 0.6);
          }
        }

        .animate-slide-in-top {
          animation: slideInFromTop 0.8s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInFromLeft 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInFromRight 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }

        /* Enhanced form container blur */
        .form-container {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <div className="min-h-screen page-background">
        <div className="content-wrapper">
          <Navbar />
          <div className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 form-container shadow-xl sm:shadow-2xl rounded-2xl sm:rounded-3xl animate-scale-in animate-pulse-glow">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#096B68] mb-6 sm:mb-8 text-center border-b pb-4 sm:pb-6 animate-slide-in-top">
                <span className="text-[#096B68]">Formulir Peminjaman Barang</span>
              </h2>

              {/* Timezone Info */}
              <TimezoneInfo className="mb-6 animate-fade-in delay-100" />

              <div className="space-y-6 sm:space-y-8">
                {/* Data Peminjam */}
                <div className="bg-gradient-to-r from-[#90D1CA] to-[#FFFBDE] p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-l-4 border-[#096B68] shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-200">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6 flex items-center">
                    👤 <span className="ml-2 text-[#096B68]">Data Peminjam</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 text-sm sm:text-base"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Tanggal Peminjaman *
                      </label>

                      {/* Real-time date display */}
                      <FormDateDisplay
                        label=""
                        showTimezone={true}
                        className="mb-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
                      />

                      <input
                        type="date"
                        name="tanggalPinjam"
                        value={formData.tanggalPinjam}
                        onChange={handleInputChange}
                        min={getCurrentDate()}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 text-sm sm:text-base"
                      />

                      {/* Date status indicator */}
                      <DateStatus className="mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Tanggal Kembali *
                      </label>
                      <input
                        type="date"
                        name="tanggalKembali"
                        value={formData.tanggalKembali}
                        onChange={handleInputChange}
                        min={getMinReturnDate(formData.tanggalPinjam)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Tambah Barang */}
                <div className="bg-gradient-to-r from-[#FFFBDE] to-[#90D1CA] p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-l-4 border-[#096B68] shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-300">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6 flex items-center">
                    ➕ <span className="ml-2 text-[#096B68]">Tambah Barang</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Nama Barang
                      </label>
                      <select
                        name="id_barang"
                        value={barangBaru.id_barang}
                        onChange={handleBarangChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-teal-400 text-sm sm:text-base"
                      >
                        <option value="">Pilih Barang</option>
                        {barangTersedia.map((barang) => (
                          <option key={barang.id_barang} value={barang.id_barang}>
                            {barang.nama_barang} (Stok: {barang.jumlah || 0})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Jumlah
                      </label>
                      <input
                        type="number"
                        name="jumlah"
                        value={barangBaru.jumlah}
                        onChange={handleBarangChange}
                        min="1"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-teal-400 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Keterangan
                      </label>
                      <input
                        type="text"
                        name="keterangan"
                        value={barangBaru.keterangan}
                        onChange={handleBarangChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-teal-400 text-sm sm:text-base"
                        placeholder="Opsional"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={tambahBarang}
                        className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-[#FFFBDE] text-[#096B68] font-medium rounded-lg sm:rounded-xl hover:bg-[#90D1CA] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-lg text-sm sm:text-base"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>

                {/* Daftar Barang yang Dipinjam */}
                {formData.barangDipinjam.length > 0 && (
                  <div className="bg-[#FFFBDE] p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-l-4 border-[#096B68] shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-400">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6 flex items-center">
                      📦{' '}
                      <span className="ml-2 text-[#096B68]">
                        Barang yang Dipinjam ({formData.barangDipinjam.length} item)
                      </span>
                    </h3>
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                      <table className="w-full min-w-[600px] border-collapse border-2 border-[#096B68] rounded-lg sm:rounded-2xl overflow-hidden shadow-lg">
                        <thead>
                          <tr className="bg-[#096B68]">
                            <th className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-bold text-white text-xs sm:text-sm lg:text-base">
                              No
                            </th>
                            <th className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-bold text-white text-xs sm:text-sm lg:text-base">
                              Nama Barang
                            </th>
                            <th className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-bold text-white text-xs sm:text-sm lg:text-base">
                              Jumlah Pinjam
                            </th>
                            <th className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-bold text-white text-xs sm:text-sm lg:text-base">
                              Stok Tersedia
                            </th>
                            <th className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-bold text-white text-xs sm:text-sm lg:text-base">
                              Keterangan
                            </th>
                            <th className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-bold text-white text-xs sm:text-sm lg:text-base">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.barangDipinjam.map((barang, index) => (
                            <tr
                              key={barang.id}
                              className="bg-gradient-to-r from-green-50 to-emerald-50 transition-all duration-300"
                            >
                              <td className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 font-medium text-xs sm:text-sm lg:text-base">
                                {index + 1}
                              </td>
                              <td className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 font-bold text-gray-800 text-xs sm:text-sm lg:text-base">
                                {barang.namaBarang}
                              </td>
                              <td className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                                <span className="inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {barang.jumlah}
                                </span>
                              </td>
                              <td className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                                <span className="inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  {barang.stokTersedia || 'N/A'}
                                </span>
                              </td>
                              <td className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-gray-600 text-xs sm:text-sm lg:text-base">
                                {barang.keterangan || '-'}
                              </td>
                              <td className="border border-[#096B68] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                                <button
                                  type="button"
                                  onClick={() => hapusBarang(barang.id)}
                                  className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-6 sm:pt-8 animate-fade-in-up delay-500">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-[#096B68] text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl hover:bg-[#90D1CA] focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 shadow-xl sm:shadow-2xl"
                  >
                    Submit Peminjaman
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.alert.isOpen}
        onClose={alert.hideAlert}
        title={alert.alert.title}
        message={alert.alert.message}
        type={alert.alert.type}
      />
    </>
  );
};

export default Loan;