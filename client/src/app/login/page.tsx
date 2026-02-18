'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);

      if (data.role === 'admin') {
        router.push('/admin');
      } else if (data.role === 'sales_user') {
        router.push('/sales_user');
      } else {
        setError('Invalid user role');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
    style={{ backgroundImage: "url('/login-bg.jpg')" }}
  >
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/60"></div>

    <Card className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl border-0 rounded-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-semibold text-center tracking-tight text-indigo-600 drop-shadow-sm">
  Sales Dashboard
</CardTitle>


        <CardDescription className="text-center text-sm text-muted-foreground">
          Sign in to continue to your sales dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <p className="text-red-600 text-sm text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            className="w-full h-11 text-base font-medium"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Protected access • Authorized users only
          </p>
        </form>
      </CardContent>
    </Card>
  </div>
);

}
