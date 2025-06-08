/**
 * Date utility functions for real-time date handling
 */

/**
 * Get current date in YYYY-MM-DD format (Indonesia timezone)
 * @returns {string} Current date string
 */
export const getCurrentDate = () => {
  const now = new Date();
  // Convert to Indonesia timezone (UTC+7)
  const indonesiaTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  return indonesiaTime.toISOString().split('T')[0];
};

/**
 * Get current date and time in Indonesia timezone
 * @returns {string} Current datetime string
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  // Convert to Indonesia timezone (UTC+7)
  const indonesiaTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  return indonesiaTime.toISOString();
};

/**
 * Get current time in Indonesia timezone
 * @returns {string} Current time string
 */
export const getCurrentTimeIndonesia = () => {
  return new Date().toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Format date to Indonesian locale with timezone
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTimezone - Whether to include timezone info
 * @returns {string} Formatted date string
 */
export const formatDateToIndonesian = (date, includeTimezone = false) => {
  if (!date) return '-';

  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return includeTimezone ? `${formatted} (WIB)` : formatted;
};

/**
 * Format date to short format (DD/MM/YYYY) with timezone
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTimezone - Whether to include timezone info
 * @returns {string} Formatted date string
 */
export const formatDateShort = (date, includeTimezone = false) => {
  if (!date) return '-';

  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return includeTimezone ? `${formatted} WIB` : formatted;
};

/**
 * Get date for input field (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} Date string for input field
 */
export const getInputDateValue = (date) => {
  if (!date) return getCurrentDate();
  
  const dateObj = new Date(date);
  return dateObj.toISOString().split('T')[0];
};

/**
 * Add days to a date
 * @param {string|Date} date - Base date
 * @param {number} days - Number of days to add
 * @returns {string} New date in YYYY-MM-DD format
 */
export const addDays = (date, days) => {
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj.toISOString().split('T')[0];
};

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isDateInPast = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj < today;
};

/**
 * Check if date is today (Indonesia timezone)
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const dateObj = new Date(date);
  const today = new Date();

  // Convert both to Indonesia timezone for comparison
  const dateInIndonesia = dateObj.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' });
  const todayInIndonesia = today.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' });

  return dateInIndonesia === todayInIndonesia;
};

/**
 * Get days difference between two dates (Indonesia timezone)
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Days difference
 */
export const getDaysDifference = (date1, date2) => {
  // Convert to Indonesia timezone for accurate calculation
  const firstDate = new Date(new Date(date1).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const secondDate = new Date(new Date(date2).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const timeDifference = secondDate.getTime() - firstDate.getTime();
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
};

/**
 * Format date and time with Indonesia timezone
 * @param {string|Date} date - Date to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted date and time string
 */
export const formatDateTimeIndonesia = (date, includeSeconds = false) => {
  if (!date) return '-';

  const dateObj = new Date(date);
  const dateFormatted = dateObj.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeFormatted = dateObj.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  });

  return `${dateFormatted}, ${timeFormatted} WIB`;
};

/**
 * Get minimum date for return date (next day from loan date)
 * @param {string|Date} loanDate - Loan date
 * @returns {string} Minimum return date in YYYY-MM-DD format
 */
export const getMinReturnDate = (loanDate) => {
  if (!loanDate) return getCurrentDate();
  return addDays(loanDate, 1);
};

/**
 * Validate date range for loan
 * @param {string} loanDate - Loan date
 * @param {string} returnDate - Return date
 * @returns {object} Validation result with isValid and message
 */
export const validateLoanDates = (loanDate, returnDate) => {
  if (!loanDate || !returnDate) {
    return {
      isValid: false,
      message: 'Tanggal peminjaman dan tanggal kembali harus diisi'
    };
  }

  if (isDateInPast(loanDate)) {
    return {
      isValid: false,
      message: 'Tanggal peminjaman tidak boleh di masa lalu'
    };
  }

  if (new Date(returnDate) <= new Date(loanDate)) {
    return {
      isValid: false,
      message: 'Tanggal kembali harus setelah tanggal peminjaman'
    };
  }

  return {
    isValid: true,
    message: 'Tanggal valid'
  };
};

/**
 * Get status based on return date
 * @param {string} returnDate - Return date
 * @param {string} currentStatus - Current status
 * @returns {string} Status (aktif, terlambat, selesai)
 */
export const getLoanStatus = (returnDate, currentStatus = 'aktif') => {
  if (currentStatus === 'selesai') return 'selesai';
  
  if (!returnDate) return 'aktif';
  
  const today = new Date();
  const returnDateObj = new Date(returnDate);
  
  if (returnDateObj < today) {
    return 'terlambat';
  }
  
  return 'aktif';
};

/**
 * Real-time date updater hook
 * Updates date every minute to keep it current
 */
import { useState, useEffect } from 'react';

export const useRealTimeDate = () => {
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(getCurrentDate());
    };

    // Update immediately
    updateDate();

    // Update every minute
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  return currentDate;
};
