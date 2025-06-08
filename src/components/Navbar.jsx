import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Navigation links - Item mengarah ke /barang
  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/barang', label: 'Item' },
    { to: '/loan', label: 'Loan' },
    { to: '/detail', label: 'Details' },
    ...(isAdmin() ? [{ to: '/admin', label: 'Admin' }] : [])
  ];

  // Hamburger menu items dengan icon
  const hamburgerMenuItems = [
    { 
      to: '/profile', 
      label: 'Profile', 
      icon: User,
      onClick: () => {
        console.log('Navigate to Profile');
        closeMobileMenu();
      }
    },
    {
      to: '/signout',
      label: 'Sign Out',
      icon: LogOut,
      onClick: async () => {
        try {
          await logout();
          navigate('/');
        } catch (error) {
          console.error('Logout failed:', error);
          navigate('/');
        }
        closeMobileMenu();
      }
    }
  ];

  return (
    <>
      {/* Custom CSS Animations */}
      <style >{`
        @keyframes shimmer-wave {
          0% {
            background-position: -200% 0;
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            background-position: 200% 0;
            opacity: 0.6;
          }
        }
        
        @keyframes glow-rotate {
          0% {
            box-shadow: 0 0 10px rgba(125, 211, 192, 0.4), 0 0 20px rgba(78, 205, 196, 0.3), 0 0 30px rgba(125, 211, 192, 0.2);
            transform: rotate(0deg) scale(1);
          }
          25% {
            box-shadow: 0 0 15px rgba(78, 205, 196, 0.5), 0 0 25px rgba(125, 211, 192, 0.4), 0 0 35px rgba(78, 205, 196, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(125, 211, 192, 0.6), 0 0 30px rgba(78, 205, 196, 0.5), 0 0 40px rgba(125, 211, 192, 0.4);
            transform: rotate(180deg) scale(1.02);
          }
          75% {
            box-shadow: 0 0 15px rgba(78, 205, 196, 0.5), 0 0 25px rgba(125, 211, 192, 0.4), 0 0 35px rgba(78, 205, 196, 0.3);
          }
          100% {
            box-shadow: 0 0 10px rgba(125, 211, 192, 0.4), 0 0 20px rgba(78, 205, 196, 0.3), 0 0 30px rgba(125, 211, 192, 0.2);
            transform: rotate(360deg) scale(1);
          }
        }
        
        @keyframes color-shift {
          0%, 100% { 
            background: linear-gradient(45deg, #8aded8, #4ECDC4, #7DD3C0);
          }
          25% { 
            background: linear-gradient(45deg, #4ECDC4, #7DD3C0, #8aded8);
          }
          50% { 
            background: linear-gradient(45deg, #7DD3C0, #8aded8, #4ECDC4);
          }
          75% { 
            background: linear-gradient(45deg, #8aded8, #7DD3C0, #4ECDC4);
          }
        }
        
        @keyframes floating {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-2px) scale(1.01);
          }
          50% {
            transform: translateY(-4px) scale(1.02);
          }
          75% {
            transform: translateY(-2px) scale(1.01);
          }
        }
        
        @keyframes border-dance {
          0% {
            border-color: #7DD3C0;
            box-shadow: 0 0 0 0 rgba(125, 211, 192, 0.7);
          }
          25% {
            border-color: #4ECDC4;
            box-shadow: 0 0 0 4px rgba(78, 205, 196, 0.3);
          }
          50% {
            border-color: #8aded8;
            box-shadow: 0 0 0 8px rgba(138, 222, 216, 0.2);
          }
          75% {
            border-color: #4ECDC4;
            box-shadow: 0 0 0 4px rgba(78, 205, 196, 0.3);
          }
          100% {
            border-color: #7DD3C0;
            box-shadow: 0 0 0 0 rgba(125, 211, 192, 0.7);
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            rgba(125, 211, 192, 0.2) 0%,
            rgba(78, 205, 196, 0.4) 50%,
            rgba(125, 211, 192, 0.2) 100%
          );
          background-size: 200% 100%;
          animation: shimmer-wave 2s ease-in-out infinite;
        }
        
        .glow-rotate {
          animation: glow-rotate 3s ease-in-out infinite;
        }
        
        .color-shift {
          background-size: 300% 300%;
          animation: color-shift 4s ease-in-out infinite;
        }
        
        .floating-effect {
          animation: floating 3s ease-in-out infinite;
        }
        
        .border-dance {
          animation: border-dance 2.5s ease-in-out infinite;
        }
      `}</style>

      <nav className="bg-[#096b68] shadow-md relative navbar-container">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Brand Name */}
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="text-2xl font-bold text-[#004d49] hover:text-[#7DD3C0] transition-colors duration-300"
              >
                <span className="text-[#90D1CA]">IT</span>
                <span className="text-[#FFFBDE]">Ventory</span>
              </Link>
            </div>
            
            {/* Right Side Container - Desktop Menu + Hamburger */}
            <div className="flex items-center space-x-4">
              {/* Desktop Menu */}
              <div className="hidden lg:flex space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-3 py-1 text-sm font-medium transition-all duration-300 transform border-2 rounded-full overflow-hidden ${
                      isActiveRoute(link.to)
                        ? 'text-[#003d39] bg-gradient-to-b from-[#E8E4BB] to-[#D4D0A7] border-[#7DD3C0] shadow-lg scale-105 font-bold floating-effect border-dance'
                        : 'text-[#B4EBE6] border-transparent hover:text-[#096b68] hover:bg-gradient-to-r hover:from-[#7DD3C0] hover:to-[#4ECDC4] hover:scale-105 hover:shadow-lg hover:border-[#FFFBDE]'
                    }`}
                    style={isActiveRoute(link.to) ? {
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                    } : {}}
                  >
                    {link.label}
                    {/* Enhanced glow effects untuk active state */}
                    {isActiveRoute(link.to) && (
                      <>
                        {/* Shimmer wave effect sebagai pengganti animate-pulse */}
                        <div className="absolute top-0 left-0 right-0 bottom-0 shimmer-effect rounded-full"></div>
                        
                        {/* Floating color-shifting background */}
                        <div className="absolute top-0.5 left-0.5 right-0.5 bottom-0.5 color-shift opacity-20 rounded-full"></div>
                        

                        
                        {/* Subtle outer glow ring */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#7DD3C0] via-[#4ECDC4] to-[#7DD3C0] rounded-full opacity-30 blur-sm"></div>
                      </>
                    )}
                  </Link>
                ))}
              </div>

              {/* Hamburger Button */}
              <div className="flex">
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-full text-white hover:text-[#096b68] hover:bg-gradient-to-r from-[#7DD3C0] to-[#4ECDC4] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7DD3C0] transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Toggle menu</span>
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 transition-transform duration-200 rotate-90" />
                  ) : (
                    <Menu className="w-6 h-6 transition-transform duration-200" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile/Hamburger Menu - Updated dengan Profile dan Sign Out */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#096b68] border-t border-[#7DD3C0]">
              {hamburgerMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isSignOut = item.label === 'Sign Out';
                
                if (isSignOut) {
                  return (
                    <button
                      key={item.to}
                      onClick={item.onClick}
                      className="w-full flex items-center px-4 py-2 rounded-full text-base font-medium transition-all duration-300 text-left transform hover:scale-105 text-[#FFFBDE] hover:text-[#096b68] hover:bg-white hover:shadow-lg"
                    >
                      <IconComponent className="w-5 h-5 mr-3 transition-colors duration-300 text-[#FFFBDE] hover:text-[#096b68]" />
                      {item.label}
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className="w-full flex items-center px-4 py-2 rounded-full text-base font-medium transition-all duration-300 text-left transform hover:scale-105 text-white hover:text-[#096b68] hover:bg-gradient-to-r from-[#7DD3C0] to-[#4ECDC4] hover:shadow-lg"
                  >
                    <IconComponent className="w-5 h-5 mr-3 transition-colors duration-300 text-white" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;