import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, Clock, CheckCircle, Search, Filter, AudioLines, ShoppingBag, Sparkles, TrendingUp, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import { DateHeader } from '../components/RealTimeDate';
import { TimezoneInfo } from '../components/IndonesiaTimezone';
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
  const navigate = useNavigate();

  useEffect(() => {
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
          setError('Sesi tidak valid. Silakan login kembali.');
          navigate('/login');
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

    fetchRiwayatPeminjaman();

    // Auto-refresh setiap 5 menit untuk update status real-time
    const interval = setInterval(() => {
      fetchRiwayatPeminjaman();
    }, 5 * 60 * 1000); // 5 menit

    return () => clearInterval(interval);
  }, [navigate]);

  const filteredData = riwayatPeminjaman.filter(item => {
    const matchesSearch = (item.namaBarang || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'semua' || item.status === filterStatus;
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
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
          <CheckCircle className="w-4 h-4 mr-2" />
          Dikembalikan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200 shadow-sm">
        <Clock className="w-4 h-4 mr-2" />
        Dipinjam
      </span>
    );
  };

  const hitungTotalPeminjaman = () => riwayatPeminjaman.length;
  const hitungSedangDipinjam = () => riwayatPeminjaman.filter(item => item.status === 'dipinjam').length;
  const hitungDikembalikan = () => riwayatPeminjaman.filter(item => item.status === 'dikembalikan').length;

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
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          .milku-font {
            font-family: 'Inter', sans-serif;
            font-weight: 300;
            letter-spacing: 0.1em;
          }
          
          .stats-card {
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            background: rgba(255, 255, 255, 0.98);
          }

          .item-card {
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .item-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
            background: rgba(255, 255, 255, 0.98);
          }

          .fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
            transform: translateY(30px);
          }

          .fade-in-up-delay-1 {
            animation: fadeInUp 0.8s ease-out 0.2s forwards;
            opacity: 0;
            transform: translateY(30px);
          }

          .fade-in-up-delay-2 {
            animation: fadeInUp 0.8s ease-out 0.4s forwards;
            opacity: 0;
            transform: translateY(30px);
          }

          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .pulse-dot {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          .number-counter {
            animation: countUp 1.5s ease-out forwards;
          }

          @keyframes countUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>

        <div className="backdrop-filter backdrop-blur-lg bg-white/90 shadow-xl border-b border-white/20">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <div className="text-center mb-8 fade-in-up">
                <div className="flex justify-center mb-6">
                  <DateHeader className="bg-white/90 backdrop-blur-lg" />
                </div>
                <h1 className="milku-font text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-widest">
                  DETAIL PEMINJAMAN
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-[#096B68] to-[#90D1CA] mx-auto mb-4"></div>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Pantau riwayat peminjaman inventaris Anda dengan mudah dan terorganisir
                </p>
                <div className="flex items-center justify-center mt-4 text-sm text-slate-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span>Data terakhir diperbarui: {formatDateTimeIndonesia(lastUpdated, true)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-up-delay-1">
                <div className="stats-card rounded-2xl p-8 text-center shadow-lg">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-[#096B68] to-[#90D1CA] rounded-full shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="number-counter text-4xl font-bold text-[#096B68] mb-2">
                    {hitungTotalPeminjaman()}
                  </div>
                  <div className="text-slate-600 font-medium uppercase tracking-wider text-sm">
                    Total Peminjaman
                  </div>
                  <div className="mt-4 w-16 h-1 bg-gradient-to-r from-[#096B68] to-[#90D1CA] mx-auto rounded-full"></div>
                </div>

                <div className="stats-card rounded-2xl p-8 text-center shadow-lg">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full shadow-lg">
                      <Activity className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="number-counter text-4xl font-bold text-amber-600 mb-2">
                    {hitungSedangDipinjam()}
                  </div>
                  <div className="text-slate-600 font-medium uppercase tracking-wider text-sm">
                    Sedang Dipinjam
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full pulse-dot"></div>
                  </div>
                </div>

                <div className="stats-card rounded-2xl p-8 text-center shadow-lg">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="number-counter text-4xl font-bold text-green-600 mb-2">
                    {hitungDikembalikan()}
                  </div>
                  <div className="text-slate-600 font-medium uppercase tracking-wider text-sm">
                    Sudah Dikembalikan
                  </div>
                  <div className="mt-4 w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
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

            {/* Search and Filter */}
            <div className="backdrop-filter backdrop-blur-lg bg-white/95 rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari nama barang..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#096B68] focus:border-[#096B68] transition-all duration-300 bg-white/80 backdrop-filter backdrop-blur-sm"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-12 pr-10 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#096B68] focus:border-[#096B68] transition-all duration-300 appearance-none bg-white/80 backdrop-filter backdrop-blur-sm min-w-48"
                  >
                    <option value="semua">Semua Status</option>
                    <option value="dipinjam">Sedang Dipinjam</option>
                    <option value="dikembalikan">Sudah Dikembalikan</option>
                  </select>
                </div>
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
                  className="item-card rounded-2xl shadow-xl overflow-hidden border border-white/20"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                    opacity: 0,
                    transform: 'translateY(30px)'
                  }}
                >
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 ${categoryInfo.bg} bg-opacity-20 rounded-xl shadow-lg`}>
                              <IconComponent className={`w-8 h-8 ${categoryInfo.color}`} strokeWidth={1.5} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-800 mb-1">{item.namaBarang}</h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-slate-600">Kategori:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryInfo.bg} bg-opacity-20 ${categoryInfo.color} border border-current border-opacity-30`}>
                                  {item.kategori}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 lg:mt-0">
                            {getStatusBadge(item.status)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-green-700 uppercase tracking-wider">Tanggal Pinjam</p>
                              <p className="text-lg font-bold text-slate-800">{formatTanggal(item.tanggalPinjam)}</p>
                              {(() => {
                                const dateStatus = formatTanggalWithStatus(item.tanggalPinjam);
                                if (dateStatus.isToday) {
                                  return (
                                    <div className="flex items-center mt-1">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                      <span className="text-xs text-green-600 font-medium">Hari ini</span>
                                    </div>
                                  );
                                } else if (dateStatus.daysFromToday < 0) {
                                  return (
                                    <div className="flex items-center mt-1">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                      <span className="text-xs text-blue-600 font-medium">{Math.abs(dateStatus.daysFromToday)} hari yang lalu</span>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <Calendar className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-red-700 uppercase tracking-wider">Tanggal Kembali</p>
                              <p className="text-lg font-bold text-slate-800">{formatTanggal(item.tanggalKembali)}</p>
                              {(() => {
                                const dateStatus = formatTanggalWithStatus(item.tanggalKembali);
                                if (dateStatus.isToday) {
                                  return (
                                    <div className="flex items-center mt-1">
                                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                                      <span className="text-xs text-red-600 font-medium">Jatuh tempo hari ini!</span>
                                    </div>
                                  );
                                } else if (dateStatus.daysFromToday > 0) {
                                  return (
                                    <div className="flex items-center mt-1">
                                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                      <span className="text-xs text-yellow-600 font-medium">{dateStatus.daysFromToday} hari lagi</span>
                                    </div>
                                  );
                                } else if (dateStatus.daysFromToday < 0) {
                                  return (
                                    <div className="flex items-center mt-1">
                                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                                      <span className="text-xs text-red-600 font-medium">Terlambat {Math.abs(dateStatus.daysFromToday)} hari!</span>
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
                    
                    {item.status === 'dipinjam' && (
                      <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="flex justify-between items-center text-sm text-slate-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">Waktu Peminjaman</span>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-blue-600 font-medium">Real-time</span>
                          </div>
                          <span className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            {(() => {
                              const daysLeft = Math.ceil((new Date(item.tanggalKembali) - new Date()) / (1000 * 60 * 60 * 24));
                              if (daysLeft > 0) {
                                return (
                                  <span className="font-bold text-amber-600">
                                    {daysLeft} hari tersisa
                                  </span>
                                );
                              } else if (daysLeft === 0) {
                                return (
                                  <span className="font-bold text-red-600 animate-pulse">
                                    Jatuh tempo hari ini!
                                  </span>
                                );
                              } else {
                                return (
                                  <span className="font-bold text-red-600 animate-pulse">
                                    Terlambat {Math.abs(daysLeft)} hari!
                                  </span>
                                );
                              }
                            })()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-[#096B68] to-[#90D1CA] h-3 rounded-full transition-all duration-1000 shadow-sm"
                            style={{
                              width: `${Math.max(10, Math.min(90, 
                                ((new Date() - new Date(item.tanggalPinjam)) / 
                                (new Date(item.tanggalKembali) - new Date(item.tanggalPinjam))) * 100
                              ))}%`
                            }}
                          ></div>
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
    </div>
  );
};

export default DetailPeminjaman;