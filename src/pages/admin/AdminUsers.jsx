import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import FormModal, { FormInput, FormSelect } from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import AlertModal from '../../components/AlertModal';
import { useModal, useAlert, useConfirm } from '../../hooks/useModal';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    no_telepon: '',
    role: 'user'
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal hooks
  const modal = useModal();
  const alert = useAlert();
  const confirm = useConfirm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try multiple endpoints to get user data
      let response;
      let userData = [];

      // First try the main user endpoint
      try {
        response = await fetch('https://pweb-be-production.up.railway.app/user', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        // Check for 401 errors first
        if (response.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          setError('Sesi tidak valid. Silakan login kembali.');
          navigate('/');
          return;
        }

        if (response.ok) {
          userData = await response.json();
          console.log('User data from /user endpoint:', userData);
        }
      } catch (err) {
        console.log('Failed to fetch from /user endpoint:', err);
      }

      // If no data or empty, try alternative endpoints
      if (!userData || !Array.isArray(userData) || userData.length === 0) {
        try {
          // Try getting users from peminjaman data (users who have made loans)
          const peminjamanResponse = await fetch('https://pweb-be-production.up.railway.app/peminjaman', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });

          if (peminjamanResponse.ok) {
            const peminjamanData = await peminjamanResponse.json();
            console.log('Peminjaman data for user extraction:', peminjamanData);

            // Extract unique users from peminjaman data
            const userMap = new Map();
            if (Array.isArray(peminjamanData)) {
              peminjamanData.forEach(peminjaman => {
                if (peminjaman.id_pengguna && !userMap.has(peminjaman.id_pengguna)) {
                  userMap.set(peminjaman.id_pengguna, {
                    id_pengguna: peminjaman.id_pengguna,
                    nama_lengkap: peminjaman.nama_peminjam || peminjaman.nama || 'User',
                    email: `user${peminjaman.id_pengguna}@example.com`, // Placeholder
                    no_telepon: peminjaman.no_telepon || '-',
                    role: 'user',
                    created_at: peminjaman.tanggal_pinjam || peminjaman.created_at
                  });
                }
              });
            }
            userData = Array.from(userMap.values());
            console.log('Extracted users from peminjaman:', userData);
          }
        } catch (err) {
          console.log('Failed to extract users from peminjaman:', err);
        }
      }

      // Process data to ensure all fields are available
      // Based on register endpoint structure: nama_lengkap, email, no_telepon
      const processedUsers = Array.isArray(userData) ? userData.map(user => ({
        id_pengguna: user.id_pengguna || user.id,
        nama: user.nama_lengkap || user.nama || user.name || 'N/A',
        email: user.email || 'N/A',
        no_telepon: user.no_telepon || user.phone || user.telepon || '-',
        role: user.role || 'user',
        created_at: user.created_at || user.createdAt || user.tanggal_dibuat || user.tanggal_daftar || user.tanggal_pinjam || null
      })) : [];

      console.log('Final processed user data:', processedUsers); // Debug log
      setUsers(processedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Using mock data for demo.');
      // Mock data for demonstration with proper structure
      setUsers([
        {
          id_pengguna: 1,
          nama: 'Admin User',
          email: 'admin@example.com',
          no_telepon: '081234567890',
          role: 'admin',
          created_at: '2024-01-01'
        },
        {
          id_pengguna: 2,
          nama: 'Regular User',
          email: 'user@example.com',
          no_telepon: '081234567891',
          role: 'user',
          created_at: '2024-01-02'
        },
        {
          id_pengguna: 3,
          nama: 'Test User',
          email: 'test@example.com',
          no_telepon: '081234567892',
          role: 'user',
          created_at: '2024-01-03'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const url = editingUser
        ? `https://pweb-be-production.up.railway.app/user/${editingUser.id_pengguna}`
        : 'https://pweb-be-production.up.railway.app/user';

      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        alert.showError('Session Expired', 'Sesi Anda telah berakhir. Silakan login ulang.');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to ${editingUser ? 'update' : 'create'} user`);
      }

      await fetchUsers();
      modal.closeModal();
      setEditingUser(null);
      setFormData({ nama_lengkap: '', email: '', password: '', no_telepon: '', role: 'user' });

      alert.showSuccess(
        'Success!',
        `User ${editingUser ? 'updated' : 'created'} successfully!`
      );
    } catch (err) {
      console.error('Error saving user:', err);
      alert.showError(
        'Error!',
        `Failed to ${editingUser ? 'update' : 'create'} user`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (userId, userName) => {
    confirm.showConfirm(
      'Delete User',
      `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`https://pweb-be-production.up.railway.app/user/${userId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });

          if (response.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            alert.showError('Session Expired', 'Sesi Anda telah berakhir. Silakan login ulang.');
            setTimeout(() => navigate('/'), 2000);
            return;
          }

          if (!response.ok) {
            throw new Error('Failed to delete user');
          }

          await fetchUsers();
          alert.showSuccess('Success!', 'User deleted successfully!');
        } catch (err) {
          console.error('Error deleting user:', err);
          alert.showError('Error!', 'Failed to delete user');
        }
      },
      'danger'
    );
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nama_lengkap: user.nama || '',
      email: user.email || '',
      password: '',
      no_telepon: user.no_telepon || '',
      role: user.role || 'user'
    });
    modal.openModal();
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setFormData({ nama_lengkap: '', email: '', password: '', no_telepon: '', role: 'user' });
    modal.openModal();
  };

  const filteredUsers = users.filter(user =>
    user.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">Manage system users</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-[#096b68] text-white px-4 py-2 rounded-lg hover:bg-[#004d49] transition-colors duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Cari user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#096b68] focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
            <span className="text-yellow-700">{error}</span>
          </div>
        )}

        {/* Users Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id_pengguna} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-[#096b68] rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.nama}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.no_telepon || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-[#096b68] hover:text-[#004d49] mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id_pengguna, user.nama)}
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
        title={editingUser ? 'Edit User' : 'Add New User'}
        onSubmit={handleSubmit}
        submitText={editingUser ? 'Update' : 'Create'}
        loading={submitLoading}
      >
        <FormInput
          label="Full Name"
          type="text"
          value={formData.nama_lengkap}
          onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
          required
        />

        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />

        <FormInput
          label={`Password ${editingUser ? '(leave blank to keep current)' : ''}`}
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required={!editingUser}
        />

        <FormInput
          label="Phone"
          type="text"
          value={formData.no_telepon}
          onChange={(e) => setFormData({...formData, no_telepon: e.target.value})}
        />

        <FormSelect
          label="Role"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
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

export default AdminUsers;
