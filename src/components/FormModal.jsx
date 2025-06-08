import React from 'react';
import Modal from './Modal';
import { Loader2 } from 'lucide-react';

const FormModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  size = 'md',
  submitButtonColor = 'bg-[#096b68] hover:bg-[#004d49]'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      closeOnOverlayClick={!loading}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        {/* Form Content */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {children}
        </div>

        {/* Form Actions */}
        <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 font-medium"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full sm:w-auto px-4 py-2 text-white rounded-lg transition-colors duration-200 
              disabled:opacity-50 font-medium flex items-center justify-center
              ${submitButtonColor}
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              submitText
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Form Input Components
export const FormInput = ({ 
  label, 
  error, 
  required = false, 
  className = '', 
  ...props 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      className={`
        w-full px-3 py-2 border rounded-lg transition-colors duration-200
        focus:ring-2 focus:ring-[#096b68] focus:border-transparent
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
        ${className}
      `}
      {...props}
    />
    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);

export const FormSelect = ({ 
  label, 
  error, 
  required = false, 
  children, 
  className = '', 
  ...props 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      className={`
        w-full px-3 py-2 border rounded-lg transition-colors duration-200
        focus:ring-2 focus:ring-[#096b68] focus:border-transparent
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);

export const FormTextarea = ({ 
  label, 
  error, 
  required = false, 
  className = '', 
  ...props 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      className={`
        w-full px-3 py-2 border rounded-lg transition-colors duration-200
        focus:ring-2 focus:ring-[#096b68] focus:border-transparent resize-none
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
        ${className}
      `}
      {...props}
    />
    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);

export default FormModal;
