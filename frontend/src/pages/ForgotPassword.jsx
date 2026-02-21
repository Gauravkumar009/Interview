import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      
      await api.post('/auth/forgot-password', { email });
      setMessage('If an account exists, a reset link has been sent to your email.');
    } catch (err) {
      console.error("Forgot Password Error:", err);
      const msg = err.response?.data?.message || err.message || 'Failed to request password reset.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-xl shadow-lg">
        <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground mt-2">Enter your email to receive reset instructions.</p>
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
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
