import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, Trash2 } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning', // 'warning', 'danger', 'success', 'info'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
      iconBg: 'bg-yellow-100'
    },
    danger: {
      icon: Trash2,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      confirmBg: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-100'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      confirmBg: 'bg-green-600 hover:bg-green-700',
      iconBg: 'bg-green-100'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
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
        @keyframes confirmFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes confirmBounceIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
          }
          70% {
            transform: translate(-50%, -50%) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .confirm-overlay {
          animation: confirmFadeIn 0.2s ease-out;
        }

        .confirm-content {
          animation: confirmBounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>

      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 confirm-overlay"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={handleOverlayClick}
      >
        {/* Dialog Content */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 confirm-content">
          <div className={`
            bg-white rounded-2xl shadow-2xl border-2 ${config.borderColor}
            overflow-hidden
          `}>
            {/* Icon Section */}
            <div className={`${config.bgColor} px-6 pt-6 pb-4 text-center`}>
              <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-end">
              <button
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 font-medium"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`
                  w-full sm:w-auto px-4 py-2 text-white rounded-lg transition-colors duration-200 
                  disabled:opacity-50 font-medium flex items-center justify-center
                  ${config.confirmBg}
                `}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
