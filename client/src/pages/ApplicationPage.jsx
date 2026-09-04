import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  mobileNumber: '',
  address: '',
  feedback: '',
};

const ApplicationPage = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/submissions', form);
      setSuccess('Submission received. Thank you!');
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-lg flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Application Form</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{user?.email}</span>
          <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white underline">
            Logout
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-lg">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg px-4 py-2 mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 rounded-lg px-4 py-2 mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">First Name</label>
              <input
                type="text" name="firstName" required
                value={form.firstName} onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Last Name</label>
              <input
                type="text" name="lastName" required
                value={form.lastName} onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Gender</label>
            <select
              name="gender" required
              value={form.gender} onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Mobile Number</label>
            <input
              type="text" name="mobileNumber" required
              value={form.mobileNumber} onChange={handleChange}
              placeholder="07XXXXXXXX"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Address</label>
            <textarea
              name="address" required rows={2}
              value={form.address} onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Feedback (optional)</label>
            <textarea
              name="feedback" rows={2}
              value={form.feedback} onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg py-2 font-medium"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationPage;