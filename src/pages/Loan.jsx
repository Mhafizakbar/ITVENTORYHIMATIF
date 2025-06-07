import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Loader2, AlertCircle } from 'lucide-react';

const Loan = () => {
  const [formData, setFormData] = useState({
    nama: '',
    tanggalPinjam: '',
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

  // Fetch data barang dari API
  useEffect(() => {
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
  }, []);

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
      setFormData((prev) => ({
        ...prev,
        barangDipinjam: [
          ...prev.barangDipinjam,
          {
            id: Date.now(),
            id_barang: barangBaru.id_barang,
            namaBarang: selectedBarang?.nama_barang || 'Unknown',
            jumlah: barangBaru.jumlah,
            keterangan: barangBaru.keterangan,
          },
        ],
      }));
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validasi form
  if (!formData.nama || !formData.tanggalPinjam || !formData.tanggalKembali) {
    alert('Mohon lengkapi semua field yang wajib diisi!');
    return;
  }

  if (formData.barangDipinjam.length === 0) {
    alert('Mohon tambahkan minimal satu barang untuk dipinjam!');
    return;
  }

  const tglPinjam = new Date(formData.tanggalPinjam);
  const tglKembali = new Date(formData.tanggalKembali);

  if (tglKembali <= tglPinjam) {
    alert('Tanggal kembali harus setelah tanggal peminjaman!');
    return;
  }

  // Format data untuk dikirim ke API - SESUAIKAN DENGAN BACKEND
  const peminjamanData = {
    id_pengguna: 1, // Anda perlu mendapatkan id_pengguna yang benar (misal dari auth/session)
    tanggal_kembali: formData.tanggalKembali,
    detail: formData.barangDipinjam.map((barang) => ({
      id_barang: parseInt(barang.id_barang),
      jumlah_pinjam: parseInt(barang.jumlah), // Ubah 'jumlah' menjadi 'jumlah_pinjam'
      keterangan: barang.keterangan || '',
    })),
  };

  try {
    const response = await fetch('https://pweb-be-production.up.railway.app/peminjaman', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(peminjamanData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Peminjaman berhasil:', result);
    alert('Formulir peminjaman berhasil disubmit!');

    // Reset form
    setFormData({
      nama: '',
      tanggalPinjam: '',
      tanggalKembali: '',
      barangDipinjam: [],
    });
  } catch (err) {
    console.error('Error submitting peminjaman:', err);
    alert(`Terjadi kesalahan: ${err.message}`);
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
          <div className="container mx-auto px-6 py-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#096B68]" />
              <p className="text-lg text-slate-600">Memuat data barang...</p>
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
          <div className="container mx-auto px-6 py-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Terjadi Kesalahan</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#096B68] text-white rounded-lg hover:bg-[#085854] transition-colors"
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
      <style jsx>{`
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
          <div className="py-8 px-6">
            <div className="max-w-4xl mx-auto p-8 form-container shadow-2xl rounded-3xl animate-scale-in animate-pulse-glow">
              <h2 className="text-4xl font-bold text-[#096B68] mb-8 text-center border-b pb-6 animate-slide-in-top">
                <span className="text-[#096B68]">Formulir Peminjaman Barang</span>
              </h2>

              <div className="space-y-8">
                {/* Data Peminjam */}
                <div className="bg-gradient-to-r from-[#90D1CA] to-[#FFFBDE] p-8 rounded-2xl border-l-4 border-[#096B68] shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-200">
                  <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                    👤 <span className="ml-2 text-[#096B68]">Data Peminjam</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Peminjaman *
                      </label>
                      <input
                        type="date"
                        name="tanggalPinjam"
                        value={formData.tanggalPinjam}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Kembali *
                      </label>
                      <input
                        type="date"
                        name="tanggalKembali"
                        value={formData.tanggalKembali}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Tambah Barang */}
                <div className="bg-gradient-to-r from-[#FFFBDE] to-[#90D1CA] p-8 rounded-2xl border-l-4 border-[#096B68] shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-300">
                  <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                    ➕ <span className="ml-2 text-[#096B68]">Tambah Barang</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Barang
                      </label>
                      <select
                        name="id_barang"
                        value={barangBaru.id_barang}
                        onChange={handleBarangChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-teal-400"
                      >
                        <option value="">Pilih Barang</option>
                        {barangTersedia.map((barang) => (
                          <option key={barang.id_barang} value={barang.id_barang}>
                            {barang.nama_barang}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah
                      </label>
                      <input
                        type="number"
                        name="jumlah"
                        value={barangBaru.jumlah}
                        onChange={handleBarangChange}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keterangan
                      </label>
                      <input
                        type="text"
                        name="keterangan"
                        value={barangBaru.keterangan}
                        onChange={handleBarangChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-teal-400"
                        placeholder="Opsional"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={tambahBarang}
                      className="px-6 py-3 bg-[#FFFBDE] text-[#096B68] font-medium rounded-xl hover:bg-[#90D1CA] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-lg"
                    >
                      Tambah
                    </button>
                  </div>
                </div>

                {/* Daftar Barang yang Dipinjam */}
                {formData.barangDipinjam.length > 0 && (
                  <div className="bg-[#FFFBDE] p-8 rounded-2xl border-l-4 border-[#096B68] shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-400">
                    <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                      📦{' '}
                      <span className="ml-2 text-[#096B68]">
                        Barang yang Dipinjam ({formData.barangDipinjam.length} item)
                      </span>
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border-2 border-[#096B68] rounded-2xl overflow-hidden shadow-lg">
                        <thead>
                          <tr className="bg-[#096B68]">
                            <th className="border border-[#096B68] px-6 py-4 text-left font-bold text-white">
                              No
                            </th>
                            <th className="border border-[#096B68] px-6 py-4 text-left font-bold text-white">
                              Nama Barang
                            </th>
                            <th className="border border-[#096B68] px-6 py-4 text-left font-bold text-white">
                              Jumlah
                            </th>
                            <th className="border border-[#096B68] px-6 py-4 text-left font-bold text-white">
                              Keterangan
                            </th>
                            <th className="border border-[#096B68] px-6 py-4 text-left font-bold text-white">
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
                              <td className="border border-[#096B68] px-6 py-4 font-medium">
                                {index + 1}
                              </td>
                              <td className="border border-[#096B68] px-6 py-4 font-bold text-gray-800">
                                {barang.namaBarang}
                              </td>
                              <td className="border border-[#096B68] px-6 py-4">{barang.jumlah}</td>
                              <td className="border border-[#096B68] px-6 py-4 text-gray-600">
                                {barang.keterangan || '-'}
                              </td>
                              <td className="border border-[#096B68] px-6 py-4">
                                <button
                                  type="button"
                                  onClick={() => hapusBarang(barang.id)}
                                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg"
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
                <div className="flex justify-center pt-8 animate-fade-in-up delay-500">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-12 py-4 bg-[#096B68] text-white font-bold text-lg rounded-2xl hover:bg-[#90D1CA] focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 shadow-2xl"
                  >
                    Submit Peminjaman
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loan;