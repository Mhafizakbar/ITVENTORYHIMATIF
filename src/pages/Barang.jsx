import React, { useState, useEffect } from 'react';
import { AudioLines, ShoppingBag, Sparkles, ChevronDown, Package, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';


// Mock Navbar component


const Barang = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari API dengan credentials include
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch barang dan kategori secara bersamaan dengan credentials
        const [barangResponse, kategoriResponse] = await Promise.all([
          fetch('https://pweb-be-production.up.railway.app/barang', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              // Tambahkan header lain jika diperlukan
            }
          }),
          fetch('https://pweb-be-production.up.railway.app/kategori', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              // Tambahkan header lain jika diperlukan
            }
          })
        ]);

        if (!barangResponse.ok) {
          throw new Error(`Error fetching barang: ${barangResponse.status} ${barangResponse.statusText}`);
        }
        if (!kategoriResponse.ok) {
          throw new Error(`Error fetching kategori: ${kategoriResponse.status} ${kategoriResponse.statusText}`);
        }

        const barangData = await barangResponse.json();
        const kategoriData = await kategoriResponse.json();

        // Only log once when data is first loaded
        if (barangData.length > 0 && kategoriData.length > 0) {
          console.log('Data loaded successfully - Barang:', barangData.length, 'items, Kategori:', kategoriData.length, 'categories');
        }

        setItemsData(barangData);
        setCategoriesData(kategoriData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mapping kategori dengan icon dan warna (fallback untuk styling)
  const getCategoryStyle = (categoryId, categoryName) => {
    // Mapping berdasarkan nama kategori atau ID
    const name = categoryName?.toLowerCase() || '';
    
    if (name.includes('audio') || categoryId === 1) {
      return {
        icon: AudioLines,
        bgColor: "bg-[#096B68]",
        iconColor: "text-[#096B68]",
        description: "Temukan berbagai peralatan audio berkualitas untuk kebutuhan Anda."
      };
    } else if (name.includes('furniture') || name.includes('perabotan') || categoryId === 2) {
      return {
        icon: ShoppingBag,
        bgColor: "bg-[#90D1CA]",
        iconColor: "text-[#90D1CA]",
        description: "Perabot penunjang kegiatan, dari rapat hingga acara besar."
      };
    } else {
      return {
        icon: Sparkles,
        bgColor: "bg-[#FFD586]",
        iconColor: "text-[#FFD586]",
        description: "Pelengkap praktis untuk dokumentasi dan acara."
      };
    }
  };

  // Buat kategori "Tidak Berkategori" untuk item dengan id_kategori null
  const createUncategorizedCategory = () => ({
    id: 'uncategorized',
    name: 'Tidak Berkategori',
    icon: Package,
    bgColor: "bg-gray-500",
    iconColor: "text-gray-500",
    description: "Item yang belum dikategorikan atau dalam proses pengkategorian."
  });

  // Transform data kategori untuk UI
  const categories = [...categoriesData.map(cat => {
    const style = getCategoryStyle(cat.id_kategori || cat.id, cat.nama_kategori || cat.name);
    return {
      id: cat.id_kategori || cat.id,
      name: cat.nama_kategori || cat.name,
      ...style
    };
  })];

  // Tambahkan kategori "Tidak Berkategori" jika ada item dengan id_kategori null
  const uncategorizedItems = itemsData.filter(item => 
    item.id_kategori === null || item.id_kategori === undefined
  );
  
  if (uncategorizedItems.length > 0) {
    categories.push(createUncategorizedCategory());
  }

  const handleCategoryClick = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Function to get items by category
  const getItemsByCategory = (categoryId) => {
    if (categoryId === 'uncategorized') {
      return itemsData.filter(item => 
        item.id_kategori === null || item.id_kategori === undefined
      );
    }
    
    return itemsData.filter(item => 
      (item.id_kategori === categoryId) || 
      (item.kategori && item.kategori.id_kategori === categoryId)
    );
  };

  // Get current expanded category data
  const expandedCategoryData = expandedCategory ? categories.find(cat => cat.id === expandedCategory) : null;
  const expandedCategoryItems = expandedCategory ? getItemsByCategory(expandedCategory) : [];

  // Retry function untuk reload data
  const retryFetch = () => {
    setError(null);
    setLoading(true);
    // Trigger useEffect lagi dengan mengubah dependency
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80)',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/90 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-6 py-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#096B68]" />
              <p className="text-lg text-slate-600">Memuat data inventaris...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80)',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/90 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-6 py-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Terjadi Kesalahan</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={retryFetch}
                  className="px-6 py-2 bg-[#096B68] text-white rounded-lg hover:bg-[#085854] transition-colors"
                >
                  Coba Lagi
                </button>
                <button 
                  onClick={() => setError(null)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Tutup Error
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80)',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay untuk memastikan konten tetap terbaca */}
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

          .quantity-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .category-card:hover .category-card-hover {
            opacity: 1;
          }
        `}</style>

        <Navbar />
        
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="milku-font text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-4 sm:mb-6 tracking-widest fade-in-up">
              K A T E G O R I
            </h1>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-800 mx-auto mb-6 sm:mb-8 scale-in"></div>
            <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed fade-in-up-delay-1 px-4">
              Temukan dan pinjam inventaris sesuai kebutuhan kegiatanmu di ITVENTORY!
              Inventaris dikelompokkan berdasarkan jenis untuk memudahkan pencarian dan mendukung kegiatan seperti rapat, acara, dan operasional harian.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 w-full mb-6 sm:mb-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const animationClass = index % 4 === 0 ? 'slide-in-left' : 
                                   index % 4 === 3 ? 'slide-in-right' : 
                                   'fade-in-up-delay-2';
              const categoryItems = getItemsByCategory(category.id);
              const isExpanded = expandedCategory === category.id;
              
              return (
                <div key={category.id} className="w-full sm:w-80 lg:w-72 xl:w-80 flex-shrink-0">
                  <div
                    className={`category-card cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-6 ${animationClass} ${isExpanded ? 'ring-2 sm:ring-4 ring-opacity-50 ' + (category.id === 1 ? 'ring-emerald-300' : category.id === 2 ? 'ring-teal-300' : category.id === 3 ? 'ring-yellow-300' : 'ring-gray-300') : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {/* Circular Image Container */}
                    <div className="relative mb-4 sm:mb-6">
                      <div className={`w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto rounded-full ${category.bgColor} p-1 shadow-xl sm:shadow-2xl`}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                          {/* Background Image */}
                          <div className="category-image w-full h-full bg-cover bg-center rounded-full bg-gray-200">
                            {/* Image Overlay */}
                            <div className="image-overlay absolute inset-0 bg-white bg-opacity-70 rounded-full flex items-center justify-center">
                              {/* Icon Overlay */}
                              <div className="icon-overlay">
                                <IconComponent
                                  size={window.innerWidth < 640 ? 40 : window.innerWidth < 1024 ? 50 : 60}
                                  className={`${category.iconColor} drop-shadow-lg`}
                                  strokeWidth={1.5}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating accent */}
                      <div className={`absolute -top-2 -right-2 w-6 h-6 ${category.bgColor} rounded-full opacity-60 bounce-in`} style={{animationDelay: `${0.8 + index * 0.2}s`}}></div>
                      <div className={`absolute -bottom-4 -left-4 w-4 h-4 ${category.bgColor} rounded-full opacity-40 bounce-in`} style={{animationDelay: `${1.0 + index * 0.2}s`}}></div>
                    </div>

                    {/* Content */}
                    <div className="text-center px-2 sm:px-4">
                      <h3 className="milku-font text-lg sm:text-xl lg:text-2xl font-medium text-slate-800 mb-2 sm:mb-3 tracking-wide">
                        {category.name}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 px-2">
                        {category.description}
                      </p>

                      {/* Item count */}
                      <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 mr-1 sm:mr-2" />
                        <span className="text-slate-600 text-xs sm:text-sm">
                          {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Expand/Collapse indicator */}
                      <div className="flex items-center justify-center mt-3 sm:mt-4">
                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                        </div>
                      </div>

                      {/* Hover indicator */}
                      <div className="mt-2 opacity-0 category-card-hover transition-opacity duration-300">
                        <div className={`w-8 sm:w-12 h-0.5 ${category.bgColor} mx-auto`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Items Card - Full Width, Positioned Below Categories */}
          {expandedCategory && (
            <div className={`expanded-card show w-full mt-6 sm:mt-8`}>
              <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl border-l-4 sm:border-l-8 ${
                expandedCategoryData.id === 1 ? 'border-[#096B68] bg-gradient-to-r from-[#90D1CA] via-white to-[#FFFBDE]' :
                expandedCategoryData.id === 2 ? 'border-[#90D1CA] bg-gradient-to-r from-[#FFFBDE] via-white to-[#90D1CA]' :
                expandedCategoryData.id === 3 ? 'border-[#FFD586] bg-gradient-to-r from-[#90D1CA] via-white to-[#FFFBDE]' :
                'border-gray-500 bg-gradient-to-r from-gray-100 via-white to-gray-100'
              } backdrop-filter backdrop-blur-sm bg-opacity-95`}>

                {/* Header with category info */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                    <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${
                      expandedCategoryData.id === 1 ? 'bg-blue-100' :
                      expandedCategoryData.id === 2 ? 'bg-blue-100' :
                      expandedCategoryData.id === 3 ? 'bg-orange-100' :
                      'bg-gray-100'
                    }`}>
                      {React.createElement(expandedCategoryData.icon, {
                        className: `w-6 h-6 sm:w-8 sm:h-8 ${
                          expandedCategoryData.id === 1 ? 'text-[#096B68]' :
                          expandedCategoryData.id === 2 ? 'text-[#90D1CA]' :
                          expandedCategoryData.id === 3 ? 'text-[#FFD586]' :
                          'text-gray-500'
                        }`
                      })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 truncate">
                        Produk {expandedCategoryData.name}
                      </h4>
                      <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
                        {expandedCategoryItems.length} item tersedia
                      </p>
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setExpandedCategory(null)}
                    className="p-1 sm:p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-all duration-200 flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 rotate-180" />
                  </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {expandedCategoryItems.map((item, itemIndex) => (
                    <div
                      key={item.id_barang || item.id}
                      className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.02] item-slide-in ${
                        expandedCategoryData.id === 1 ? 'border-[#096B68] hover:border-[#096B68]' :
                        expandedCategoryData.id === 2 ? 'border-[#90D1CA] hover:border-[#90D1CA]' :
                        expandedCategoryData.id === 3 ? 'border-[#FFD586] hover:border-[#FFD586]' :
                        'border-gray-400 hover:border-gray-500'
                      }`}
                      style={{animationDelay: `${itemIndex * 0.1}s`}}
                    >
                      {/* Item Layout */}
                      <div className="w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                          {/* Left side - Icon and Content */}
                          <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                            {/* Item Icon */}
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
                              expandedCategoryData.id === 1 ? 'bg-blue-50' :
                              expandedCategoryData.id === 2 ? 'bg-blue-50' :
                              expandedCategoryData.id === 3 ? 'bg-orange-50' :
                              'bg-gray-50'
                            }`}>
                              <Package className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                expandedCategoryData.id === 1 ? 'text-[#096B68]' :
                                expandedCategoryData.id === 2 ? 'text-[#90D1CA]' :
                                expandedCategoryData.id === 3 ? 'text-[#FFD586]' :
                                'text-gray-500'
                              }`} />
                            </div>

                            {/* Item Content */}
                            <div className="flex-1 min-w-0">
                              <h5 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight mb-1 sm:mb-2">
                                {item.nama_barang || item.name}
                              </h5>
                              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                                {item.deskripsi || item.description || 'Tidak ada deskripsi'}
                              </p>
                              {/* Kategori info untuk item tidak berkategori */}
                              {(item.id_kategori === null || item.id_kategori === undefined) && (
                                <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                  Perlu dikategorikan
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right side - Stock Status */}
                          <div className="flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-end space-x-2 sm:space-x-0 sm:space-y-2">
                            <div className={`text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium ${
                              (item.jumlah || item.quantity || 0) > 10 ? 'bg-green-500' :
                              (item.jumlah || item.quantity || 0) > 5 ? 'bg-yellow-500' :
                              (item.jumlah || item.quantity || 0) > 0 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}>
                              Stok: {item.jumlah || item.quantity || 0}
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              (item.jumlah || item.quantity || 0) > 10 ? 'bg-green-100 text-green-800' :
                              (item.jumlah || item.quantity || 0) > 5 ? 'bg-yellow-100 text-yellow-800' :
                              (item.jumlah || item.quantity || 0) > 0 ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {(item.jumlah || item.quantity || 0) > 10 ? 'Tersedia' :
                               (item.jumlah || item.quantity || 0) > 5 ? 'Terbatas' :
                               (item.jumlah || item.quantity || 0) > 0 ? 'Sedikit' :
                               'Habis'}
                            </div>
                          </div>
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
          <div className="mt-20 flex justify-center space-x-4 fade-in-up-delay-3">
            <div className="w-2 h-2 bg-[#096B68] rounded-full opacity-60 pulse-dot"></div>
            <div className="w-2 h-2 bg-[#90D1CA] rounded-full opacity-60 pulse-dot" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-[#FFD586] rounded-full opacity-60 pulse-dot" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Barang;