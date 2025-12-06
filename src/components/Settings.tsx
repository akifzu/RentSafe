import { Bell, Lock, Globe, Moon, Shield, HelpCircle, FileText, ChevronRight, Toggle } from 'lucide-react';
import { useState } from 'react';
import type { AuthUser } from './SignIn';

type SettingsProps = {
  user: AuthUser;
};

export function Settings({ user }: SettingsProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    ticketUpdates: true,
    paymentReminders: true,
    reportGenerated: false,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    shareData: false,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: 'en',
    currency: 'USD',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20 md:pb-8 md:pt-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your preferences and account settings</p>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Settings
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <button className="w-full p-6 hover:bg-gray-50 transition-colors text-left flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password regularly for security</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>

            <button className="w-full p-6 hover:bg-gray-50 transition-colors text-left flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>

            <button className="w-full p-6 hover:bg-gray-50 transition-colors text-left flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900">Account Type</p>
                  <p className="text-sm text-gray-500">Current: <span className="capitalize">{user.type}</span></p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-900">Ticket Updates</p>
                <p className="text-sm text-gray-500">Get notified about ticket status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.ticketUpdates}
                  onChange={(e) => setNotifications({ ...notifications, ticketUpdates: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-900">Payment Reminders</p>
                <p className="text-sm text-gray-500">Reminders for upcoming payments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.paymentReminders}
                  onChange={(e) => setNotifications({ ...notifications, paymentReminders: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-900">Report Generated</p>
                <p className="text-sm text-gray-500">Notify when reports are ready</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reportGenerated}
                  onChange={(e) => setNotifications({ ...notifications, reportGenerated: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Privacy
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-900">Show Profile to Others</p>
                <p className="text-sm text-gray-500">Make your profile visible to property owners</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.showProfile}
                  onChange={(e) => setPrivacy({ ...privacy, showProfile: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-900">Data Sharing</p>
                <p className="text-sm text-gray-500">Share anonymous usage data to improve service</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.shareData}
                  onChange={(e) => setPrivacy({ ...privacy, shareData: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Preferences
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-500">Toggle dark theme (Coming soon)</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.darkMode}
                  onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                  disabled
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 opacity-50 cursor-not-allowed"></div>
              </label>
            </div>

            <div className="p-6">
              <div className="mb-3">
                <p className="text-gray-900 mb-1">Language</p>
                <p className="text-sm text-gray-500">Choose your preferred language</p>
              </div>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ms">Bahasa Malaysia</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div className="p-6">
              <div className="mb-3">
                <p className="text-gray-900 mb-1">Currency</p>
                <p className="text-sm text-gray-500">Display prices in your currency</p>
              </div>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="MYR">MYR - Malaysian Ringgit</option>
                <option value="SGD">SGD - Singapore Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Help & Support
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <button className="w-full p-6 hover:bg-gray-50 transition-colors text-left flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900">Terms of Service</p>
                  <p className="text-sm text-gray-500">Read our terms and conditions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>

            <button className="w-full p-6 hover:bg-gray-50 transition-colors text-left flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900">Privacy Policy</p>
                  <p className="text-sm text-gray-500">How we protect your data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>

            <button className="w-full p-6 hover:bg-gray-50 transition-colors text-left flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-900">Help Center</p>
                  <p className="text-sm text-gray-500">Get help and support</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
