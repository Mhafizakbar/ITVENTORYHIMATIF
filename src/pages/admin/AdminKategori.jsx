import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FormModal, { FormInput } from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import AlertModal from '../../components/AlertModal';
import { useModal, useAlert, useConfirm } from '../../hooks/useModal';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  Hash,
  Loader2,
  AlertCircle
} from 'lucide-react';

const AdminKategori = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingKategori, setEditingKategori] = useState(null);
  const [formData, setFormData] = useState({
    nama_kategori: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal hooks
  const modal = useModal();
  const alert = useAlert();
  const confirm = useConfirm();

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://pweb-be-production.up.railway.app/kategori', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch kategori');
      }

      const data = await response.json();
      setKategori(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching kategori:', err);
      setError('Failed to load kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const url = editingKategori
        ? `https://pweb-be-production.up.railway.app/kategori/${editingKategori.id_kategori}`
        : 'https://pweb-be-production.up.railway.app/kategori';

      const method = editingKategori ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingKategori ? 'update' : 'create'} kategori`);
      }

      await fetchKategori();
      modal.closeModal();
      setEditingKategori(null);
      setFormData({ nama_kategori: '' });

      alert.showSuccess(
        'Success!',
        `Kategori ${editingKategori ? 'updated' : 'created'} successfully!`
      );
    } catch (err) {
      console.error('Error saving kategori:', err);
      alert.showError(
        'Error!',
        `Failed to ${editingKategori ? 'update' : 'create'} kategori`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (kategoriId, kategoriName) => {
    confirm.showConfirm(
      'Delete Kategori',
      `Are you sure you want to delete "${kategoriName}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`https://pweb-be-production.up.railway.app/kategori/${kategoriId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!response.ok) {
            throw new Error('Failed to delete kategori');
          }

          await fetchKategori();
          alert.showSuccess('Success!', 'Kategori deleted successfully!');
        } catch (err) {
          console.error('Error deleting kategori:', err);
          alert.showError('Error!', 'Failed to delete kategori');
        }
      },
      'danger'
    );
  };

  const handleEdit = (item) => {
    setEditingKategori(item);
    setFormData({
      nama_kategori: item.nama_kategori || ''
    });
    modal.openModal();
  };

  const handleAddNew = () => {
    setEditingKategori(null);
    setFormData({ nama_kategori: '' });
    modal.openModal();
  };

  const filteredKategori = kategori.filter(item =>
    item.nama_kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kategori Management</h1>
              <p className="text-gray-600 mt-2">Manage item categories</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-[#096b68] text-white px-4 py-2 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Kategori
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search kategori..."
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

        {/* Kategori Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#096b68]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredKategori.map((item) => (
                <div key={item.id_kategori} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-[#096b68] rounded-full flex items-center justify-center">
                      <Tag className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-[#096b68] hover:text-[#004d49] p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id_kategori, item.nama_kategori)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.nama_kategori}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Hash className="h-4 w-4 mr-1" />
                      ID: {item.id_kategori}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredKategori.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No kategori found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Kategori Table (Alternative view) */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Kategori List</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-[#096b68]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredKategori.map((item) => (
                    <tr key={item.id_kategori} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.id_kategori}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-[#096b68] rounded-full flex items-center justify-center mr-3">
                            <Tag className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.nama_kategori}
                          </div>
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
                          onClick={() => handleDelete(item.id_kategori, item.nama_kategori)}
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
        title={editingKategori ? 'Edit Kategori' : 'Add New Kategori'}
        onSubmit={handleSubmit}
        submitText={editingKategori ? 'Update' : 'Create'}
        loading={submitLoading}
      >
        <FormInput
          label="Nama Kategori"
          type="text"
          value={formData.nama_kategori}
          onChange={(e) => setFormData({...formData, nama_kategori: e.target.value})}
          required
          placeholder="Enter kategori name"
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

export default AdminKategori;
