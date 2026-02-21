import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Mail, Lock, User } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signUp(email, password, name);
      if (error) setError(error);
      else setSuccessMsg('Check your email for a verification link!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand mb-4">
            <Music className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">SoundWave</h1>
          <p className="text-muted-foreground mt-2">Your music, everywhere</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <div className="flex rounded-xl bg-secondary p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none transition-colors"
                  required={!isLogin}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none transition-colors"
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}
            {successMsg && (
              <p className="text-primary text-sm text-center">{successMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-brand text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
