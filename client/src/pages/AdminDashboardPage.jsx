import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/navbar';

const AdminDashboardPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (genderFilter) params.gender = genderFilter;
      if (search) params.search = search;
      const res = await api.get('/submissions', { params });
      setSubmissions(res.data.submissions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [genderFilter, search]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this submission?')) return;
    try {
      await api.delete(`/submissions/${id}`);
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (submission) => {
    setEditingId(submission._id);
    setEditForm({
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      gender: submission.gender,
      mobileNumber: submission.mobileNumber,
      address: submission.address,
      feedback: submission.feedback || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/submissions/${id}`, editForm);
      setSubmissions((prev) => prev.map((s) => (s._id === id ? res.data.submission : s)));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm"
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            type="text"
            placeholder="Search by first or last name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm flex-1 min-w-[200px]"
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg px-4 py-2 mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-800 text-slate-400">
                <tr>
                  <th className="text-left px-4 py-3">First Name</th>
                  <th className="text-left px-4 py-3">Last Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Gender</th>
                  <th className="text-left px-4 py-3">Mobile</th>
                  <th className="text-left px-4 py-3">Address</th>
                  <th className="text-left px-4 py-3">Created By</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-slate-500 px-4 py-6">
                      No submissions found.
                    </td>
                  </tr>
                )}
                {submissions.map((s) => (
                  <tr key={s._id} className="border-t border-slate-700">
                    {editingId === s._id ? (
                      <>
                        <td className="px-4 py-2">
                          <input name="firstName" value={editForm.firstName} onChange={handleEditChange}
                            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-full" />
                        </td>
                        <td className="px-4 py-2">
                          <input name="lastName" value={editForm.lastName} onChange={handleEditChange}
                            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-full" />
                        </td>
                        <td className="px-4 py-2">
                          <input name="email" value={editForm.email} onChange={handleEditChange}
                            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-full" />
                        </td>
                        <td className="px-4 py-2">
                          <select name="gender" value={editForm.gender} onChange={handleEditChange}
                            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-full">
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input name="mobileNumber" value={editForm.mobileNumber} onChange={handleEditChange}
                            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-full" />
                        </td>
                        <td className="px-4 py-2">
                          <input name="address" value={editForm.address} onChange={handleEditChange}
                            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-full" />
                        </td>
                        <td className="px-4 py-2 text-slate-500">
                          {s.userCreated?.email || '—'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button onClick={() => saveEdit(s._id)} className="text-green-400 hover:underline mr-3">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="text-slate-400 hover:underline">
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2">{s.firstName}</td>
                        <td className="px-4 py-2">{s.lastName}</td>
                        <td className="px-4 py-2">{s.email}</td>
                        <td className="px-4 py-2">{s.gender}</td>
                        <td className="px-4 py-2">{s.mobileNumber}</td>
                        <td className="px-4 py-2 max-w-[200px] truncate">{s.address}</td>
                        <td className="px-4 py-2 text-slate-500">{s.userCreated?.email || '—'}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button onClick={() => startEdit(s)} className="text-blue-400 hover:underline mr-3">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(s._id)} className="text-red-400 hover:underline">
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;