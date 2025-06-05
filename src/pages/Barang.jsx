import React, { useState } from 'react';
import { AudioLines, ShoppingBag, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';

const Barang = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Background image URL - Ganti dengan path gambar Anda
  const backgroundImage = "fixbg.jpg";

  const categories = [
    {
      id: 1,
      name: "Audio",
      description: "Temukan berbagai peralatan audio berkualitas untuk kebutuhan Anda.",
      icon: AudioLines,
      image: "G1.png", // Ganti dengan path gambar Anda
      bgColor: "bg-[#096B68]",
      iconColor: "text-[#096B68]",
      items: [
        { id: 1, name: "TOA Speaker", available: true },
        { id: 2, name: "Speaker", available: true },
        { id: 3, name: "Microphone", available: false },
      ]
    },
    {
      id: 2,
      name: "Furniture",
      description: "Perabot penunjang kegiatan, dari rapat hingga acara besar.",
      icon: ShoppingBag,
      image: "G2.png", // Ganti dengan path gambar Anda
      bgColor: "bg-[#90D1CA]",
      iconColor: "text-[#90D1CA]",
      items: [
        { id: 1, name: "Laptop Asus ROG", available: true },
        { id: 2, name: "Karpet", available: false },
      ]
    },
    {
      id: 3,
      name: "Aksesoris",
      description: "Pelengkap praktis untuk dokumentasi dan acara.",
      icon: Sparkles,
      image: "G3.png", // Ganti dengan path gambar Anda
      bgColor: "bg-[#FFD586]",
      iconColor: "text-[#FFD586]",
      items: [
        { id: 1, name: "Tripod", available: true },
        { id: 2, name: "Baterai Mic", available: true },
      ]
    }
  ];

  const handleCategoryClick = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .milku-font {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          letter-spacing: 0.1em;
        }
        
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
          animation: itemSlideIn 0.3s ease-out forwards;
          opacity: 0;
          transform: translateX(-20px);
        }

        @keyframes itemSlideIn {
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
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Enhanced glassmorphism effect */
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        /* Header with enhanced visibility */
        .header-overlay {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="min-h-screen page-background">
        <div className="content-wrapper">
          <Navbar />
          
          <div className="container mx-auto px-6 py-16">
            {/* Header Section with enhanced visibility */}
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

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const isExpanded = expandedCategory === category.id;
                const animationClass = index === 0 ? 'slide-in-left' : index === 2 ? 'slide-in-right' : 'fade-in-up-delay-2';
                
                return (
                  <div key={category.id} className="w-full">
                    <div 
                      className={`category-card cursor-pointer rounded-3xl p-6 ${animationClass}`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {/* Circular Image Container */}
                      <div className="relative mb-6">
                        <div className={`w-64 h-64 mx-auto rounded-full ${category.bgColor} p-1 shadow-2xl`}>
                          <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                            {/* Background Image */}
                            <div 
                              className="category-image w-full h-full bg-cover bg-center rounded-full"
                              style={{ backgroundImage: `url(${category.image})` }}
                            >
                              {/* Image Overlay */}
                              <div className="image-overlay absolute inset-0 bg-white bg-opacity-70 rounded-full flex items-center justify-center">
                                {/* Icon Overlay */}
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
                        
                        {/* Floating accent */}
                        <div className={`absolute -top-2 -right-2 w-6 h-6 ${category.bgColor} rounded-full opacity-60 bounce-in`} style={{animationDelay: `${0.8 + index * 0.2}s`}}></div>
                        <div className={`absolute -bottom-4 -left-4 w-4 h-4 ${category.bgColor} rounded-full opacity-40 bounce-in`} style={{animationDelay: `${1.0 + index * 0.2}s`}}></div>
                      </div>

                      {/* Content */}
                      <div className="text-center px-4">
                        <h3 className="milku-font text-2xl md:text-3xl font-medium text-slate-800 mb-4 tracking-wide">
                          {category.name}
                        </h3>
                        <p className="text-slate-600 text-base leading-relaxed mb-4">
                          {category.description}
                        </p>
                        
                        {/* Expand/Collapse indicator */}
                        <div className="flex items-center justify-center mt-4">
                          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                            <ChevronDown className="w-6 h-6 text-slate-500" />
                          </div>
                        </div>
                        
                        {/* Hover indicator */}
                        <div className="mt-2 opacity-0 category-card-hover transition-opacity duration-300">
                          <div className={`w-12 h-0.5 ${category.bgColor} mx-auto`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Items List */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="mt-6 glass-card rounded-2xl p-6 transition-all duration-300">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center fade-in-up">
                          Produk {category.name}
                        </h4>
                        <div className="space-y-3">
                          {category.items.map((item, itemIndex) => (
                            <div 
                              key={item.id} 
                              className={`flex items-center justify-between p-3 rounded-lg hover:bg-white hover:bg-opacity-50 transition-all duration-200 hover:transform hover:translate-x-2 ${isExpanded ? 'item-slide-in' : ''}`}
                              style={{animationDelay: `${itemIndex * 0.1}s`}}
                            >
                              <span className={`font-medium transition-colors duration-200 ${item.available ? 'text-slate-800' : 'text-slate-400'}`}>
                                {item.name}
                              </span>
                              <div className={`w-3 h-3 rounded-full transition-all duration-200 ${item.available ? 'bg-green-500 pulse-dot' : 'bg-slate-400'}`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom decorative elements */}
            <div className="mt-20 flex justify-center space-x-4 fade-in-up-delay-3">
              <div className="w-2 h-2 bg-[#096B68] rounded-full opacity-60 pulse-dot"></div>
              <div className="w-2 h-2 bg-[#90D1CA] rounded-full opacity-60 pulse-dot" style={{animationDelay: '0.5s'}}></div>
              <div className="w-2 h-2 bg-[#FFD586] rounded-full opacity-60 pulse-dot" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .category-card:hover .category-card-hover {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default Barang;