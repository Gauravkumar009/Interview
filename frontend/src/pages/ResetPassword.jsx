import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import api from '../services/api';

const ResetPassword = () => {
  const { resettoken } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setLoading(true);
    try {
      const { data } = await api.put(`/auth/reset-password/${resettoken}`, { password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
          navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold flex justify-center items-center gap-2">
            <Lock size={24} /> Reset Password
          </h1>
          <p className="text-muted-foreground mt-2">Enter your new password below.</p>
        </div>

        {message && (
          <div className="bg-green-500/10 text-green-500 text-sm p-3 rounded-lg mb-4 text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              required
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
