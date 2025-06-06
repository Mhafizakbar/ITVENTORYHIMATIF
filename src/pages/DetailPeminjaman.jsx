import React, { useState } from 'react';
import { Calendar, Package, Clock, CheckCircle, XCircle, Search, Filter, AudioLines, ShoppingBag, Sparkles, TrendingUp, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';

const DetailPeminjaman = () => {
  // Data dummy untuk riwayat peminjaman
  const [riwayatPeminjaman] = useState([
    {
      id: 1,
      namaBarang: "Laptop ASUS ROG",
      tanggalPinjam: "2024-05-15",
      tanggalKembali: "2024-05-22",
      status: "dikembalikan",
      kategori: "Furniture"
    },
    {
      id: 2,
      namaBarang: "Microphone",
      tanggalPinjam: "2024-05-20",
      tanggalKembali: "2024-05-25",
      status: "dipinjam",
      kategori: "Audio"
    },
    {
      id: 3,
      namaBarang: "Baterai Mic",
      tanggalPinjam: "2024-05-10",
      tanggalKembali: "2024-05-17",
      status: "dikembalikan",
      kategori: "Aksesoris"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  // Filter data berdasarkan pencarian dan status
  const filteredData = riwayatPeminjaman.filter(item => {
    const matchesSearch = item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'semua' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Function to get category icon
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
    } else {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200 shadow-sm">
          <Clock className="w-4 h-4 mr-2" />
          Dipinjam
        </span>
      );
    }
  };

  const hitungTotalPeminjaman = () => {
    return riwayatPeminjaman.length;
  };

  const hitungSedangDipinjam = () => {
    return riwayatPeminjaman.filter(item => item.status === 'dipinjam').length;
  };

  const hitungDikembalikan = () => {
    return riwayatPeminjaman.filter(item => item.status === 'dikembalikan').length;
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/fixbg.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay untuk memastikan konten tetap terbaca */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/90 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
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

        {/* Header */}
        <div className="backdrop-filter backdrop-blur-lg bg-white/90 shadow-xl border-b border-white/20">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <div className="text-center mb-8 fade-in-up">
                <h1 className="milku-font text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-widest font-bold">
                  DETAIL PEMINJAMAN
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-[#096B68] to-[#90D1CA] mx-auto mb-4"></div>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Pantau riwayat peminjaman inventaris Anda dengan mudah dan terorganisir
                </p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-up-delay-1">
                {/* Total Peminjaman */}
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

                {/* Sedang Dipinjam */}
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

                {/* Sudah Dikembalikan */}
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

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filter */}
          <div className="mb-10 fade-in-up-delay-2">
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

          {/* Riwayat Peminjaman Cards */}
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
                            <div>
                              <p className="text-sm font-semibold text-green-700 uppercase tracking-wider">Tanggal Pinjam</p>
                              <p className="text-lg font-bold text-slate-800">{formatTanggal(item.tanggalPinjam)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <Calendar className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-red-700 uppercase tracking-wider">Tanggal Kembali</p>
                              <p className="text-lg font-bold text-slate-800">{formatTanggal(item.tanggalKembali)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar untuk item yang sedang dipinjam */}
                    {item.status === 'dipinjam' && (
                      <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="flex justify-between items-center text-sm text-slate-600 mb-4">
                          <span className="font-semibold">Waktu Peminjaman</span>
                          <span className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-bold text-amber-600">
                              {Math.ceil((new Date(item.tanggalKembali) - new Date()) / (1000 * 60 * 60 * 24))} hari tersisa
                            </span>
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

          {/* Empty State */}
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

          {/* Bottom decorative elements */}
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