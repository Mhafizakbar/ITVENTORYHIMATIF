import React, { useState } from 'react';
import Modal from './Modal';
import FormModal, { FormInput, FormSelect, FormTextarea } from './FormModal';
import ConfirmDialog from './ConfirmDialog';
import AlertModal from './AlertModal';
import { useModal, useAlert, useConfirm } from '../hooks/useModal';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Gift,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';

const ModalDemo = () => {
  const basicModal = useModal();
  const formModal = useModal();
  const alert = useAlert();
  const confirm = useConfirm();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    bio: ''
  });
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    formModal.closeModal();
    alert.showSuccess(
      'Success!', 
      `User "${formData.name}" has been created successfully!`
    );
    
    // Reset form
    setFormData({ name: '', email: '', role: 'user', bio: '' });
  };

  const handleDelete = (itemName) => {
    confirm.showConfirm(
      'Delete Item',
      `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      async () => {
        // Simulate delete operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert.showSuccess('Deleted!', `"${itemName}" has been deleted successfully.`);
      },
      'danger'
    );
  };

  const showDifferentAlerts = (type) => {
    switch (type) {
      case 'success':
        alert.showSuccess('Great Job!', 'Your operation completed successfully!');
        break;
      case 'error':
        alert.showError('Oops!', 'Something went wrong. Please try again.');
        break;
      case 'warning':
        alert.showWarning('Warning!', 'Please check your input before proceeding.');
        break;
      case 'info':
        alert.showInfo('Information', 'Here is some useful information for you.');
        break;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-yellow-500 mr-3" />
          Modal Components Demo
        </h1>
        <p className="text-gray-600">
          Showcase of beautiful and interactive modal components
        </p>
      </div>

      {/* Demo Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Basic Modal */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Basic Modal</h3>
            <p className="text-gray-600 text-sm mb-4">Simple modal with custom content</p>
            <button
              onClick={basicModal.openModal}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Basic Modal
            </button>
          </div>
        </div>

        {/* Form Modal */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Form Modal</h3>
            <p className="text-gray-600 text-sm mb-4">Modal with form inputs and validation</p>
            <button
              onClick={formModal.openModal}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Open Form Modal
            </button>
          </div>
        </div>

        {/* Confirm Dialog */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Confirm Dialog</h3>
            <p className="text-gray-600 text-sm mb-4">Confirmation dialog for destructive actions</p>
            <button
              onClick={() => handleDelete('Important Document')}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Item
            </button>
          </div>
        </div>
      </div>

      {/* Alert Types */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Gift className="w-5 h-5 text-purple-600 mr-2" />
          Alert Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => showDifferentAlerts('success')}
            className="bg-green-100 text-green-800 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
          >
            Success Alert
          </button>
          <button
            onClick={() => showDifferentAlerts('error')}
            className="bg-red-100 text-red-800 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Error Alert
          </button>
          <button
            onClick={() => showDifferentAlerts('warning')}
            className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
          >
            Warning Alert
          </button>
          <button
            onClick={() => showDifferentAlerts('info')}
            className="bg-blue-100 text-blue-800 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            Info Alert
          </button>
        </div>
      </div>

      {/* Basic Modal */}
      <Modal
        isOpen={basicModal.isOpen}
        onClose={basicModal.closeModal}
        title="Beautiful Basic Modal"
        size="md"
      >
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to Our Modal System!
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              This is a beautiful, responsive modal with smooth animations and great user experience. 
              You can close it by clicking the X button, pressing ESC, or clicking outside the modal.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={basicModal.closeModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  basicModal.closeModal();
                  alert.showSuccess('Great!', 'You clicked the action button!');
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Take Action
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Form Modal */}
      <FormModal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        title="Create New User"
        onSubmit={handleFormSubmit}
        loading={loading}
        submitText="Create User"
        size="lg"
      >
        <FormInput
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          placeholder="Enter full name"
        />
        
        <FormInput
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          placeholder="Enter email address"
        />
        
        <FormSelect
          label="Role"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          required
        >
          <option value="user">User</option>
          <option value="admin">Administrator</option>
          <option value="moderator">Moderator</option>
        </FormSelect>
        
        <FormTextarea
          label="Bio"
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          placeholder="Tell us about yourself..."
          rows="4"
        />
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirm.confirm.isOpen}
        onClose={confirm.hideConfirm}
        onConfirm={confirm.handleConfirm}
        title={confirm.confirm.title}
        message={confirm.confirm.message}
        type={confirm.confirm.type}
        loading={confirm.confirm.loading}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.alert.isOpen}
        onClose={alert.hideAlert}
        title={alert.alert.title}
        message={alert.alert.message}
        type={alert.alert.type}
      />
    </div>
  );
};

export default ModalDemo;
