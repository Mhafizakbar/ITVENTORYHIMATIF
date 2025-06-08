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
  Package,
  Tag,
  Hash,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';

const AdminBarang = () => {
  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBarang, setEditingBarang] = useState(null);
  const [formData, setFormData] = useState({
    nama_barang: '',
    id_kategori: '',
    jumlah: '',
    deskripsi: ''
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
      
      const [barangRes, kategoriRes] = await Promise.all([
        fetch('https://pweb-be-production.up.railway.app/barang', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://pweb-be-production.up.railway.app/kategori', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      if (!barangRes.ok || !kategoriRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const barangData = await barangRes.json();
      const kategoriData = await kategoriRes.json();
      
      setBarang(Array.isArray(barangData) ? barangData : []);
      setKategori(Array.isArray(kategoriData) ? kategoriData : []);
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
      const url = editingBarang
        ? `https://pweb-be-production.up.railway.app/barang/${editingBarang.id_barang}`
        : 'https://pweb-be-production.up.railway.app/barang';

      const method = editingBarang ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id_kategori: parseInt(formData.id_kategori),
          jumlah: parseInt(formData.jumlah)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingBarang ? 'update' : 'create'} barang`);
      }

      await fetchData();
      modal.closeModal();
      setEditingBarang(null);
      setFormData({ nama_barang: '', id_kategori: '', jumlah: '', deskripsi: '' });

      alert.showSuccess(
        'Success!',
        `Barang ${editingBarang ? 'updated' : 'created'} successfully!`
      );
    } catch (err) {
      console.error('Error saving barang:', err);
      alert.showError(
        'Error!',
        `Failed to ${editingBarang ? 'update' : 'create'} barang`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (barangId, barangName) => {
    confirm.showConfirm(
      'Delete Barang',
      `Are you sure you want to delete "${barangName}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`https://pweb-be-production.up.railway.app/barang/${barangId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!response.ok) {
            throw new Error('Failed to delete barang');
          }

          await fetchData();
          alert.showSuccess('Success!', 'Barang deleted successfully!');
        } catch (err) {
          console.error('Error deleting barang:', err);
          alert.showError('Error!', 'Failed to delete barang');
        }
      },
      'danger'
    );
  };

  const handleEdit = (item) => {
    setEditingBarang(item);
    setFormData({
      nama_barang: item.nama_barang || '',
      id_kategori: item.id_kategori?.toString() || '',
      jumlah: item.jumlah?.toString() || '',
      deskripsi: item.deskripsi || ''
    });
    modal.openModal();
  };

  const handleAddNew = () => {
    setEditingBarang(null);
    setFormData({ nama_barang: '', id_kategori: '', jumlah: '', deskripsi: '' });
    modal.openModal();
  };

  const getKategoriName = (id_kategori) => {
    const kat = kategori.find(k => k.id_kategori === id_kategori);
    return kat ? kat.nama_kategori : 'Unknown';
  };

  const filteredBarang = barang.filter(item =>
    item.nama_barang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getKategoriName(item.id_kategori).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Barang Management</h1>
              <p className="text-gray-600 mt-2">Manage inventory items</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-[#096b68] text-white px-4 py-2 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Barang
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search barang..."
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

        {/* Barang Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBarang.map((item) => (
                    <tr key={item.id_barang} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-[#096b68] rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.nama_barang}</div>
                            <div className="text-sm text-gray-500">ID: {item.id_barang}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getKategoriName(item.id_kategori)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.jumlah}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {item.deskripsi || '-'}
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
                          onClick={() => handleDelete(item.id_barang, item.nama_barang)}
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
        title={editingBarang ? 'Edit Barang' : 'Add New Barang'}
        onSubmit={handleSubmit}
        submitText={editingBarang ? 'Update' : 'Create'}
        loading={submitLoading}
      >
        <FormInput
          label="Nama Barang"
          type="text"
          value={formData.nama_barang}
          onChange={(e) => setFormData({...formData, nama_barang: e.target.value})}
          required
        />

        <FormSelect
          label="Kategori"
          value={formData.id_kategori}
          onChange={(e) => setFormData({...formData, id_kategori: e.target.value})}
          required
        >
          <option value="">Select Kategori</option>
          {kategori.map((kat) => (
            <option key={kat.id_kategori} value={kat.id_kategori}>
              {kat.nama_kategori}
            </option>
          ))}
        </FormSelect>

        <FormInput
          label="Jumlah"
          type="number"
          value={formData.jumlah}
          onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
          required
          min="0"
        />

        <FormTextarea
          label="Deskripsi"
          value={formData.deskripsi}
          onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
          rows="3"
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

export default AdminBarang;
