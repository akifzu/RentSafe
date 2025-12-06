import { useState } from 'react';
import { Home, User, Building2 } from 'lucide-react';

export type UserType = 'owner' | 'tenant';

export type AuthUser = {
  name: string;
  email: string;
  type: UserType;
};

type SignInProps = {
  onSignIn: (user: AuthUser) => void;
};

export function SignIn({ onSignIn }: SignInProps) {
  const [userType, setUserType] = useState<UserType>('tenant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user: AuthUser = {
      name: formData.name,
      email: formData.email,
      type: userType,
    };
    
    onSignIn(user);
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

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-gray-900 mb-6 text-center">Sign In to Your Account</h2>

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
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mt-6"
            >
              Sign In as {userType === 'tenant' ? 'Tenant' : 'Owner'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Demo mode - No real authentication required
          </p>
        </div>
      </div>
    </div>
  );
}
