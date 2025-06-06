import React, { useState } from 'react';
import { AudioLines, ShoppingBag, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
const HomePage = () => {
  // State untuk mengontrol expand/collapse
  const [expandedCard, setExpandedCard] = useState(null);

  // Data inventaris dengan status untuk demo
  const inventoryData = [
    {
      "id_barang": 1,
      "nama_barang": "Laptop Asus ROG",
      "id_kategori": 2,
      "jumlah": 10,
      "deskripsi": "Laptop gaming high-end",
      "status": "tersedia",
      "kategori": {
        "id_kategori": 2,
        "nama_kategori": "Furniture"
      }
    },
    {
      "id_barang": 2,
      "nama_barang": "KURSI",
      "id_kategori": 2,
      "jumlah": 2,
      "deskripsi": "Kursi untuk acara",
      "status": "dipinjam",
      "kategori": {
        "id_kategori": 2,
        "nama_kategori": "Furniture"
      }
    },
    {
      "id_barang": 3,
      "nama_barang": "KURSI Premium",
      "id_kategori": 2,
      "jumlah": 3,
      "deskripsi": "Kursi premium untuk VIP",
      "status": "tidak_tersedia",
      "kategori": {
        "id_kategori": 2,
        "nama_kategori": "Furniture"
      }
    },
    {
      "id_barang": 4,
      "nama_barang": "MIC",
      "id_kategori": 1,
      "jumlah": 3,
      "deskripsi": "Microphone wireless",
      "status": "tersedia",
      "kategori": {
        "id_kategori": 1,
        "nama_kategori": "Audio"
      }
    },
    {
      "id_barang": 7,
      "nama_barang": "Microphone",
      "id_kategori": 1,
      "jumlah": 10,
      "deskripsi": "Microphone untuk rekaman dan event",
      "status": "dipinjam",
      "kategori": {
        "id_kategori": 1,
        "nama_kategori": "Audio"
      }
    },
    {
      "id_barang": 8,
      "nama_barang": "TOA Speaker",
      "id_kategori": 1,
      "jumlah": 5,
      "deskripsi": "Speaker merk TOA untuk sistem suara",
      "status": "tidak_tersedia",
      "kategori": {
        "id_kategori": 1,
        "nama_kategori": "Audio"
      }
    },
    {
      "id_barang": 9,
      "nama_barang": "Speaker",
      "id_kategori": 1,
      "jumlah": 8,
      "deskripsi": "Speaker portable untuk presentasi",
      "status": "tersedia",
      "kategori": {
        "id_kategori": 1,
        "nama_kategori": "Audio"
      }
    },
    {
      "id_barang": 10,
      "nama_barang": "Baterai Mic",
      "id_kategori": 3,
      "jumlah": 20,
      "deskripsi": "Baterai cadangan untuk microphone wireless",
      "status": "tersedia",
      "kategori": {
        "id_kategori": 3,
        "nama_kategori": "Aksesoris"
      }
    },
    {
      "id_barang": 11,
      "nama_barang": "Karpet",
      "id_kategori": 2,
      "jumlah": 3,
      "deskripsi": "Karpet untuk acara dan dekorasi ruangan",
      "status": "dipinjam",
      "kategori": {
        "id_kategori": 2,
        "nama_kategori": "Furniture"
      }
    },
    {
      "id_barang": 12,
      "nama_barang": "Tripod",
      "id_kategori": 3,
      "jumlah": 7,
      "deskripsi": "Tripod untuk kamera dan peralatan recording",
      "status": "tidak_tersedia",
      "kategori": {
        "id_kategori": 3,
        "nama_kategori": "Aksesoris"
      }
    }
  ];

  // Background image URL - Ganti dengan nama file gambar Anda di folder public
  const backgroundImage = "fixbg.jpg";

  // Fungsi untuk mengelompokkan data berdasarkan status dan kategori
  const groupByStatusAndCategory = () => {
    const grouped = {
      tersedia: { Audio: [], Furniture: [], Aksesoris: [] },
      dipinjam: { Audio: [], Furniture: [], Aksesoris: [] },
      tidak_tersedia: { Audio: [], Furniture: [], Aksesoris: [] }
    };

    inventoryData.forEach(item => {
      const status = item.status;
      const kategori = item.kategori?.nama_kategori || 'Aksesoris';
      
      if (grouped[status] && grouped[status][kategori]) {
        grouped[status][kategori].push(item);
      }
    });

    return grouped;
  };

  const groupedData = groupByStatusAndCategory();

  const categoryIcons = {
    Audio: AudioLines,
    Furniture: ShoppingBag,
    Aksesoris: Sparkles
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
          <div className="px-6 py-12">
            
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                {/* Left Content */}
                <div className="space-y-8 animate-fade-in-up">
                  <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                    Peminjaman
                    <br />
                    <span className="text-[#90D1CA]">Inventaris</span>
                    <br />
                    HIMATIF
                  </h1>
                  
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <span className="font-medium">VISITING HOURS</span>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <span className="font-medium">ADDRESS</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Sat-Sun 12pm-6pm</span>
                      <span className="text-gray-400">|</span>
                      <span>3202 Cherokee St.</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Or by appointment</span>
                      <span className="text-gray-400">|</span>
                      <span>St. Louis, MO 63118</span>
                    </div>
                  </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  <div className="relative animate-float">
                    <div className="absolute inset-0 w-80 h-80 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full transform rotate-12 animate-pulse-slow"></div>
                    <div className="relative w-80 h-80 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                      <img 
                        src="inv.jpg"
                        alt="Inventaris"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#096B68] rounded-full animate-bounce delay-300"></div>
                    <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-[#90D1CA] rounded-full animate-bounce delay-500"></div>
                  </div>
                </div>
              </div>

              {/* Action Cards Container */}
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Main Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Barang Tersedia Card */}
                  <div 
                    className="group bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-10 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-100 cursor-pointer"
                    onClick={() => toggleCard('tersedia')}
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8 group-hover:bg-green-200 transition-colors duration-300">
                      <div className="w-10 h-10 bg-green-400 rounded-full animate-pulse flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Barang Tersedia</h3>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-lg mb-6">
                      Informasi barang yang tersedia untuk dipinjam
                    </p>

                    {/* Expand indicator */}
                    <div className="mt-6 flex items-center justify-center">
                      <div className={`transform transition-transform duration-300 ${expandedCard === 'tersedia' ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                    </div>
                  </div>

                  {/* Barang Dipinjam Card */}
                  <div 
                    className="group bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-10 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-200 cursor-pointer"
                    onClick={() => toggleCard('dipinjam')}
                  >
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-8 group-hover:bg-yellow-200 transition-colors duration-300">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
                        <span className="text-white font-bold text-sm">⏳</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Sedang Dipinjam</h3>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-lg mb-6">
                      Barang yang sedang dalam masa peminjaman
                    </p>

                    {/* Expand indicator */}
                    <div className="mt-6 flex items-center justify-center">
                      <div className={`transform transition-transform duration-300 ${expandedCard === 'dipinjam' ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                    </div>
                  </div>

                  {/* Barang Tidak Tersedia Card */}
                  <div 
                    className="group bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-10 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-300 cursor-pointer"
                    onClick={() => toggleCard('tidak_tersedia')}
                  >
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-8 group-hover:bg-red-200 transition-colors duration-300">
                      <div className="w-10 h-10 bg-red-400 rounded-full animate-pulse flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✗</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Tidak Tersedia</h3>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-lg mb-6">
                      Barang yang tidak tersedia atau rusak
                    </p>

                    {/* Expand indicator */}
                    <div className="mt-6 flex items-center justify-center">
                      <div className={`transform transition-transform duration-300 ${expandedCard === 'tidak_tersedia' ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail Card */}
                {expandedCard && (
                  <div className="animate-expand bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-2xl font-bold text-gray-900">
                        Detail Barang {expandedCard === 'tersedia' ? 'Tersedia' : expandedCard === 'dipinjam' ? 'Dipinjam' : 'Tidak Tersedia'}
                      </h4>
                      <button 
                        onClick={() => setExpandedCard(null)}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Category Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                      {Object.entries(categoryIcons).map(([kategori, IconComponent]) => (
                        <div 
                          key={kategori} 
                          className={`p-6 rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${
                            expandedCard === 'tersedia' ? 'bg-green-50 border-green-200 hover:border-green-300' :
                            expandedCard === 'dipinjam' ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300' :
                            'bg-red-50 border-red-200 hover:border-red-300'
                          }`}
                        >
                          {/* Category Header */}
                          <div className="flex items-center space-x-3 mb-6">
                            <div className={`p-3 rounded-full ${
                              expandedCard === 'tersedia' ? 'bg-green-100' :
                              expandedCard === 'dipinjam' ? 'bg-yellow-100' :
                              'bg-red-100'
                            }`}>
                              <IconComponent className={`w-6 h-6 ${
                                expandedCard === 'tersedia' ? 'text-green-600' :
                                expandedCard === 'dipinjam' ? 'text-yellow-600' :
                                'text-red-600'
                              }`} />
                            </div>
                            <div>
                              <h5 className="text-xl font-bold text-gray-800">{kategori}</h5>
                              <p className="text-sm text-gray-600">
                                {groupedData[expandedCard][kategori]?.length || 0} item(s)
                              </p>
                            </div>
                          </div>
                          
                          {/* Items List */}
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {groupedData[expandedCard][kategori]?.length > 0 ? (
                              groupedData[expandedCard][kategori].map((item) => (
                                <div 
                                  key={item.id_barang} 
                                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                                    expandedCard === 'tersedia' ? 'bg-white border-green-200 hover:border-green-300' :
                                    expandedCard === 'dipinjam' ? 'bg-white border-yellow-200 hover:border-yellow-300' :
                                    'bg-white border-red-200 hover:border-red-300'
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h6 className="font-semibold text-gray-800 text-base mb-1">{item.nama_barang}</h6>
                                      <p className="text-gray-600 text-sm leading-relaxed">{item.deskripsi}</p>
                                    </div>
                                    <div className="ml-3 flex-shrink-0">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                              <div className="text-center py-12">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                  expandedCard === 'tersedia' ? 'bg-green-100' :
                                  expandedCard === 'dipinjam' ? 'bg-yellow-100' :
                                  'bg-red-100'
                                }`}>
                                  <IconComponent className={`w-8 h-8 ${
                                    expandedCard === 'tersedia' ? 'text-green-400' :
                                    expandedCard === 'dipinjam' ? 'text-yellow-400' :
                                    'text-red-400'
                                  }`} />
                                </div>
                                <p className="text-gray-500 font-medium">Tidak ada barang</p>
                                <p className="text-gray-400 text-sm">dalam kategori ini</p>
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
        </div>
      </div>
    </>
  );
};

export default HomePage;