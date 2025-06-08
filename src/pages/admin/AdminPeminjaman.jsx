import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Eye
} from 'lucide-react';

const AdminPeminjaman = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPeminjaman, setEditingPeminjaman] = useState(null);
  const [formData, setFormData] = useState({
    id_pengguna: '',
    tanggal_kembali: '',
    status: 'aktif'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const peminjamanRes = await fetch('https://pweb-be-production.up.railway.app/peminjaman', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!peminjamanRes.ok) {
        throw new Error('Failed to fetch peminjaman');
      }

      const peminjamanData = await peminjamanRes.json();
      setPeminjaman(Array.isArray(peminjamanData) ? peminjamanData : []);

      // Mock users data since user endpoint might not be available
      setUsers([
        { id_pengguna: 1, nama: 'Admin User' },
        { id_pengguna: 2, nama: 'Regular User' }
      ]);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPeminjaman 
        ? `https://pweb-be-production.up.railway.app/peminjaman/${editingPeminjaman.id_peminjaman}`
        : 'https://pweb-be-production.up.railway.app/peminjaman';
      
      const method = editingPeminjaman ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id_pengguna: parseInt(formData.id_pengguna)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingPeminjaman ? 'update' : 'create'} peminjaman`);
      }

      await fetchData();
      setShowModal(false);
      setEditingPeminjaman(null);
      setFormData({ id_pengguna: '', tanggal_kembali: '', status: 'aktif' });
      
      alert(`Peminjaman ${editingPeminjaman ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      console.error('Error saving peminjaman:', err);
      alert(`Failed to ${editingPeminjaman ? 'update' : 'create'} peminjaman`);
    }
  };

  const handleDelete = async (peminjamanId) => {
    if (!confirm('Are you sure you want to delete this peminjaman?')) return;

    try {
      const response = await fetch(`https://pweb-be-production.up.railway.app/peminjaman/${peminjamanId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete peminjaman');
      }

      await fetchData();
      alert('Peminjaman deleted successfully!');
    } catch (err) {
      console.error('Error deleting peminjaman:', err);
      alert('Failed to delete peminjaman');
    }
  };

  const handleEdit = (item) => {
    setEditingPeminjaman(item);
    setFormData({
      id_pengguna: item.id_pengguna?.toString() || '',
      tanggal_kembali: item.tanggal_kembali ? item.tanggal_kembali.split('T')[0] : '',
      status: item.status || 'aktif'
    });
    setShowModal(true);
  };

  const getUserName = (id_pengguna) => {
    const user = users.find(u => u.id_pengguna === id_pengguna);
    return user ? user.nama : `User ${id_pengguna}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
        return 'bg-blue-100 text-blue-800';
      case 'selesai':
        return 'bg-green-100 text-green-800';
      case 'terlambat':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
        return <Clock className="h-4 w-4" />;
      case 'selesai':
        return <CheckCircle className="h-4 w-4" />;
      case 'terlambat':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredPeminjaman = peminjaman.filter(item =>
    getUserName(item.id_pengguna).toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Peminjaman Management</h1>
              <p className="text-gray-600 mt-2">Manage borrowing transactions</p>
            </div>
            <button
              onClick={() => {
                setEditingPeminjaman(null);
                setFormData({ id_pengguna: '', tanggal_kembali: '', status: 'aktif' });
                setShowModal(true);
              }}
              className="bg-[#096b68] text-white px-4 py-2 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Peminjaman
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search peminjaman..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#096b68] focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Peminjaman Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#096b68]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pinjam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Kembali</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPeminjaman.map((item) => (
                    <tr key={item.id_peminjaman} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{item.id_peminjaman}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-[#096b68] rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {getUserName(item.id_pengguna)}
                            </div>
                            <div className="text-sm text-gray-500">ID: {item.id_pengguna}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.tanggal_pinjam ? new Date(item.tanggal_pinjam).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status || 'aktif'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-[#096b68] hover:text-[#004d49] mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_peminjaman)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingPeminjaman ? 'Edit Peminjaman' : 'Add New Peminjaman'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <select
                  value={formData.id_pengguna}
                  onChange={(e) => setFormData({...formData, id_pengguna: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#096b68] focus:border-transparent"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id_pengguna} value={user.id_pengguna}>
                      {user.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kembali</label>
                <input
                  type="date"
                  value={formData.tanggal_kembali}
                  onChange={(e) => setFormData({...formData, tanggal_kembali: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#096b68] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#096b68] focus:border-transparent"
                >
                  <option value="aktif">Aktif</option>
                  <option value="selesai">Selesai</option>
                  <option value="terlambat">Terlambat</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#096b68] text-white rounded-lg hover:bg-[#004d49]"
                >
                  {editingPeminjaman ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPeminjaman;
