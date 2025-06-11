import React, { useState, useEffect } from 'react';
import { AudioLines, ShoppingBag, Sparkles, Loader2, AlertCircle, X, Package, Calendar, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { formatDateToIndonesian, formatDateShort } from '../utils/dateUtils';

const HomePage = () => {
  // State untuk mengontrol expand/collapse
  const [expandedCard, setExpandedCard] = useState(null);

  // State untuk data dari API
  const [barangData, setBarangData] = useState([]);
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [kategoriData, setKategoriData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari API
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [barangRes, peminjamanRes, detailRes, kategoriRes] = await Promise.all([
        fetch('https://pweb-be-production.up.railway.app/barang', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://pweb-be-production.up.railway.app/peminjaman', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://pweb-be-production.up.railway.app/detail', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://pweb-be-production.up.railway.app/kategori', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      const barang = barangRes.ok ? await barangRes.json() : [];
      const peminjaman = peminjamanRes.ok ? await peminjamanRes.json() : [];
      const detail = detailRes.ok ? await detailRes.json() : [];
      const kategori = kategoriRes.ok ? await kategoriRes.json() : [];

      setBarangData(Array.isArray(barang) ? barang : []);
      setPeminjamanData(Array.isArray(peminjaman) ? peminjaman : []);
      setDetailData(Array.isArray(detail) ? detail : []);
      setKategoriData(Array.isArray(kategori) ? kategori : []);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data. Menggunakan data demo.');

      // Fallback ke data demo sederhana jika API gagal
      setBarangData([
        { id_barang: 1, nama_barang: "Demo Item 1", id_kategori: 1, jumlah: 5, deskripsi: "Demo item" },
        { id_barang: 2, nama_barang: "Demo Item 2", id_kategori: 2, jumlah: 0, deskripsi: "Demo item" }
      ]);
      setKategoriData([
        { id_kategori: 1, nama_kategori: "Audio" },
        { id_kategori: 2, nama_kategori: "Furniture" },
        { id_kategori: 3, nama_kategori: "Aksesoris" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mendapatkan nama kategori
  const getKategoriName = (id_kategori) => {
    const kategori = kategoriData.find(k => k.id_kategori === id_kategori);
    return kategori ? kategori.nama_kategori : 'Lainnya';
  };

  // Fungsi untuk menghitung barang yang sedang dipinjam
  const getBarangDipinjam = () => {
    // Filter peminjaman yang aktif (sedang dipinjam)
    const activePeminjaman = peminjamanData.filter(p =>
      p.status === 'aktif' || p.status === 'dipinjam' || p.status === 'dikembalikan'
    );

    const dipinjamData = [];

    activePeminjaman.forEach(peminjaman => {
      const details = detailData.filter(d => d.id_peminjaman === peminjaman.id_peminjaman);
      details.forEach(detail => {
        // Cari data barang lengkap
        const barangInfo = barangData.find(b => b.id_barang === detail.id_barang);
        if (barangInfo) {
          dipinjamData.push({
            ...barangInfo,
            jumlah_dipinjam: detail.jumlah_pinjam,
            tanggal_pinjam: peminjaman.tanggal_pinjam,
            tanggal_kembali: peminjaman.tanggal_kembali,
            status_peminjaman: peminjaman.status,
            id_peminjaman: peminjaman.id_peminjaman,
            id_detail: detail.id_detail
          });
        }
      });
    });

    return dipinjamData;
  };

  // Fungsi untuk mengelompokkan data berdasarkan status
  const groupByStatusAndCategory = () => {
    const grouped = {
      tersedia: { Audio: [], Furniture: [], Aksesoris: [], Lainnya: [] },
      dipinjam: { Audio: [], Furniture: [], Aksesoris: [], Lainnya: [] },
      tidak_tersedia: { Audio: [], Furniture: [], Aksesoris: [], Lainnya: [] }
    };

    const barangDipinjamData = getBarangDipinjam();
    const barangDipinjamIds = barangDipinjamData.map(item => item.id_barang);

    // Proses barang yang sedang dipinjam
    barangDipinjamData.forEach(item => {
      const kategoriName = getKategoriName(item.id_kategori);

      if (!grouped.dipinjam[kategoriName]) {
        grouped.dipinjam[kategoriName] = [];
      }

      grouped.dipinjam[kategoriName].push({
        ...item,
        kategori: { nama_kategori: kategoriName },
        status: 'dipinjam',
        // Tampilkan jumlah yang dipinjam, bukan stok total
        jumlah: item.jumlah_dipinjam,
        deskripsi: `${item.deskripsi || 'Tidak ada deskripsi'} (Dipinjam: ${item.jumlah_dipinjam} unit)`
      });
    });

    // Proses barang lainnya (tersedia dan tidak tersedia)
    barangData.forEach(item => {
      const kategoriName = getKategoriName(item.id_kategori);

      // Skip jika barang sedang dipinjam (sudah diproses di atas)
      if (barangDipinjamIds.includes(item.id_barang)) {
        return;
      }

      // Tentukan status berdasarkan stok
      let status;
      if (item.jumlah === 0) {
        status = 'tidak_tersedia';
      } else {
        status = 'tersedia';
      }

      // Pastikan kategori ada di grouped object
      if (!grouped[status][kategoriName]) {
        grouped[status][kategoriName] = [];
      }

      grouped[status][kategoriName].push({
        ...item,
        kategori: { nama_kategori: kategoriName },
        status: status
      });
    });

    return grouped;
  };

  // Background image URL - Ganti dengan nama file gambar Anda di folder public
  const backgroundImage = "fixbg.jpg";

  const groupedData = groupByStatusAndCategory();

  const categoryIcons = {
    Audio: AudioLines,
    Furniture: ShoppingBag,
    Aksesoris: Sparkles,
    Lainnya: Sparkles
  };

  // Fungsi untuk menghitung total barang per status
  const getTotalByStatus = (status) => {
    return Object.values(groupedData[status]).reduce((total, items) => total + items.length, 0);
  };

  // Fungsi untuk toggle expand card
  const toggleCard = (cardType) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  return (
    <>
      <style jsx="true">{`
        /* Background styles */
        .page-background {
          background-image: url('${backgroundImage}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          position: relative;
        }
        
        .page-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(1px);
          z-index: 1;
        }
        
        .content-wrapper {
          position: relative;
          z-index: 2;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes expand {
          from {
            opacity: 0;
            transform: scale(0.95);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: scale(1);
            max-height: 500px;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-expand {
          animation: expand 0.5s ease-out both;
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

        .delay-500 {
          animation-delay: 0.5s;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="min-h-screen page-background">
        <div className="content-wrapper">
          <Navbar />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/30">
                <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-[#096B68]" />
                <p className="text-lg text-gray-600 font-medium">Memuat data inventaris...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!loading && (
            <div className="px-4 sm:px-6 py-8 sm:py-12">
              {/* Hero Section */}
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
                  {/* Left Content */}
                  <div className="space-y-6 lg:space-y-8 animate-fade-in-up text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                      Peminjaman
                      <br />
                      <span className="text-[#90D1CA]">Inventaris</span>
                      <br />
                      HIMATIF
                    </h1>

                    <div className="space-y-3 lg:space-y-4 text-gray-600">
                      <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-4 flex-wrap">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="font-medium text-sm sm:text-base">HIMATIF</span>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="font-medium text-sm sm:text-base">UIN SUSKA RIAU</span>
                      </div>

                      <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-4 text-xs sm:text-sm flex-wrap">
                        <span>Sekretariat HIMATIF, Gedung Baru FST, Lt 2, pekanbaru</span>
                        <span className="text-gray-400">|</span>
                        <span>📞+62821-7086-3236</span>
                      </div>

                      <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-4 text-xs sm:text-sm flex-wrap">
                        <span>Itventaris</span>
                        <span className="text-gray-400">|</span>
                        <span>Himatif. © 2025</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex justify-center lg:justify-end order-first lg:order-last">
                    <div className="relative animate-float">
                      <div className="absolute inset-0 w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full transform rotate-12 animate-pulse-slow"></div>
                      <div className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                        <img
                          src="inv.jpg"
                          alt="Inventaris"
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 bg-[#096B68] rounded-full animate-bounce delay-300"></div>
                      <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 w-4 h-4 sm:w-6 sm:h-6 bg-[#90D1CA] rounded-full animate-bounce delay-500"></div>
                    </div>
                  </div>
                </div>

                {/* Action Cards Container */}
                <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                  {/* Main Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Barang Tersedia Card */}
                    <div
                      className="group bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-100 cursor-pointer"
                      onClick={() => toggleCard('tersedia')}
                    >
                      <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-green-200 transition-colors duration-300 mx-auto sm:mx-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-green-400 rounded-full animate-pulse flex items-center justify-center">
                          <span className="text-white font-bold text-xs sm:text-sm">✓</span>
                        </div>
                      </div>
                      <h3 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-center sm:text-left">
                        Barang Tersedia
                        <span className="block text-base sm:text-lg font-normal text-green-600 mt-1">
                          {getTotalByStatus('tersedia')} item
                        </span>
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-base sm:text-lg mb-4 sm:mb-6 text-center sm:text-left">
                        Barang yang tersedia untuk dipinjam
                      </p>

                      {/* Expand indicator */}
                      <div className="mt-4 sm:mt-6 flex items-center justify-center">
                        <div className={`transform transition-transform duration-300 ${expandedCard === 'tersedia' ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                      </div>
                    </div>

                    {/* Barang Dipinjam Card */}
                    <div
                      className="group bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-200 cursor-pointer"
                      onClick={() => toggleCard('dipinjam')}
                    >
                      <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-yellow-200 transition-colors duration-300 mx-auto sm:mx-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
                          <span className="text-white font-bold text-xs sm:text-sm">⏳</span>
                        </div>
                      </div>
                      <h3 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-center sm:text-left">
                        Sedang Dipinjam
                        <span className="block text-base sm:text-lg font-normal text-yellow-600 mt-1">
                          {getTotalByStatus('dipinjam')} item
                        </span>
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-base sm:text-lg mb-4 sm:mb-6 text-center sm:text-left">
                        Barang yang sedang dalam masa peminjaman
                      </p>

                      {/* Expand indicator */}
                      <div className="mt-4 sm:mt-6 flex items-center justify-center">
                        <div className={`transform transition-transform duration-300 ${expandedCard === 'dipinjam' ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                      </div>
                    </div>

                    {/* Barang Tidak Tersedia Card */}
                    <div
                      className="group bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-300 cursor-pointer"
                      onClick={() => toggleCard('tidak_tersedia')}
                    >
                      <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-red-200 transition-colors duration-300 mx-auto sm:mx-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-red-400 rounded-full animate-pulse flex items-center justify-center">
                          <span className="text-white font-bold text-xs sm:text-sm">✗</span>
                        </div>
                      </div>
                      <h3 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-center sm:text-left">
                        Tidak Tersedia
                        <span className="block text-base sm:text-lg font-normal text-red-600 mt-1">
                          {getTotalByStatus('tidak_tersedia')} item
                        </span>
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-base sm:text-lg mb-4 sm:mb-6 text-center sm:text-left">
                        Barang yang stoknya habis (0)
                      </p>

                      {/* Expand indicator */}
                      <div className="mt-4 sm:mt-6 flex items-center justify-center">
                        <div className={`transform transition-transform duration-300 ${expandedCard === 'tidak_tersedia' ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Detail Barang */}
                  {expandedCard && (
                    <div className="fixed inset-0 z-50 p-4 animate-fade-in-up">
                      {/* Background with same image as main page */}
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${backgroundImage})`, backgroundAttachment: 'fixed' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"></div>
                      </div>

                      {/* Modal Container */}
                      <div className="relative flex items-center justify-center min-h-full">
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/40 animate-slide-up">
                          {/* Modal Header */}
                          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-lg">
                            <h2 className="text-2xl font-bold text-gray-900">
                              Detail Barang {expandedCard === 'tersedia' ? 'Tersedia' : expandedCard === 'dipinjam' ? 'Dipinjam' : 'Tidak Tersedia'}
                            </h2>
                            <button
                              onClick={() => setExpandedCard(null)}
                              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 hover:bg-white/70 rounded-full backdrop-blur-sm"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>

                          {/* Modal Content */}
                          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-br from-white/90 via-white/85 to-gray-50/90 backdrop-blur-lg">
                            {/* Category Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {Object.entries(categoryIcons).map(([kategori, IconComponent]) => {
                              const items = groupedData[expandedCard][kategori] || [];
                              const categoryColors = {
                                Audio: {
                                  bg: 'bg-gradient-to-br from-green-50 to-green-100',
                                  border: 'border-green-200',
                                  icon: 'text-green-600',
                                  text: 'text-green-700',
                                  iconBg: 'bg-green-100'
                                },
                                Furniture: {
                                  bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
                                  border: 'border-blue-200',
                                  icon: 'text-blue-600',
                                  text: 'text-blue-700',
                                  iconBg: 'bg-blue-100'
                                },
                                Aksesoris: {
                                  bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
                                  border: 'border-purple-200',
                                  icon: 'text-purple-600',
                                  text: 'text-purple-700',
                                  iconBg: 'bg-purple-100'
                                },
                                Lainnya: {
                                  bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
                                  border: 'border-gray-200',
                                  icon: 'text-gray-600',
                                  text: 'text-gray-700',
                                  iconBg: 'bg-gray-100'
                                }
                              };
                              const colors = categoryColors[kategori] || categoryColors.Lainnya;

                              return (
                                <div
                                  key={kategori}
                                  className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-lg bg-opacity-95 relative overflow-hidden`}
                                >
                                  {/* Background Pattern */}
                                  <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                                  </div>

                                  {/* Content */}
                                  <div className="relative z-10">
                                  {/* Category Header */}
                                  <div className="flex items-center space-x-3 mb-6">
                                    <div className={`p-3 ${colors.iconBg} rounded-xl shadow-sm border ${colors.border}`}>
                                      <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                                    </div>
                                    <div>
                                      <h3 className={`text-xl font-bold ${colors.text}`}>{kategori}</h3>
                                      <p className="text-sm text-gray-600">{items.length} item(s)</p>
                                    </div>
                                  </div>

                                  {/* Items List */}
                                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                                    {items.length > 0 ? (
                                      items.map((item, index) => (
                                        <div
                                          key={item.id_barang}
                                          className="bg-white/95 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/70 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 shadow-sm"
                                          style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-3">
                                              <h4 className="font-semibold text-gray-800 text-base mb-1">{item.nama_barang}</h4>
                                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2">
                                                {expandedCard === 'dipinjam' ?
                                                  (item.deskripsi?.replace(/\(Dipinjam:.*\)/, '') || 'Tidak ada deskripsi') :
                                                  (item.deskripsi || 'Tidak ada deskripsi')
                                                }
                                              </p>

                                              {/* Tampilkan info tanggal untuk barang dipinjam */}
                                              {expandedCard === 'dipinjam' && item.tanggal_pinjam && (
                                                <div className="flex flex-col space-y-1 text-xs text-gray-500">
                                                  <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>Dipinjam: {formatDateShort(item.tanggal_pinjam, true)}</span>
                                                  </div>
                                                  {item.tanggal_kembali && (
                                                    <div className="flex items-center space-x-1">
                                                      <Clock className="w-3 h-3" />
                                                      <span>Kembali: {formatDateShort(item.tanggal_kembali, true)}</span>
                                                    </div>
                                                  )}
                                                  <div className="flex items-center space-x-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                      item.status_peminjaman === 'dikembalikan' ? 'bg-purple-100 text-purple-700' :
                                                      item.status_peminjaman === 'aktif' || item.status_peminjaman === 'dipinjam' ? 'bg-yellow-100 text-yellow-700' :
                                                      'bg-gray-100 text-gray-700'
                                                    }`}>
                                                      Status: {item.status_peminjaman || 'dipinjam'}
                                                    </span>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex-shrink-0">
                                              <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${colors.text} ${colors.iconBg} border ${colors.border} shadow-sm`}>
                                                {item.jumlah} unit
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-12 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
                                        <div className="relative z-10">
                                          <div className={`w-16 h-16 mx-auto mb-4 ${colors.iconBg} rounded-full flex items-center justify-center shadow-lg border-2 ${colors.border} backdrop-blur-sm`}>
                                            <IconComponent className={`w-8 h-8 ${colors.icon}`} />
                                          </div>
                                          <p className="text-gray-600 font-semibold text-base mb-1">Tidak ada barang</p>
                                          <p className="text-gray-500 text-sm">dalam kategori ini</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  </div>
                                </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
