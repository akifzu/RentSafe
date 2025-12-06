import { User, Mail, Building2, Calendar, FileText, Edit2, Save, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import type { AuthUser } from './SignIn';
import type { Property, MoveInReportType, UtilityReading } from '../App';

type ProfileProps = {
  user: AuthUser;
  properties: Property[];
  reports: MoveInReportType[];
  utilities: UtilityReading[];
  onUpdateProfile: (user: AuthUser) => void;
  onSignOut: () => void;
};

export function Profile({ user, properties, reports, utilities, onUpdateProfile, onSignOut }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const handleSave = () => {
    onUpdateProfile({
      ...user,
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
  };

  const activeProperties = properties.filter(p => p.status === 'active').length;
  const pendingProperties = properties.filter(p => p.status === 'pending').length;
  const totalUtilityPayments = utilities.reduce((acc, u) => acc + u.water + u.electricity + u.rent, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20 md:pb-8 md:pt-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            type="button"
            style={{ backgroundColor: '#dc2626' }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative"></div>
          
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 mb-6 gap-4 relative z-10">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0">
                <div className="w-28 h-28 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-14 h-14 text-indigo-600" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>{user.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Account Type</label>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    user.type === 'tenant' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {user.type === 'tenant' ? (
                      <User className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Building2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 capitalize">{user.type}</p>
                    <p className="text-sm text-gray-500">
                      {user.type === 'tenant' ? 'Can create and manage rental properties' : 'Can view and manage property rentals'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Member Since</label>
                <div className="flex items-center gap-3 text-gray-900">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-gray-900 mb-6">Activity Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <FileText className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl text-indigo-900 mb-1">{properties.length}</p>
              <p className="text-sm text-indigo-600">Total Properties</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Building2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl text-green-900 mb-1">{activeProperties}</p>
              <p className="text-sm text-green-600">Active Rentals</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Calendar className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl text-yellow-900 mb-1">{pendingProperties}</p>
              <p className="text-sm text-yellow-600">Pending Actions</p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        {user.type === 'tenant' && utilities.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-gray-900 mb-6">Financial Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Payments Made</span>
                <span className="text-xl text-gray-900">${totalUtilityPayments.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Payment Records</span>
                <span className="text-xl text-gray-900">{utilities.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Average Payment</span>
                <span className="text-xl text-gray-900">
                  ${utilities.length > 0 ? (totalUtilityPayments / utilities.length).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
