import { useState } from 'react';
import { Home, User, Building2, Loader2 } from 'lucide-react';
import { auth } from '../services/database';

export type UserType = 'owner' | 'tenant';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  type: UserType;
};

type SignInProps = {
  onSignIn: (user: AuthUser) => void;
};

export function SignIn({ onSignIn }: SignInProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [userType, setUserType] = useState<UserType>('tenant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (mode === 'signup') {
        // Sign up with Supabase
        const { user } = await auth.signUp(
          formData.email,
          formData.password,
          formData.name,
          userType
        );
        
        if (user) {
          const authUser: AuthUser = {
            id: user.id,
            name: formData.name,
            email: formData.email,
            type: userType,
          };
          onSignIn(authUser);
        }
      } else {
        // Sign in with Supabase
        const { user } = await auth.signIn(formData.email, formData.password);
        
        if (user) {
          const authUser: AuthUser = {
            id: user.id,
            name: user.user_metadata?.name || formData.email.split('@')[0],
            email: user.email || formData.email,
            type: (user.user_metadata?.user_type as UserType) || 'tenant',
          };
          onSignIn(authUser);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">SewaSecure</h1>
          <p className="text-gray-600">Secure Renting Process Platform</p>
        </div>

        {/* Sign In/Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-gray-900 mb-6 text-center">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create Your Account'}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setUserType('tenant')}
              className={`p-4 border-2 rounded-xl transition-all ${
                userType === 'tenant'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className={`w-6 h-6 mx-auto mb-2 ${userType === 'tenant' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <p className={`text-sm ${userType === 'tenant' ? 'text-indigo-900' : 'text-gray-600'}`}>
                Tenant
              </p>
            </button>

            <button
              type="button"
              onClick={() => setUserType('owner')}
              className={`p-4 border-2 rounded-xl transition-all ${
                userType === 'owner'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 className={`w-6 h-6 mx-auto mb-2 ${userType === 'owner' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <p className={`text-sm ${userType === 'owner' ? 'text-indigo-900' : 'text-gray-600'}`}>
                Owner
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mt-6 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Sign Up'} as {userType === 'tenant' ? 'Tenant' : 'Owner'}
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            {mode === 'signin' ? "Don't have an account? Click Sign Up above" : 'Already have an account? Click Sign In above'}
          </p>
        </div>
      </div>
    </div>
  );
}
