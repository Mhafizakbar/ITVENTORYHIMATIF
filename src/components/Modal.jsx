import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.95);
          }
        }

        .modal-overlay {
          animation: modalFadeIn 0.2s ease-out;
        }

        .modal-content {
          animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-backdrop {
          backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.4);
        }
      `}</style>

      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 modal-overlay modal-backdrop"
        onClick={handleOverlayClick}
      >
        {/* Modal Content */}
        <div 
          className={`
            fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-full ${sizeClasses[size]} mx-4
            modal-content
          `}
        >
          <div className={`
            bg-white rounded-2xl shadow-2xl border border-gray-100
            max-h-[90vh] overflow-hidden
            ${className}
          `}>
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#096B68] to-[#90D1CA]">
                {title && (
                  <h2 className="text-xl font-bold text-white">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-full transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
