import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

export const useAlert = () => {
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showAlert = (type, title, message) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (title, message) => showAlert('success', title, message);
  const showError = (title, message) => showAlert('error', title, message);
  const showWarning = (title, message) => showAlert('warning', title, message);
  const showInfo = (title, message) => showAlert('info', title, message);

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export const useConfirm = () => {
  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: null,
    loading: false
  });

  const showConfirm = (title, message, onConfirm, type = 'warning') => {
    setConfirm({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      loading: false
    });
  };

  const hideConfirm = () => {
    setConfirm(prev => ({ ...prev, isOpen: false, loading: false }));
  };

  const setLoading = (loading) => {
    setConfirm(prev => ({ ...prev, loading }));
  };

  const handleConfirm = async () => {
    if (confirm.onConfirm) {
      setLoading(true);
      try {
        await confirm.onConfirm();
        hideConfirm();
      } catch (error) {
        setLoading(false);
        throw error;
      }
    }
  };

  return {
    confirm,
    showConfirm,
    hideConfirm,
    handleConfirm,
    setLoading
  };
};
