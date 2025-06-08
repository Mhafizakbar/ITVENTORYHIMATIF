import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FormModal, { FormInput, FormSelect, FormTextarea } from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import AlertModal from '../../components/AlertModal';
import { useModal, useAlert, useConfirm } from '../../hooks/useModal';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ClipboardList,
  Package,
  Hash,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';

const AdminDetailPeminjaman = () => {
  const [details, setDetails] = useState([]);
  const [peminjaman, setPeminjaman] = useState([]);
  const [barang, setBarang] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDetail, setEditingDetail] = useState(null);
  const [formData, setFormData] = useState({
    id_peminjaman: '',
    id_barang: '',
    jumlah_pinjam: '',
    keterangan: ''
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

      const [detailRes, peminjamanRes, barangRes, usersRes] = await Promise.all([
        fetch('https://pweb-be-production.up.railway.app/detail', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://pweb-be-production.up.railway.app/peminjaman', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://pweb-be-production.up.railway.app/barang', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://pweb-be-production.up.railway.app/user', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      const detailData = detailRes.ok ? await detailRes.json() : [];
      const peminjamanData = peminjamanRes.ok ? await peminjamanRes.json() : [];
      const barangData = barangRes.ok ? await barangRes.json() : [];
      const usersData = usersRes.ok ? await usersRes.json() : [];

      setDetails(Array.isArray(detailData) ? detailData : []);
      setPeminjaman(Array.isArray(peminjamanData) ? peminjamanData : []);
      setBarang(Array.isArray(barangData) ? barangData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const url = editingDetail
        ? `https://pweb-be-production.up.railway.app/detail/${editingDetail.id_detail}`
        : 'https://pweb-be-production.up.railway.app/detail';

      const method = editingDetail ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id_peminjaman: parseInt(formData.id_peminjaman),
          id_barang: parseInt(formData.id_barang),
          jumlah_pinjam: parseInt(formData.jumlah_pinjam)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingDetail ? 'update' : 'create'} detail`);
      }

      await fetchData();
      modal.closeModal();
      setEditingDetail(null);
      setFormData({ id_peminjaman: '', id_barang: '', jumlah_pinjam: '', keterangan: '' });

      alert.showSuccess(
        'Success!',
        `Detail ${editingDetail ? 'updated' : 'created'} successfully!`
      );
    } catch (err) {
      console.error('Error saving detail:', err);
      alert.showError(
        'Error!',
        `Failed to ${editingDetail ? 'update' : 'create'} detail`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (detailId, barangName) => {
    confirm.showConfirm(
      'Delete Detail',
      `Are you sure you want to delete detail for "${barangName}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`https://pweb-be-production.up.railway.app/detail/${detailId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!response.ok) {
            throw new Error('Failed to delete detail');
          }

          await fetchData();
          alert.showSuccess('Success!', 'Detail deleted successfully!');
        } catch (err) {
          console.error('Error deleting detail:', err);
          alert.showError('Error!', 'Failed to delete detail');
        }
      },
      'danger'
    );
  };

  const handleEdit = (item) => {
    setEditingDetail(item);
    setFormData({
      id_peminjaman: item.id_peminjaman?.toString() || '',
      id_barang: item.id_barang?.toString() || '',
      jumlah_pinjam: item.jumlah_pinjam?.toString() || '',
      keterangan: item.keterangan || ''
    });
    modal.openModal();
  };

  const handleAddNew = () => {
    setEditingDetail(null);
    setFormData({ id_peminjaman: '', id_barang: '', jumlah_pinjam: '', keterangan: '' });
    modal.openModal();
  };

  const getBarangName = (id_barang) => {
    const item = barang.find(b => b.id_barang === id_barang);
    return item ? item.nama_barang : `Barang ${id_barang}`;
  };

  const getUserName = (id_pengguna) => {
    const user = users.find(u => u.id_pengguna === id_pengguna || u.id === id_pengguna);
    return user ? user.nama_lengkap || user.nama : `User ${id_pengguna}`;
  };

  const getPeminjamanInfo = (id_peminjaman) => {
    const pinjam = peminjaman.find(p => p.id_peminjaman === id_peminjaman);
    if (pinjam) {
      const userName = getUserName(pinjam.id_pengguna);
      return {
        id: pinjam.id_peminjaman,
        userName: userName,
        userId: pinjam.id_pengguna
      };
    }
    return {
      id: id_peminjaman,
      userName: `User Unknown`,
      userId: null
    };
  };

  const filteredDetails = details.filter(item => {
    const peminjamanInfo = getPeminjamanInfo(item.id_peminjaman);
    return (
      getBarangName(item.id_barang).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peminjamanInfo.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id_detail?.toString().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detail Peminjaman Management</h1>
              <p className="text-gray-600 mt-2">Manage borrowing details</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-[#096b68] text-white px-4 py-2 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Detail
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by user name, item name, or notes..."
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

        {/* Details Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Detail</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peminjaman & User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDetails.map((item) => (
                    <tr key={item.id_detail} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{item.id_detail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              #{getPeminjamanInfo(item.id_peminjaman).id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getPeminjamanInfo(item.id_peminjaman).userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-[#096b68] rounded-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {getBarangName(item.id_barang)}
                            </div>
                            <div className="text-sm text-gray-500">ID: {item.id_barang}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {item.jumlah_pinjam}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {item.keterangan || '-'}
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
                          onClick={() => handleDelete(item.id_detail, getBarangName(item.id_barang))}
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
        title={editingDetail ? 'Edit Detail' : 'Add New Detail'}
        onSubmit={handleSubmit}
        submitText={editingDetail ? 'Update' : 'Create'}
        loading={submitLoading}
        size="lg"
      >
        <FormSelect
          label="Peminjaman"
          value={formData.id_peminjaman}
          onChange={(e) => setFormData({...formData, id_peminjaman: e.target.value})}
          required
        >
          <option value="">Select Peminjaman</option>
          {peminjaman.map((pinjam) => (
            <option key={pinjam.id_peminjaman} value={pinjam.id_peminjaman}>
              #{pinjam.id_peminjaman} - {getUserName(pinjam.id_pengguna)}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          label="Barang"
          value={formData.id_barang}
          onChange={(e) => setFormData({...formData, id_barang: e.target.value})}
          required
        >
          <option value="">Select Barang</option>
          {barang.map((item) => (
            <option key={item.id_barang} value={item.id_barang}>
              {item.nama_barang}
            </option>
          ))}
        </FormSelect>

        <FormInput
          label="Jumlah Pinjam"
          type="number"
          value={formData.jumlah_pinjam}
          onChange={(e) => setFormData({...formData, jumlah_pinjam: e.target.value})}
          required
          min="1"
        />

        <FormTextarea
          label="Keterangan"
          value={formData.keterangan}
          onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
          rows="3"
          placeholder="Optional notes..."
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

export default AdminDetailPeminjaman;
