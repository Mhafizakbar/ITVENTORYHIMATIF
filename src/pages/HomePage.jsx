import React, { useState, useEffect } from 'react';
import { AudioLines, ShoppingBag, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

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
    const activePeminjaman = peminjamanData.filter(p => p.status === 'aktif');
    const dipinjamIds = new Set();

    activePeminjaman.forEach(peminjaman => {
      const details = detailData.filter(d => d.id_peminjaman === peminjaman.id_peminjaman);
      details.forEach(detail => {
        dipinjamIds.add(detail.id_barang);
      });
    });

    return Array.from(dipinjamIds);
  };

  // Fungsi untuk mengelompokkan data berdasarkan status
  const groupByStatusAndCategory = () => {
    const grouped = {
      tersedia: { Audio: [], Furniture: [], Aksesoris: [], Lainnya: [] },
      dipinjam: { Audio: [], Furniture: [], Aksesoris: [], Lainnya: [] },
      tidak_tersedia: { Audio: [], Furniture: [], Aksesoris: [], Lainnya: [] }
    };

    const barangDipinjamIds = getBarangDipinjam();

    barangData.forEach(item => {
      const kategoriName = getKategoriName(item.id_kategori);

      // Tentukan status berdasarkan stok dan peminjaman
      let status;
      if (item.jumlah === 0) {
        status = 'tidak_tersedia';
      } else if (barangDipinjamIds.includes(item.id_barang)) {
        status = 'dipinjam';
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
      <style jsx>{`
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
      `}</style>

      <div className="min-h-screen page-background">
        <div className="content-wrapper">
          <Navbar />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#096B68]" />
                <p className="text-lg text-gray-600">Memuat data inventaris...</p>
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
                        <span className="font-medium text-sm sm:text-base">VISITING HOURS</span>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="font-medium text-sm sm:text-base">ADDRESS</span>
                      </div>

                      <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-4 text-xs sm:text-sm flex-wrap">
                        <span>Sat-Sun 12pm-6pm</span>
                        <span className="text-gray-400">|</span>
                        <span>3202 Cherokee St.</span>
                      </div>

                      <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-4 text-xs sm:text-sm flex-wrap">
                        <span>Or by appointment</span>
                        <span className="text-gray-400">|</span>
                        <span>St. Louis, MO 63118</span>
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

                  {/* Expanded Detail Card */}
                  {expandedCard && (
                    <div className="animate-expand bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 pr-2">
                          Detail Barang {expandedCard === 'tersedia' ? 'Tersedia' : expandedCard === 'dipinjam' ? 'Dipinjam' : 'Tidak Tersedia'}
                        </h4>
                        <button
                          onClick={() => setExpandedCard(null)}
                          className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 flex-shrink-0"
                        >
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Category Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {Object.entries(categoryIcons).map(([kategori, IconComponent]) => (
                          <div
                            key={kategori}
                            className={`p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${
                              expandedCard === 'tersedia' ? 'bg-green-50 border-green-200 hover:border-green-300' :
                              expandedCard === 'dipinjam' ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300' :
                              'bg-red-50 border-red-200 hover:border-red-300'
                            }`}
                          >
                            {/* Category Header */}
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                              <div className={`p-2 sm:p-3 rounded-full ${
                                expandedCard === 'tersedia' ? 'bg-green-100' :
                                expandedCard === 'dipinjam' ? 'bg-yellow-100' :
                                'bg-red-100'
                              }`}>
                                <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                                  expandedCard === 'tersedia' ? 'text-green-600' :
                                  expandedCard === 'dipinjam' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`} />
                              </div>
                              <div>
                                <h5 className="text-lg sm:text-xl font-bold text-gray-800">{kategori}</h5>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {groupedData[expandedCard][kategori]?.length || 0} item(s)
                                </p>
                              </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
                              {groupedData[expandedCard][kategori]?.length > 0 ? (
                                groupedData[expandedCard][kategori].map((item) => (
                                  <div
                                    key={item.id_barang}
                                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all duration-200 hover:shadow-md ${
                                      expandedCard === 'tersedia' ? 'bg-white border-green-200 hover:border-green-300' :
                                      expandedCard === 'dipinjam' ? 'bg-white border-yellow-200 hover:border-yellow-300' :
                                      'bg-white border-red-200 hover:border-red-300'
                                    }`}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                                      <div className="flex-1 sm:pr-3">
                                        <h6 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">{item.nama_barang}</h6>
                                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.deskripsi}</p>
                                      </div>
                                      <div className="flex-shrink-0 self-start sm:self-auto">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                                          expandedCard === 'tersedia' ? 'bg-green-100 text-green-700' :
                                          expandedCard === 'dipinjam' ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-red-100 text-red-700'
                                        }`}>
                                          {item.jumlah} unit
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 sm:py-12">
                                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center ${
                                    expandedCard === 'tersedia' ? 'bg-green-100' :
                                    expandedCard === 'dipinjam' ? 'bg-yellow-100' :
                                    'bg-red-100'
                                  }`}>
                                    <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${
                                      expandedCard === 'tersedia' ? 'text-green-400' :
                                      expandedCard === 'dipinjam' ? 'text-yellow-400' :
                                      'text-red-400'
                                    }`} />
                                  </div>
                                  <p className="text-gray-500 font-medium text-sm sm:text-base">Tidak ada barang</p>
                                  <p className="text-gray-400 text-xs sm:text-sm">dalam kategori ini</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
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
