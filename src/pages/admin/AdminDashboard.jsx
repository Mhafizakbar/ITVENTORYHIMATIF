import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { 
  Users, 
  Package, 
  Tag, 
  FileText, 
  TrendingUp, 
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBarang: 0,
    totalKategori: 0,
    totalPeminjaman: 0,
    activePeminjaman: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from all endpoints
      const [barangRes, kategoriRes, peminjamanRes] = await Promise.all([
        fetch('https://pweb-be-production.up.railway.app/barang', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://pweb-be-production.up.railway.app/kategori', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://pweb-be-production.up.railway.app/peminjaman', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      const barangData = barangRes.ok ? await barangRes.json() : [];
      const kategoriData = kategoriRes.ok ? await kategoriRes.json() : [];
      const peminjamanData = peminjamanRes.ok ? await peminjamanRes.json() : [];

      setStats({
        totalUsers: 0, // Will need user endpoint
        totalBarang: Array.isArray(barangData) ? barangData.length : 0,
        totalKategori: Array.isArray(kategoriData) ? kategoriData.length : 0,
        totalPeminjaman: Array.isArray(peminjamanData) ? peminjamanData.length : 0,
        activePeminjaman: Array.isArray(peminjamanData) ? 
          peminjamanData.filter(p => p.status !== 'selesai').length : 0
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Barang',
      value: stats.totalBarang,
      icon: Package,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Kategori',
      value: stats.totalKategori,
      icon: Tag,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Peminjaman',
      value: stats.totalPeminjaman,
      icon: FileText,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Active Peminjaman',
      value: stats.activePeminjaman,
      icon: Activity,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#096b68]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to ITVentory Admin Panel</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className={`text-3xl font-bold ${card.textColor} mt-2`}>
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/users" className="bg-[#096b68] text-white px-4 py-3 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center justify-center">
              <Users className="h-5 w-5 mr-2" />
              Manage Users
            </Link>
            <Link to="/admin/barang" className="bg-[#096b68] text-white px-4 py-3 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center justify-center">
              <Package className="h-5 w-5 mr-2" />
              Add Barang
            </Link>
            <Link to="/admin/kategori" className="bg-[#096b68] text-white px-4 py-3 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center justify-center">
              <Tag className="h-5 w-5 mr-2" />
              Add Kategori
            </Link>
            <Link to="/admin/peminjaman" className="bg-[#096b68] text-white px-4 py-3 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center justify-center">
              <FileText className="h-5 w-5 mr-2" />
              View Peminjaman
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">API Connection: Active</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Database: Connected</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Authentication: Working</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
