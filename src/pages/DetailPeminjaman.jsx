import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, Clock, CheckCircle, Search, Filter, AudioLines, ShoppingBag, Sparkles, TrendingUp, Activity, RotateCcw, Star, Award, Zap, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import { DateHeader } from '../components/RealTimeDate';
import { TimezoneInfo } from '../components/IndonesiaTimezone';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertModal from '../components/AlertModal';
import { useModal, useAlert, useConfirm } from '../hooks/useModal';
import {
  formatDateToIndonesian,
  formatDateShort,
  getDaysDifference,
  isToday,
  getCurrentDate,
  formatDateTimeIndonesia
} from '../utils/dateUtils';

const DetailPeminjaman = () => {
  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [returningItem, setReturningItem] = useState(null);
  const navigate = useNavigate();

  // Modal hooks
  const alert = useAlert();
  const confirm = useConfirm();

  const fetchRiwayatPeminjaman = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://pweb-be-production.up.railway.app/peminjaman', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 401) {
          // Clear localStorage and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          setError('Sesi tidak valid. Silakan login kembali.');
          navigate('/');
          return;
        }
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debugging
        const mappedData = data.flatMap(peminjaman =>
      peminjaman.detail_peminjaman.map(detail => ({
      id: `${peminjaman.id_peminjaman}-${detail.id_detail}`, // Gabungkan ID peminjaman dan detail
      id_peminjaman: peminjaman.id_peminjaman,
      id_pengguna: peminjaman.id_pengguna,
      namaBarang: detail.barang.nama_barang,
      tanggalPinjam: peminjaman.tanggal_pinjam,
      tanggalKembali: peminjaman.tanggal_kembali,
      status: peminjaman.status || 'dipinjam',
      kategori: detail.barang.kategori || 'Lainnya'
  }))
);
        console.log('Mapped Data:', mappedData); // Debugging
        setRiwayatPeminjaman(mappedData);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error fetching riwayat peminjaman:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchRiwayatPeminjaman();

    // Auto-refresh setiap 5 menit untuk update status real-time
    const interval = setInterval(() => {
      fetchRiwayatPeminjaman();
    }, 5 * 60 * 1000); // 5 menit

    return () => clearInterval(interval);
  }, [navigate]);

  const filteredData = riwayatPeminjaman.filter(item => {
    const matchesSearch = (item.namaBarang || '').toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = false;

    if (filterStatus === 'semua') {
      matchesFilter = true;
    } else if (filterStatus === 'dipinjam') {
      matchesFilter = item.status === 'dipinjam' || item.status === 'aktif';
    } else {
      matchesFilter = item.status === filterStatus;
    }

    return matchesSearch && matchesFilter;
  });

  const formatTanggal = (tanggal) => {
    if (!tanggal) return 'Tanggal tidak valid';
    return formatDateToIndonesian(tanggal, true); // Include timezone
  };

  const formatTanggalWithStatus = (tanggal) => {
    if (!tanggal) return { formatted: 'Tanggal tidak valid', isToday: false };
    return {
      formatted: formatDateToIndonesian(tanggal, true), // Include timezone
      isToday: isToday(tanggal),
      daysFromToday: getDaysDifference(getCurrentDate(), tanggal)
    };
  };

  const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case 'Audio':
        return { icon: AudioLines, color: 'text-[#FFFFFF]', bg: 'bg-[#096B68]' };
      case 'Furniture':
        return { icon: ShoppingBag, color: 'text-[#FFFFFF]', bg: 'bg-[#90D1CA]' };
      case 'Aksesoris':
        return { icon: Sparkles, color: 'text-[#FFFFFF]', bg: 'bg-[#FFD586]' };
      default:
        return { icon: Package, color: 'text-blue-600', bg: 'bg-blue-600' };
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'dikembalikan') {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200 shadow-sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Dikembalikan
        </span>
      );
    } else if (status === 'selesai') {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
          <CheckCircle className="w-4 h-4 mr-2" />
          Selesai
        </span>
      );
    } else if (status === 'aktif' || status === 'dipinjam') {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200 shadow-sm">
          <Clock className="w-4 h-4 mr-2" />
          Dipinjam
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200 shadow-sm">
        <Package className="w-4 h-4 mr-2" />
        {status || 'Unknown'}
      </span>
    );
  };

  const hitungTotalPeminjaman = () => riwayatPeminjaman.length;
  const hitungSedangDipinjam = () => riwayatPeminjaman.filter(item =>
    item.status === 'dipinjam' || item.status === 'aktif'
  ).length;
  const hitungDikembalikan = () => riwayatPeminjaman.filter(item =>
    item.status === 'dikembalikan' || item.status === 'selesai'
  ).length;

  // Fungsi untuk mengembalikan barang
  const handleReturnItem = (item) => {
    confirm.showConfirm(
      'Kembalikan Barang',
      `Apakah Anda yakin ingin mengembalikan "${item.namaBarang}"? Tindakan ini akan mengubah status peminjaman menjadi dikembalikan.`,
      async () => {
        try {
          setReturningItem(item.id);

          // Ambil ID peminjaman dari item.id (format: "id_peminjaman-id_detail")
          const peminjamanId = item.id.split('-')[0];

          console.log('Returning item:', {
            peminjamanId,
            item
          });

          // Ambil data peminjaman lengkap terlebih dahulu
          const getPeminjamanResponse = await fetch(`https://pweb-be-production.up.railway.app/peminjaman`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!getPeminjamanResponse.ok) {
            throw new Error('Gagal mengambil data peminjaman');
          }

          const allPeminjaman = await getPeminjamanResponse.json();
          const currentPeminjaman = allPeminjaman.find(p => p.id_peminjaman === parseInt(peminjamanId));

          if (!currentPeminjaman) {
            throw new Error('Data peminjaman tidak ditemukan');
          }

          console.log('Current peminjaman:', currentPeminjaman);

          // Update status peminjaman menjadi "dikembalikan" dengan data lengkap
          const requestBody = {
            id_pengguna: currentPeminjaman.id_pengguna,
            tanggal_pinjam: currentPeminjaman.tanggal_pinjam,
            tanggal_kembali: currentPeminjaman.tanggal_kembali,
            status: 'dikembalikan'
          };

          console.log('Request body:', requestBody);

          const response = await fetch(`https://pweb-be-production.up.railway.app/peminjaman/${peminjamanId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          console.log('Response status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`Gagal mengembalikan barang: ${response.status} ${errorText}`);
          }

          const responseData = await response.json();
          console.log('Response data:', responseData);

          // Refresh data
          await fetchRiwayatPeminjaman();

          alert.showSuccess(
            'Berhasil!',
            `Barang "${item.namaBarang}" berhasil dikembalikan. Admin akan memproses pengembalian Anda.`
          );
        } catch (err) {
          console.error('Error returning item:', err);
          alert.showError(
            'Gagal!',
            `Terjadi kesalahan saat mengembalikan barang: ${err.message}`
          );
        } finally {
          setReturningItem(null);
        }
      },
      'success'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/fixbg.jpg)', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/90 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#096B68] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-slate-600">Memuat riwayat peminjaman...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/fixbg.jpg)', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/90 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md p-8 bg-white/95 rounded-2xl shadow-xl">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Terjadi Kesalahan</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#096B68] text-white rounded-lg hover:bg-[#085854] transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/fixbg.jpg)', backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/90 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10">
        <style jsx="true">{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

          .milku-font {
            font-family: 'Poppins', 'Inter', sans-serif;
            font-weight: 600;
            letter-spacing: 0.05em;
          }

          .stats-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
            overflow: hidden;
          }

          .stats-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: left 0.5s;
          }

          .stats-card:hover::before {
            left: 100%;
          }

          .stats-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5);
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
          }

          .item-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
            overflow: hidden;
          }

          .item-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s;
          }

          .item-card:hover::before {
            left: 100%;
          }

          .item-card:hover {
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.4);
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
          }

          .fade-in-up {
            animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            opacity: 0;
            transform: translateY(40px);
          }

          .fade-in-up-delay-1 {
            animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
            opacity: 0;
            transform: translateY(40px);
          }

          .fade-in-up-delay-2 {
            animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
            opacity: 0;
            transform: translateY(40px);
          }

          .fade-in-up-delay-3 {
            animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
            opacity: 0;
            transform: translateY(40px);
          }

          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .slide-in-left {
            animation: slideInLeft 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            opacity: 0;
            transform: translateX(-50px);
          }

          .slide-in-right {
            animation: slideInRight 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            opacity: 0;
            transform: translateX(50px);
          }

          @keyframes slideInLeft {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .pulse-dot {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.2);
            }
          }

          .number-counter {
            animation: countUp 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            background: linear-gradient(135deg, #096B68, #90D1CA);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          @keyframes countUp {
            0% {
              transform: translateY(30px) scale(0.8);
              opacity: 0;
            }
            50% {
              transform: translateY(-5px) scale(1.1);
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }

          .floating {
            animation: floating 3s ease-in-out infinite;
          }

          @keyframes floating {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .glow {
            box-shadow: 0 0 20px rgba(9, 107, 104, 0.3);
            animation: glow 2s ease-in-out infinite alternate;
          }

          @keyframes glow {
            from {
              box-shadow: 0 0 20px rgba(9, 107, 104, 0.3);
            }
            to {
              box-shadow: 0 0 30px rgba(9, 107, 104, 0.6), 0 0 40px rgba(144, 209, 202, 0.3);
            }
          }

          .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>

        <div className="backdrop-filter backdrop-blur-lg bg-gradient-to-br from-white/95 via-white/90 to-blue-50/95 shadow-2xl border-b border-white/30">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12">
              <div className="text-center mb-12 fade-in-up">
                <div className="flex justify-center mb-8 floating">
                  <DateHeader className="bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-lg shadow-lg border border-white/30 rounded-2xl" />
                </div>

                {/* Enhanced Title with Gradient */}
                <div className="relative mb-6">
                  <h1 className="milku-font text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#096B68] via-[#90D1CA] to-[#096B68] mb-4 tracking-wider relative">
                    DETAIL PEMINJAMAN
                  </h1>
                  <div className="absolute inset-0 milku-font text-5xl md:text-6xl lg:text-7xl font-black text-slate-200 -z-10 blur-sm">
                    DETAIL PEMINJAMAN
                  </div>
                </div>

                {/* Enhanced Divider */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-1 bg-gradient-to-r from-[#096B68] via-[#90D1CA] to-[#096B68] mx-auto rounded-full glow"></div>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-[#096B68] to-[#90D1CA] rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Enhanced Description */}
                <div className="relative">
                  <p className="text-slate-700 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                    Pantau riwayat peminjaman inventaris Anda dengan mudah dan terorganisir
                  </p>
                  <div className="absolute inset-0 text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed font-medium -z-10 blur-sm">
                    Pantau riwayat peminjaman inventaris Anda dengan mudah dan terorganisir
                  </div>
                </div>

                {/* Enhanced Status Indicator */}
                <div className="flex items-center justify-center mt-6 text-sm text-slate-600 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/40 shadow-lg mx-auto w-fit">
                  <div className="relative mr-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <span className="font-medium">Data terakhir diperbarui: {formatDateTimeIndonesia(lastUpdated, true)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-up-delay-1">
                {/* Total Peminjaman Card */}
                <div className="stats-card rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#096B68]/5 to-[#90D1CA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6 floating">
                      <div className="relative">
                        <div className="p-5 bg-gradient-to-br from-[#096B68] via-[#90D1CA] to-[#096B68] rounded-2xl shadow-2xl glow">
                          <TrendingUp className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                    <div className="number-counter text-5xl font-black mb-3">
                      {hitungTotalPeminjaman()}
                    </div>
                    <div className="text-slate-700 font-bold uppercase tracking-wider text-sm mb-4">
                      Total Peminjaman
                    </div>
                    <div className="flex justify-center">
                      <div className="w-20 h-1.5 bg-gradient-to-r from-[#096B68] to-[#90D1CA] rounded-full shimmer"></div>
                    </div>
                  </div>
                </div>

                {/* Sedang Dipinjam Card */}
                <div className="stats-card rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6 floating" style={{animationDelay: '0.5s'}}>
                      <div className="relative">
                        <div className="p-5 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-2xl shadow-2xl">
                          <Activity className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="number-counter text-5xl font-black mb-3" style={{background: 'linear-gradient(135deg, #f59e0b, #eab308)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                      {hitungSedangDipinjam()}
                    </div>
                    <div className="text-slate-700 font-bold uppercase tracking-wider text-sm mb-4">
                      Sedang Dipinjam
                    </div>
                    <div className="flex justify-center space-x-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full pulse-dot"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full pulse-dot" style={{animationDelay: '0.3s'}}></div>
                      <div className="w-3 h-3 bg-orange-500 rounded-full pulse-dot" style={{animationDelay: '0.6s'}}></div>
                    </div>
                  </div>
                </div>

                {/* Sudah Dikembalikan Card */}
                <div className="stats-card rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6 floating" style={{animationDelay: '1s'}}>
                      <div className="relative">
                        <div className="p-5 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl shadow-2xl">
                          <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <div className="number-counter text-5xl font-black mb-3" style={{background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                      {hitungDikembalikan()}
                    </div>
                    <div className="text-slate-700 font-bold uppercase tracking-wider text-sm mb-4">
                      Sudah Dikembalikan
                    </div>
                    <div className="flex justify-center">
                      <div className="w-20 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10 fade-in-up-delay-2">
            {/* Info Box */}
            <div className="backdrop-filter backdrop-blur-lg bg-blue-50/95 rounded-2xl shadow-xl p-6 border border-blue-200/50 mb-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Informasi Tanggal</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Tanggal yang ditampilkan adalah <strong>tanggal historis</strong> dari database peminjaman.
                    Tanggal peminjaman menunjukkan kapan barang dipinjam (contoh: 8 Juni), bukan tanggal hari ini.
                    Status dan perhitungan hari tersisa menggunakan <strong>waktu real-time</strong> untuk akurasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Timezone Info */}
            <TimezoneInfo className="mb-6" />

            {/* Enhanced Search and Filter */}
            <div className="backdrop-filter backdrop-blur-lg bg-gradient-to-r from-white/95 via-blue-50/90 to-white/95 rounded-3xl shadow-2xl p-8 border border-white/30 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-20 h-20 border-2 border-[#096B68] rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-[#90D1CA] rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-slate-300 rounded-full"></div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Enhanced Search Input */}
                  <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-[#096B68] transition-colors duration-300">
                      <Search className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      placeholder="🔍 Cari nama barang..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#096B68]/20 focus:border-[#096B68] transition-all duration-500 bg-white/90 backdrop-filter backdrop-blur-sm text-lg font-medium placeholder-slate-400 hover:border-slate-300 hover:shadow-lg group-focus-within:bg-white group-focus-within:shadow-xl"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#096B68]/5 to-[#90D1CA]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>

                  {/* Enhanced Filter Select */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-[#096B68] transition-colors duration-300">
                      <Filter className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="pl-14 pr-12 py-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#096B68]/20 focus:border-[#096B68] transition-all duration-500 appearance-none bg-white/90 backdrop-filter backdrop-blur-sm min-w-64 text-lg font-medium hover:border-slate-300 hover:shadow-lg group-focus-within:bg-white group-focus-within:shadow-xl cursor-pointer"
                    >
                      <option value="semua">🌟 Semua Status</option>
                      <option value="dipinjam">⏳ Sedang Dipinjam</option>
                      <option value="dikembalikan">🔄 Sudah Dikembalikan</option>
                      <option value="selesai">✅ Selesai</option>
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-3 h-3 border-r-2 border-b-2 border-slate-400 transform rotate-45 group-focus-within:border-[#096B68] transition-colors duration-300"></div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#096B68]/5 to-[#90D1CA]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </div>

                {/* Search Results Counter */}
                {searchTerm && (
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#096B68]/10 to-[#90D1CA]/10 text-[#096B68] rounded-full text-sm font-semibold border border-[#096B68]/20">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ditemukan {filteredData.length} hasil untuk "{searchTerm}"
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {filteredData.map((item, index) => {
              const categoryInfo = getCategoryIcon(item.kategori);
              const IconComponent = categoryInfo.icon;
              
              return (
                <div
                  key={item.id}
                  className="item-card rounded-3xl shadow-2xl overflow-hidden border border-white/30 relative group"
                  style={{
                    animation: `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s forwards`,
                    opacity: 0,
                    transform: 'translateY(40px)'
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#096B68]/20 via-[#90D1CA]/20 to-[#096B68]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                  {/* Status Indicator Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    item.status === 'dikembalikan' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                    item.status === 'selesai' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}></div>
                  <div className="p-10 relative">
                    {/* Background Decoration */}
                    <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-[#096B68]/10 to-[#90D1CA]/10 rounded-full opacity-50 group-hover:rotate-45 transition-transform duration-700"></div>

                    <div className="relative z-10">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center space-x-6">
                              {/* Enhanced Category Icon */}
                              <div className="relative group/icon">
                                <div className={`p-4 ${categoryInfo.bg} bg-opacity-20 rounded-2xl shadow-xl border border-white/50 group-hover:scale-110 transition-all duration-500`}>
                                  <IconComponent className={`w-10 h-10 ${categoryInfo.color} group-hover/icon:scale-110 transition-transform duration-300`} strokeWidth={2} />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse"></div>
                              </div>

                              {/* Enhanced Item Info */}
                              <div>
                                <h3 className="text-3xl font-black text-slate-800 mb-2 group-hover:text-[#096B68] transition-colors duration-300">
                                  {item.namaBarang}
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Kategori:</span>
                                  <span className={`px-4 py-2 rounded-xl text-sm font-bold ${categoryInfo.bg} bg-opacity-30 ${categoryInfo.color} border-2 border-current border-opacity-40 shadow-lg hover:scale-105 transition-transform duration-300`}>
                                    ✨ {item.kategori}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Enhanced Status Section */}
                            <div className="mt-4 lg:mt-0 flex flex-col items-end space-y-3">
                              <div className="transform hover:scale-105 transition-transform duration-300">
                                {getStatusBadge(item.status)}
                              </div>
                              {item.status === 'dikembalikan' && (
                                <div className="text-sm text-purple-700 bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-2 rounded-xl border-2 border-purple-200 shadow-lg animate-pulse">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                    <span className="font-bold">✅ Menunggu konfirmasi admin</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Enhanced Tanggal Pinjam */}
                            <div className="group/date relative overflow-hidden">
                              <div className="flex items-center space-x-5 p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                                {/* Animated Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50 opacity-0 group-hover/date:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10 flex items-center space-x-5 w-full">
                                  <div className="relative">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover/date:scale-110 group-hover/date:rotate-12 transition-all duration-500">
                                      <Calendar className="w-7 h-7 text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-black text-green-800 uppercase tracking-wider mb-1 flex items-center">
                                      <Star className="w-4 h-4 mr-1" />
                                      Tanggal Pinjam
                                    </p>
                                    <p className="text-xl font-black text-slate-800 group-hover/date:text-green-700 transition-colors duration-300">
                                      {formatTanggal(item.tanggalPinjam)}
                                    </p>
                                    {(() => {
                                      const dateStatus = formatTanggalWithStatus(item.tanggalPinjam);
                                      if (dateStatus.isToday) {
                                        return (
                                          <div className="flex items-center mt-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-2 animate-pulse shadow-lg"></div>
                                            <span className="text-sm text-green-700 font-bold bg-green-100 px-2 py-1 rounded-full">🎯 Hari ini</span>
                                          </div>
                                        );
                                      } else if (dateStatus.daysFromToday < 0) {
                                        return (
                                          <div className="flex items-center mt-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mr-2 shadow-lg"></div>
                                            <span className="text-sm text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded-full">📅 {Math.abs(dateStatus.daysFromToday)} hari yang lalu</span>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Enhanced Tanggal Kembali */}
                            <div className="group/date relative overflow-hidden">
                              <div className="flex items-center space-x-5 p-6 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                                {/* Animated Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-rose-100/50 opacity-0 group-hover/date:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10 flex items-center space-x-5 w-full">
                                  <div className="relative">
                                    <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg group-hover/date:scale-110 group-hover/date:rotate-12 transition-all duration-500">
                                      <Calendar className="w-7 h-7 text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-black text-red-800 uppercase tracking-wider mb-1 flex items-center">
                                      <Award className="w-4 h-4 mr-1" />
                                      Tanggal Kembali
                                    </p>
                                    <p className="text-xl font-black text-slate-800 group-hover/date:text-red-700 transition-colors duration-300">
                                      {formatTanggal(item.tanggalKembali)}
                                    </p>
                                    {(() => {
                                      const dateStatus = formatTanggalWithStatus(item.tanggalKembali);
                                      if (dateStatus.isToday) {
                                        return (
                                          <div className="flex items-center mt-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-rose-500 rounded-full mr-2 animate-pulse shadow-lg"></div>
                                            <span className="text-sm text-red-700 font-bold bg-red-100 px-2 py-1 rounded-full animate-bounce">⚠️ Jatuh tempo hari ini!</span>
                                          </div>
                                        );
                                      } else if (dateStatus.daysFromToday > 0) {
                                        return (
                                          <div className="flex items-center mt-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mr-2 shadow-lg"></div>
                                            <span className="text-sm text-yellow-700 font-bold bg-yellow-100 px-2 py-1 rounded-full">⏰ {dateStatus.daysFromToday} hari lagi</span>
                                          </div>
                                        );
                                      } else if (dateStatus.daysFromToday < 0) {
                                        return (
                                          <div className="flex items-center mt-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-rose-600 rounded-full mr-2 animate-pulse shadow-lg"></div>
                                            <span className="text-sm text-red-800 font-bold bg-red-200 px-2 py-1 rounded-full animate-pulse">🚨 Terlambat {Math.abs(dateStatus.daysFromToday)} hari!</span>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(item.status === 'dipinjam' || item.status === 'aktif') && (
                      <div className="mt-10 pt-8 border-t-2 border-gradient-to-r from-slate-200 via-slate-300 to-slate-200 relative">
                        {/* Enhanced Time Section Header */}
                        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 shadow-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                              <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                              <span className="font-black text-slate-800 text-lg">Waktu Peminjaman</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded-full">⚡ Real-time</span>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Time Remaining */}
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <Zap className="w-5 h-5 text-amber-500" />
                              {(() => {
                                const daysLeft = Math.ceil((new Date(item.tanggalKembali) - new Date()) / (1000 * 60 * 60 * 24));
                                if (daysLeft > 0) {
                                  return (
                                    <span className="font-black text-xl text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border-2 border-amber-200">
                                      🕒 {daysLeft} hari tersisa
                                    </span>
                                  );
                                } else if (daysLeft === 0) {
                                  return (
                                    <span className="font-black text-xl text-red-600 bg-red-50 px-3 py-1 rounded-xl border-2 border-red-200 animate-pulse">
                                      ⚠️ Jatuh tempo hari ini!
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span className="font-black text-xl text-red-700 bg-red-100 px-3 py-1 rounded-xl border-2 border-red-300 animate-bounce">
                                      🚨 Terlambat {Math.abs(daysLeft)} hari!
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Progress Bar */}
                        <div className="relative mb-8">
                          <div className="w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full h-4 shadow-inner border border-slate-300">
                            <div
                              className="bg-gradient-to-r from-[#096B68] via-[#90D1CA] to-[#096B68] h-4 rounded-full transition-all duration-2000 shadow-lg relative overflow-hidden"
                              style={{
                                width: `${Math.max(10, Math.min(90,
                                  ((new Date() - new Date(item.tanggalPinjam)) /
                                  (new Date(item.tanggalKembali) - new Date(item.tanggalPinjam))) * 100
                                ))}%`
                              }}
                            >
                              {/* Shimmer Effect on Progress Bar */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                            </div>
                          </div>

                          {/* Progress Percentage */}
                          <div className="flex justify-center mt-2">
                            <span className="text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-full shadow-md border border-slate-200">
                              {Math.round(Math.max(10, Math.min(90,
                                ((new Date() - new Date(item.tanggalPinjam)) /
                                (new Date(item.tanggalKembali) - new Date(item.tanggalPinjam))) * 100
                              )))}% waktu terlewati
                            </span>
                          </div>
                        </div>

                        {/* Tombol Kembalikan Barang */}
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleReturnItem(item)}
                            disabled={returningItem === item.id}
                            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                          >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>

                            {/* Content */}
                            <div className="relative z-10 flex items-center">
                              {returningItem === item.id ? (
                                <>
                                  <div className="relative mr-3">
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 w-6 h-6 border-3 border-green-200 border-t-transparent rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
                                  </div>
                                  <span className="text-lg font-black tracking-wide">Memproses...</span>
                                </>
                              ) : (
                                <>
                                  <div className="relative mr-3 group-hover:rotate-180 transition-transform duration-500">
                                    <RotateCcw className="w-6 h-6" strokeWidth={2.5} />
                                    <div className="absolute inset-0 w-6 h-6 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                                  </div>
                                  <span className="text-lg font-black tracking-wide group-hover:tracking-wider transition-all duration-300">
                                    Kembalikan Barang
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Floating Particles */}
                            <div className="absolute top-1 left-4 w-1 h-1 bg-white rounded-full opacity-60 group-hover:animate-ping"></div>
                            <div className="absolute bottom-1 right-6 w-1 h-1 bg-white rounded-full opacity-40 group-hover:animate-ping" style={{animationDelay: '0.3s'}}></div>
                            <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full opacity-50 group-hover:animate-ping" style={{animationDelay: '0.6s'}}></div>
                          </button>
                        </div>
                      </div>
                    )}

                    {item.status === 'dikembalikan' && (
                      <div className="mt-10 pt-8 border-t-2 border-gradient-to-r from-purple-200 via-indigo-300 to-purple-200 relative">
                        {/* Enhanced Return Status Section */}
                        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-purple-200 shadow-2xl relative overflow-hidden">
                          {/* Background Decoration */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full translate-y-12 -translate-x-12"></div>

                          <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center justify-center space-x-6 mb-6">
                              <div className="relative">
                                <div className="p-4 bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl">
                                  <RotateCcw className="w-8 h-8 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                                  <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
                                </div>
                              </div>
                              <div className="text-center">
                                <h4 className="text-2xl font-black text-purple-800 mb-2 flex items-center justify-center">
                                  ✅ Barang Sudah Dikembalikan
                                </h4>
                                <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 font-bold rounded-full border-2 border-purple-300 shadow-lg">
                                  🔄 Menunggu konfirmasi dari admin
                                </div>
                              </div>
                            </div>

                            {/* Process Steps */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100 shadow-lg">
                              <div className="space-y-3">
                                <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:scale-105 transition-transform duration-300">
                                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse shadow-lg"></div>
                                  <span className="font-bold text-slate-700">✅ Anda telah mengembalikan barang ini</span>
                                </div>

                                <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 hover:scale-105 transition-transform duration-300">
                                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse shadow-lg" style={{animationDelay: '0.3s'}}></div>
                                  <span className="font-bold text-slate-700">🔄 Admin akan memproses dan mengonfirmasi pengembalian</span>
                                </div>

                                <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:scale-105 transition-transform duration-300">
                                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full animate-pulse shadow-lg" style={{animationDelay: '0.6s'}}></div>
                                  <span className="font-bold text-slate-700">📋 Status akan berubah menjadi "Selesai" setelah dikonfirmasi</span>
                                </div>
                              </div>

                              {/* Estimated Time */}
                              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                                <div className="flex items-center justify-center space-x-2">
                                  <Clock className="w-5 h-5 text-amber-600" />
                                  <span className="font-bold text-amber-700">⏱️ Estimasi proses: 1-2 hari kerja</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-20">
              <div className="backdrop-filter backdrop-blur-lg bg-white/95 rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg">
                  <Package className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Tidak ada riwayat peminjaman</h3>
                <p className="text-slate-600 leading-relaxed">
                  {searchTerm || filterStatus !== 'semua' 
                    ? 'Tidak ada data yang sesuai dengan pencarian atau filter Anda.'
                    : 'Anda belum memiliki riwayat peminjaman peralatan.'}
                </p>
              </div>
            </div>
          )}

          <div className="mt-16 flex justify-center space-x-4">
            <div className="w-2 h-2 bg-[#096B68] rounded-full opacity-60 pulse-dot"></div>
            <div className="w-2 h-2 bg-[#90D1CA] rounded-full opacity-60 pulse-dot" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-[#FFD586] rounded-full opacity-60 pulse-dot" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirm.confirm.isOpen}
        onClose={confirm.hideConfirm}
        onConfirm={confirm.handleConfirm}
        title={confirm.confirm.title}
        message={confirm.confirm.message}
        type={confirm.confirm.type}
        loading={confirm.confirm.loading}
        confirmText="Ya, Kembalikan"
        cancelText="Batal"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.alert.isOpen}
        onClose={alert.hideAlert}
        title={alert.alert.title}
        message={alert.alert.message}
        type={alert.alert.type}
      />
    </div>
  );
};

export default DetailPeminjaman;