import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FormModal, { FormInput, FormSelect } from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import AlertModal from '../../components/AlertModal';
import { useModal, useAlert, useConfirm } from '../../hooks/useModal';
import {
  getCurrentDate,
  getMinReturnDate,
  validateLoanDates,
  formatDateShort,
  getLoanStatus
} from '../../utils/dateUtils';
import { DateHeader } from '../../components/RealTimeDate';
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
  Eye,
  RotateCcw
} from 'lucide-react';

const AdminPeminjaman = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPeminjaman, setEditingPeminjaman] = useState(null);
  const [formData, setFormData] = useState({
    id_pengguna: '',
    tanggal_pinjam: getCurrentDate(),
    tanggal_kembali: '',
    status: 'aktif'
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal hooks
  const modal = useModal();
  const alert = useAlert();
  const confirm = useConfirm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const [peminjamanRes, usersRes] = await Promise.all([
        fetch('https://pweb-be-production.up.railway.app/peminjaman', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        }),
        fetch('https://pweb-be-production.up.railway.app/user', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        })
      ]);

      clearTimeout(timeoutId);

      const peminjamanData = peminjamanRes.ok ? await peminjamanRes.json() : [];
      const usersData = usersRes.ok ? await usersRes.json() : [];

      setPeminjaman(Array.isArray(peminjamanData) ? peminjamanData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);

    } catch (err) {
      console.error('Error fetching data:', err);

      let errorMessage = 'Failed to load data';
      if (err.name === 'AbortError') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const restoreStokBarang = async (id_peminjaman) => {
    try {
      // Ambil detail peminjaman untuk mendapatkan barang yang dipinjam
      const detailResponse = await fetch('https://pweb-be-production.up.railway.app/detail', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!detailResponse.ok) return;

      const detailData = await detailResponse.json();
      const peminjamanDetails = detailData.filter(detail => detail.id_peminjaman === id_peminjaman);

      // Ambil data barang untuk update stok
      const barangResponse = await fetch('https://pweb-be-production.up.railway.app/barang', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!barangResponse.ok) return;

      const barangData = await barangResponse.json();

      // Update stok untuk setiap barang yang dikembalikan
      for (const detail of peminjamanDetails) {
        const barang = barangData.find(b => b.id_barang === detail.id_barang);
        if (barang) {
          const newStok = barang.jumlah + detail.jumlah_pinjam;

          await fetch(`https://pweb-be-production.up.railway.app/barang/${detail.id_barang}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nama_barang: barang.nama_barang,
              id_kategori: barang.id_kategori,
              jumlah: newStok,
              deskripsi: barang.deskripsi || ''
            }),
          });
        }
      }
    } catch (error) {
      console.error('Error restoring stock:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const url = editingPeminjaman
        ? `https://pweb-be-production.up.railway.app/peminjaman/${editingPeminjaman.id_peminjaman}`
        : 'https://pweb-be-production.up.railway.app/peminjaman';

      const method = editingPeminjaman ? 'PUT' : 'POST';

      // Cek apakah status berubah menjadi "selesai" untuk mengembalikan stok
      const isStatusChangedToSelesai = editingPeminjaman &&
        (editingPeminjaman.status === 'dikembalikan' || editingPeminjaman.status === 'aktif' || editingPeminjaman.status === 'dipinjam' || editingPeminjaman.status === 'terlambat') &&
        formData.status === 'selesai';

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id_pengguna: parseInt(formData.id_pengguna)
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to ${editingPeminjaman ? 'update' : 'create'} peminjaman: ${response.status} ${errorText}`);
      }

      // Jika status berubah menjadi selesai, kembalikan stok
      if (isStatusChangedToSelesai) {
        await restoreStokBarang(editingPeminjaman.id_peminjaman);
      }

      await fetchData();
      modal.closeModal();
      setEditingPeminjaman(null);
      setFormData({ id_pengguna: '', tanggal_kembali: '', status: 'aktif' });

      const message = isStatusChangedToSelesai
        ? 'Peminjaman updated successfully! Stok barang telah dikembalikan.'
        : `Peminjaman ${editingPeminjaman ? 'updated' : 'created'} successfully!`;

      alert.showSuccess('Success!', message);
    } catch (err) {
      console.error('Error saving peminjaman:', err);

      let errorMessage = `Failed to ${editingPeminjaman ? 'update' : 'create'} peminjaman`;

      if (err.name === 'AbortError') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      alert.showError('Error!', errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (peminjamanId, userName) => {
    confirm.showConfirm(
      'Delete Peminjaman',
      `Are you sure you want to delete peminjaman for "${userName}"? This action cannot be undone.`,
      async () => {
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
          alert.showSuccess('Success!', 'Peminjaman deleted successfully!');
        } catch (err) {
          console.error('Error deleting peminjaman:', err);
          alert.showError('Error!', 'Failed to delete peminjaman');
        }
      },
      'danger'
    );
  };

  const handleEdit = (item) => {
    setEditingPeminjaman(item);
    setFormData({
      id_pengguna: item.id_pengguna?.toString() || '',
      tanggal_pinjam: item.tanggal_pinjam ? item.tanggal_pinjam.split('T')[0] : getCurrentDate(),
      tanggal_kembali: item.tanggal_kembali ? item.tanggal_kembali.split('T')[0] : '',
      status: item.status || 'aktif'
    });
    modal.openModal();
  };

  const handleAddNew = () => {
    setEditingPeminjaman(null);
    const today = getCurrentDate();
    setFormData({
      id_pengguna: '',
      tanggal_pinjam: today,
      tanggal_kembali: '',
      status: 'aktif'
    });
    modal.openModal();
  };

  const getUserName = (id_pengguna) => {
    const user = users.find(u => u.id_pengguna === id_pengguna || u.id === id_pengguna);
    return user ? (user.nama_lengkap || user.nama) : `User ${id_pengguna}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
      case 'dipinjam':
        return 'bg-blue-100 text-blue-800';
      case 'selesai':
        return 'bg-green-100 text-green-800';
      case 'dikembalikan':
        return 'bg-purple-100 text-purple-800';
      case 'terlambat':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
      case 'dipinjam':
        return <Clock className="h-4 w-4" />;
      case 'selesai':
        return <CheckCircle className="h-4 w-4" />;
      case 'dikembalikan':
        return <RotateCcw className="h-4 w-4" />;
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Peminjaman Management</h1>
              <p className="text-gray-600 mt-2">Manage borrowing transactions</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Real-time date display */}
              <DateHeader />

              <button
                onClick={handleAddNew}
                className="bg-[#096b68] text-white px-4 py-2 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Peminjaman
              </button>
            </div>
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
                        {formatDateShort(item.tanggal_pinjam, true)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateShort(item.tanggal_kembali, true)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{item.status || 'aktif'}</span>
                          </span>
                          {item.status === 'dikembalikan' && (
                            <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
                              🔄 User sudah mengembalikan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-[#096b68] hover:text-[#004d49] mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_peminjaman, getUserName(item.id_pengguna))}
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

      {/* Form Modal */}
      <FormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={editingPeminjaman ? 'Edit Peminjaman' : 'Add New Peminjaman'}
        onSubmit={handleSubmit}
        submitText={editingPeminjaman ? 'Update' : 'Create'}
        loading={submitLoading}
      >
        <FormSelect
          label="User"
          value={formData.id_pengguna}
          onChange={(e) => setFormData({...formData, id_pengguna: e.target.value})}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id_pengguna || user.id} value={user.id_pengguna || user.id}>
              {user.nama_lengkap || user.nama}
            </option>
          ))}
        </FormSelect>

        <FormInput
          label="Tanggal Peminjaman"
          type="date"
          value={formData.tanggal_pinjam}
          onChange={(e) => setFormData({...formData, tanggal_pinjam: e.target.value})}
          required
        />

        <FormInput
          label="Tanggal Kembali"
          type="date"
          value={formData.tanggal_kembali}
          onChange={(e) => setFormData({...formData, tanggal_kembali: e.target.value})}
          min={getMinReturnDate(formData.tanggal_pinjam)}
          required
        />

        <FormSelect
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="aktif">Aktif (Sedang Dipinjam)</option>
          <option value="dipinjam">Dipinjam (Sedang Dipinjam)</option>
          <option value="dikembalikan">Dikembalikan (User sudah mengembalikan)</option>
          <option value="selesai">Selesai (Peminjaman Selesai)</option>
          <option value="terlambat">Terlambat</option>
        </FormSelect>
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
        confirmText="Delete"
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
    </AdminLayout>
  );
};

export default AdminPeminjaman;
