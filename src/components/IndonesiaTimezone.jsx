import React, { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { 
  getCurrentTimeIndonesia, 
  formatDateTimeIndonesia, 
  formatDateToIndonesian 
} from '../utils/dateUtils';

/**
 * Component untuk menampilkan zona waktu Indonesia
 */
const IndonesiaTimezone = ({ 
  className = '',
  showIcon = true,
  showLocation = true,
  format = 'full' // 'full', 'time', 'date'
}) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeIndonesia());
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeIndonesia());
      setCurrentDate(new Date());
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (format) {
      case 'time':
        return (
          <div className="flex items-center space-x-2">
            {showIcon && <Clock className="w-4 h-4 text-blue-600" />}
            <span className="font-medium">{currentTime} WIB</span>
          </div>
        );
      
      case 'date':
        return (
          <div className="flex items-center space-x-2">
            {showIcon && <MapPin className="w-4 h-4 text-green-600" />}
            <span className="font-medium">{formatDateToIndonesian(currentDate, true)}</span>
          </div>
        );
      
      case 'full':
      default:
        return (
          <div className="flex items-center space-x-3">
            {showIcon && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
            )}
            <div className="text-sm">
              <div className="font-medium text-gray-800">
                {formatDateToIndonesian(currentDate)} - {currentTime}
              </div>
              {showLocation && (
                <div className="text-xs text-gray-500 mt-1">
                  Waktu Indonesia Barat (WIB) - UTC+7
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {renderContent()}
    </div>
  );
};

/**
 * Component untuk menampilkan timezone info di header
 */
export const TimezoneHeader = ({ className = '' }) => (
  <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
    <IndonesiaTimezone 
      format="full"
      showIcon={true}
      showLocation={true}
    />
  </div>
);

/**
 * Component untuk menampilkan waktu saja
 */
export const TimeOnly = ({ className = '' }) => (
  <IndonesiaTimezone 
    format="time"
    showIcon={true}
    className={className}
  />
);

/**
 * Component untuk menampilkan tanggal saja
 */
export const DateOnly = ({ className = '' }) => (
  <IndonesiaTimezone 
    format="date"
    showIcon={true}
    className={className}
  />
);

/**
 * Component untuk badge zona waktu
 */
export const TimezoneBadge = ({ className = '' }) => (
  <div className={`inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full ${className}`}>
    <Clock className="w-3 h-3 mr-1" />
    WIB (UTC+7)
  </div>
);

/**
 * Component untuk info zona waktu lengkap
 */
export const TimezoneInfo = ({ className = '' }) => (
  <div className={`bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 ${className}`}>
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-blue-100 rounded-lg">
        <MapPin className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-blue-800 mb-1">Zona Waktu Indonesia</h3>
        <p className="text-xs text-blue-700 leading-relaxed">
          Semua tanggal dan waktu ditampilkan dalam <strong>Waktu Indonesia Barat (WIB)</strong> 
          yang merupakan UTC+7. Sistem secara otomatis menyesuaikan dengan zona waktu Indonesia 
          untuk memastikan akurasi data.
        </p>
        <div className="mt-2 flex items-center space-x-2">
          <TimezoneBadge />
          <TimeOnly className="text-xs text-blue-600" />
        </div>
      </div>
    </div>
  </div>
);

export default IndonesiaTimezone;
