import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'success', // 'success', 'error', 'warning', 'info'
  autoClose = true,
  autoCloseDelay = 3000,
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
      iconBg: 'bg-green-100'
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      iconBg: 'bg-red-100'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      iconBg: 'bg-yellow-100'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
      iconBg: 'bg-blue-100'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes alertSlideDown {
          from {
            opacity: 0;
            transform: translateY(-100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes alertSlideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-100px);
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .alert-content {
          animation: alertSlideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .progress-bar {
          animation: progressBar ${autoCloseDelay}ms linear;
        }
      `}</style>

      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
        onClick={handleOverlayClick}
      >
        {/* Alert Content */}
        <div className={`
          w-full max-w-md alert-content
          bg-white rounded-2xl shadow-2xl border-2 ${config.borderColor}
          overflow-hidden
        `}>
          {/* Main Content */}
          <div className={`${config.bgColor} p-6`}>
            <div className="flex items-start">
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center mr-4`}>
                <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold ${config.titleColor} mb-1`}>
                  {title}
                </h3>
                <p className={`text-sm ${config.messageColor} leading-relaxed`}>
                  {message}
                </p>
              </div>

              {/* Close Button */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={`flex-shrink-0 ml-4 p-1 ${config.iconColor} hover:bg-white/50 rounded-full transition-colors duration-200`}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {autoClose && (
            <div className="h-1 bg-gray-200">
              <div className={`h-full progress-bar ${
                type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AlertModal;
