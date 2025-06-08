import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import {
  getCurrentDate,
  getCurrentDateTime,
  formatDateToIndonesian,
  getCurrentTimeIndonesia,
  formatDateTimeIndonesia
} from '../utils/dateUtils';

const RealTimeDate = ({
  showTime = false,
  showIcon = true,
  className = '',
  format = 'long', // 'long', 'short', 'input'
  showTimezone = true
}) => {
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [currentTime, setCurrentTime] = useState(getCurrentTimeIndonesia());

  useEffect(() => {
    const updateDateTime = () => {
      setCurrentDate(getCurrentDate());
      setCurrentTime(getCurrentTimeIndonesia());
    };

    // Update immediately
    updateDateTime();

    // Update every second if showing time, every minute if not
    const interval = setInterval(updateDateTime, showTime ? 1000 : 60000);

    return () => clearInterval(interval);
  }, [showTime]);

  const formatDate = (date) => {
    switch (format) {
      case 'long':
        return formatDateToIndonesian(date, showTimezone);
      case 'short':
        const shortDate = new Date(date).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' });
        return showTimezone ? `${shortDate} WIB` : shortDate;
      case 'input':
        return date;
      default:
        return formatDateToIndonesian(date, showTimezone);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-500" />
          {showTime && <Clock className="w-4 h-4 text-gray-500" />}
        </div>
      )}
      <div className="text-sm text-gray-700">
        <span className="font-medium">{formatDate(currentDate)}</span>
        {showTime && (
          <span className="ml-2 text-gray-500">
            {currentTime} {showTimezone && !currentTime.includes('WIB') && 'WIB'}
          </span>
        )}
      </div>
    </div>
  );
};

// Component untuk menampilkan tanggal di header
export const DateHeader = ({ className = '', showTimezone = true }) => (
  <RealTimeDate
    showTime={true}
    showTimezone={showTimezone}
    className={`bg-white px-4 py-2 rounded-lg shadow-sm border ${className}`}
  />
);

// Component untuk menampilkan tanggal di form
export const FormDateDisplay = ({ label = 'Tanggal Hari Ini', className = '', showTimezone = true }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <RealTimeDate
      format="long"
      showTimezone={showTimezone}
      className="text-[#096b68] font-semibold"
    />
  </div>
);

// Component untuk status tanggal real-time
export const DateStatus = ({ className = '' }) => {
  const [isToday, setIsToday] = useState(true);
  
  useEffect(() => {
    const checkDate = () => {
      const today = new Date().toDateString();
      const currentDisplayDate = new Date().toDateString();
      setIsToday(today === currentDisplayDate);
    };

    checkDate();
    const interval = setInterval(checkDate, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      <span className="text-xs text-gray-500">
        {isToday ? 'Real-time' : 'Outdated'}
      </span>
    </div>
  );
};

export default RealTimeDate;
