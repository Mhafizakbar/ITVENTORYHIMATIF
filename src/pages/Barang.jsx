import React, { useState, useEffect } from 'react';
import { AudioLines, ShoppingBag, Sparkles, ChevronDown, Package } from 'lucide-react';
import Navbar from '../components/Navbar';

const Barang = () => {
  const [itemsData, setItemsData] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kategori statis
 

  // Fungsi untuk mengambil data dari API
    useEffect(() => {
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://pweb-be-production.up.railway.app/barang', {
        method: 'GET',
        credentials: 'include', // sangat penting untuk cookie
       
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Autentikasi gagal: Token tidak valid atau kedaluwarsa.');
        }
        throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setItemsData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data.');
      setLoading(false);
    }
  };

  fetchItems();
}, []);


  const handleCategoryClick = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const getItemsByCategory = (categoryId) => {
    return itemsData.filter(item => item.id_kategori === categoryId);
  };

  const getQuantityColor = (jumlah) => {
    if (jumlah === 0) return 'text-red-700 bg-red-100 border-red-200';
    if (jumlah <= 5) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    return 'text-green-700 bg-green-100 border-green-200';
  };

  const expandedCategoryData = expandedCategory ? categories.find(cat => cat.id === expandedCategory) : null;
  const expandedCategoryItems = expandedCategory ? getItemsByCategory(expandedCategory) : [];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/fixbg.jpg)',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/90 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          .milku-font {
            font-family: 'Inter', sans-serif;
            font-weight: 300;
            letter-spacing: 0.1em;
          }
          
          .category-card {
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .category-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            background: rgba(255, 255, 255, 0.98);
          }
          
          .category-image {
            transition: all 0.3s ease;
          }
          
          .category-card:hover .category-image {
            transform: scale(1.05);
          }

          .image-overlay {
            transition: all 0.3s ease;
          }
          
          .category-card:hover .image-overlay {
            opacity: 0.8;
          }

          .icon-overlay {
            transition: all 0.3s ease;
          }
          
          .category-card:hover .icon-overlay {
            transform: scale(1.1);
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

          .fade-in-up-delay-3 {
            animation: fadeInUp 0.8s ease-out 0.6s forwards;
            opacity: 0;
            transform: translateY(30px);
          }

          .slide-in-left {
            animation: slideInLeft 0.8s ease-out forwards;
            opacity: 0;
            transform: translateX(-50px);
          }

          .slide-in-right {
            animation: slideInRight 0.8s ease-out forwards;
            opacity: 0;
            transform: translateX(50px);
          }

          .scale-in {
            animation: scaleIn 0.6s ease-out forwards;
            opacity: 0;
            transform: scale(0.8);
          }

          .bounce-in {
            animation: bounceIn 1s ease-out forwards;
            opacity: 0;
            transform: scale(0.3);
          }

          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
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

          @keyframes scaleIn {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .item-slide-in {
            animation: itemSlideIn 0.5s ease-out forwards;
            opacity: 0;
            transform: translateY(-20px);
          }

          @keyframes itemSlideIn {
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

          .header-overlay {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .expanded-card {
            transition: all 0.5s ease-in-out;
          }

          .expanded-card.show {
            animation: expandCard 0.5s ease-out forwards;
          }

          @keyframes expandCard {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .category-card:hover .category-card-hover {
            opacity: 1;
          }
        `}</style>

        <Navbar />

        <div className="container mx-auto px-6 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="milku-font text-5xl md:text-6xl font-light text-slate-800 mb-6 tracking-widest fade-in-up font-bold">
              K A T E G O R I
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-800 mx-auto mb-8 scale-in"></div>
            <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed fade-in-up-delay-1">
              Temukan dan pinjam inventaris sesuai kebutuhan kegiatanmu di ITVENTORY!
              Inventaris dikelompokkan berdasarkan jenis untuk memudahkan pencarian dan mendukung kegiatan seperti rapat, acara, dan operasional harian.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-t-transparent border-emerald-500 rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Memuat data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Categories Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-8">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const animationClass = index === 0 ? 'slide-in-left' : index === 2 ? 'slide-in-right' : 'fade-in-up-delay-2';
                const categoryItems = getItemsByCategory(category.id);
                const isExpanded = expandedCategory === category.id;

                return (
                  <div key={category.id} className="w-full">
                    <div
                      className={`category-card cursor-pointer rounded-3xl p-6 ${animationClass} ${
                        isExpanded ? 'ring-4 ring-opacity-50 ' + (category.id === 1 ? 'ring-emerald-300' : category.id === 2 ? 'ring-teal-300' : 'ring-yellow-300') : ''
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {/* Circular Image Container */}
                      <div className="relative mb-6">
                        <div className={`w-64 h-64 mx-auto rounded-full ${category.bgColor} p-1 shadow-2xl`}>
                          <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                            <div
                              className="category-image w-full h-full bg-cover bg-center rounded-full bg-gray-200"
                              style={{ backgroundImage: `url(${category.image})` }} // Perbaikan: Tambahkan gambar kategori
                            >
                              <div className="image-overlay absolute inset-0 bg-white bg-opacity-70 rounded-full flex items-center justify-center">
                                <div className="icon-overlay">
                                  <IconComponent
                                    size={80}
                                    className={`${category.iconColor} drop-shadow-lg`}
                                    strokeWidth={1.5}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`absolute -top-2 -right-2 w-6 h-6 ${category.bgColor} rounded-full opacity-60 bounce-in`} style={{ animationDelay: `${0.8 + index * 0.2}s` }}></div>
                        <div className={`absolute -bottom-4 -left-4 w-4 h-4 ${category.bgColor} rounded-full opacity-40 bounce-in`} style={{ animationDelay: `${1.0 + index * 0.2}s` }}></div>
                      </div>

                      <div className="text-center px-4">
                        <h3 className="milku-font text-2xl md:text-3xl font-medium text-slate-800 mb-4 tracking-wide">
                          {category.name}
                        </h3>
                        <p className="text-slate-600 text-base leading-relaxed mb-4">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-center mb-4">
                          <Package className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-600 text-sm">
                            {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-center mt-4">
                          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                            <ChevronDown className="w-6 h-6 text-slate-500" />
                          </div>
                        </div>
                        <div className="mt-2 opacity-0 category-card-hover transition-opacity duration-300">
                          <div className={`w-12 h-0.5 ${category.bgColor} mx-auto`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Expanded Items Card */}
          {!loading && !error && expandedCategory && (
            <div className={`expanded-card show w-full mt-8`}>
              <div
                className={`rounded-2xl p-8 shadow-2xl border-l-8 ${
                  expandedCategoryData.id === 1
                    ? 'border-[#096B68] bg-gradient-to-r from-emerald-50 via-white to-emerald-50'
                    : expandedCategoryData.id === 2
                    ? 'border-[#90D1CA] bg-gradient-to-r from-teal-50 via-white to-teal-50'
                    : 'border-[#FFD586] bg-gradient-to-r from-yellow-50 via-white to-yellow-50'
                } backdrop-filter backdrop-blur-sm bg-opacity-95`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${expandedCategoryData.bgColor} bg-opacity-20`}>
                      <expandedCategoryData.icon className={`w-8 h-8 ${expandedCategoryData.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="text-3xl font-bold text-slate-800">
                        Produk {expandedCategoryData.name}
                      </h4>
                      <p className="text-slate-600 text-lg">
                        {expandedCategoryItems.length} item tersedia
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedCategory(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-all duration-200"
                  >
                    <ChevronDown className="w-6 h-6 text-slate-600 rotate-180" />
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {expandedCategoryItems.map((item, itemIndex) => (
                    <div
                      key={item.id_barang}
                      className="bg-white rounded-xl p-6 shadow-lg border border-white border-opacity-50 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.02] item-slide-in"
                      style={{ animationDelay: `${itemIndex * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1 pr-6">
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="text-xl font-bold text-slate-800 leading-tight">
                              {item.nama_barang}
                            </h5>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ml-4 whitespace-nowrap border ${getQuantityColor(item.jumlah)}`}>
                              {item.jumlah > 0 ? `${item.jumlah} tersedia` : 'Habis'}
                            </div>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed">
                            {item.deskripsi}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 flex-shrink-0">
                          <div
                            className={`text-center rounded-lg p-4 shadow-lg border-2 min-w-[80px] ${
                              expandedCategoryData.id === 1
                                ? 'bg-emerald-50 border-emerald-200'
                                : expandedCategoryData.id === 2
                                ? 'bg-teal-50 border-teal-200'
                                : 'bg-yellow-50 border-yellow-200'
                            }`}
                          >
                            <div className="text-3xl font-black text-slate-800">
                              {item.jumlah}
                            </div>
                            <div className="text-xs text-slate-600 uppercase tracking-wider font-semibold">
                              UNIT
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full transition-all duration-200 shadow-lg flex-shrink-0 ${
                              item.jumlah > 0 ? (item.jumlah <= 5 ? 'bg-yellow-500' : 'bg-green-500 pulse-dot') : 'bg-red-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {expandedCategoryItems.length === 0 && (
                  <div className="text-center py-16 text-slate-500">
                    <Package className="w-20 h-20 mx-auto mb-6 opacity-30" />
                    <p className="text-xl font-medium">Belum ada item dalam kategori ini</p>
                    <p className="text-sm mt-2">Item akan ditampilkan ketika tersedia</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom decorative elements */}
          {!loading && !error && (
            <div className="mt-20 flex justify-center space-x-4 fade-in-up-delay-3">
              <div className="w-2 h-2 bg-[#096B68] rounded-full opacity-60 pulse-dot"></div>
              <div className="w-2 h-2 bg-[#90D1CA] rounded-full opacity-60 pulse-dot" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-[#FFD586] rounded-full opacity-60 pulse-dot" style={{ animationDelay: '1s' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Barang;

