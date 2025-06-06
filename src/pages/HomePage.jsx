import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = () => {
  // Background image URL - Ganti dengan nama file gambar Anda di folder public
  const backgroundImage = "fixbg.jpg";

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
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-300 rounded-full animate-bounce delay-300"></div>
                  <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-blue-300 rounded-full animate-bounce delay-500"></div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Barang Tersedia Card */}
              <div className="group bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-10 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8 group-hover:bg-green-200 transition-colors duration-300">
                  <div className="w-10 h-10 bg-green-400 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Barang Tersedia</h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-lg">
                  Informasi barang yang tersedia untuk dipinjam
                </p>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                </div>
              </div>

              {/* Barang Dipinjam Card */}
              <div className="group bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-10 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-200">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-8 group-hover:bg-yellow-200 transition-colors duration-300">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-white font-bold text-sm">⏳</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Sedang Dipinjam</h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-lg">
                  Barang yang sedang dalam masa peminjaman
                </p>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                </div>
              </div>

              {/* Barang Tidak Tersedia Card */}
              <div className="group bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-10 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-300">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-8 group-hover:bg-red-200 transition-colors duration-300">
                  <div className="w-10 h-10 bg-red-400 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✗</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Tidak Tersedia</h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-lg">
                  Barang yang tidak tersedia atau rusak
                </p>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
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
        </div>
      </div>
      </div>
    </>
  );
};

export default HomePage;