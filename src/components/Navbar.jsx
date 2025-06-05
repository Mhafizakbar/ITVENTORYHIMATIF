import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/home'); // Mock current path

  // Mock Link component for demonstration
  const Link = ({ to, children, className, onClick }) => (
    <a 
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentPath(to);
        if (onClick) onClick();
      }}
      className={className}
    >
      {children}
    </a>
  );

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

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
    return currentPath === path;
  };

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/item', label: 'Item' },
    { to: '/loan', label: 'Loan' },
    { to: '/details', label: 'Details' }
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
      onClick: () => {
        console.log('Sign Out clicked');
        // Add your sign out logic here
        closeMobileMenu();
      }
    }
  ];

  return (
    <nav className="bg-[#096b68] shadow-md relative navbar-container">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand Name */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-[#004d49] hover:text-[#00695c] transition-colors duration-200"
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
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActiveRoute(link.to)
                      ? 'text-[#2d7873] bg-gradient-to-b from-[#b2dfdb] to-[#a3d6c7] border-2 border-[#80cbc4] shadow-lg transform scale-105'
                      : 'text-[#FFFFFF] hover:text-[#004d49] hover:bg-[#a3d6c7] hover:scale-105'
                  }`}
                  style={isActiveRoute(link.to) ? {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(128, 203, 196, 0.3)'
                  } : {}}
                >
                  {link.label}
                  {/* Enhanced bottom border with gradient effect */}
                  {isActiveRoute(link.to) && (
                    <>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#26a69a] via-[#00897b] to-[#26a69a] rounded-b-md"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-[#ffffff80] to-transparent"></div>
                    </>
                  )}
                </Link>
              ))}
            </div>

            {/* Hamburger Button */}
            <div className="flex">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-[#0a7a77] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00796b] transition-colors duration-200"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Toggle menu</span>
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[#096b68] border-t border-[#b2dfdb]">
            {hamburgerMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isSignOut = item.label === 'Sign Out';
              return (
                <button
                  key={item.to}
                  onClick={item.onClick}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 text-left ${
                    isSignOut 
                      ? 'text-orange-300 hover:text-orange-200 hover:bg-[#0a7a77]' 
                      : 'text-white hover:text-gray-200 hover:bg-[#0a7a77]'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mr-3 ${isSignOut ? 'text-orange-300' : 'text-white'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop - Changed to white blur */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm z-[-1]"
          onClick={closeMobileMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;