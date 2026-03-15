import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      toast.success('Signed in successfully');
      onLogin();
    } catch {
      setError('Invalid credentials');
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-col justify-center bg-black p-12 text-white lg:flex lg:w-1/2">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="mb-6 w-fit rounded-lg bg-white p-3 text-black text-2xl font-bold">
              PropTech
            </div>
            <h1 className="mb-4 text-4xl font-bold">Property Maintenance</h1>
            <p className="text-lg text-gray-400">
              Manage your properties, maintenance requests, and tasks with ease. A comprehensive solution
              for property management businesses.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              {
                title: 'Complete Maintenance Management',
                desc: 'Track and resolve issues efficiently',
              },
              {
                title: 'Real-time Task Tracking',
                desc: 'Monitor progress and updates instantly',
              },
              {
                title: 'Multi-Property Support',
                desc: 'Manage multiple properties from one dashboard',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-white/10 p-1">•</div>
                <div>
                  <h3 className="mb-1 font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="rounded-lg bg-black p-2 text-white text-sm font-bold">
              PT
            </div>
            <span className="text-xl font-bold">Property Maintenance</span>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="h-12 w-full bg-black text-base font-medium text-white hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

