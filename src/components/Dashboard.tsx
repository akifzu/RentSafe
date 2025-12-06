import { useState, useRef } from 'react';
import { FileText, Zap, MessageSquare, PlusCircle, ChevronRight, LogOut, TrendingUp, CheckCircle2, Clock, ArrowRight, Send, Paperclip, X, Bot, Sparkles } from 'lucide-react';
import type { Property } from '../App';
import type { AuthUser } from './SignIn';
import { chatWithUser } from '../services/claudeAI';

type DashboardProps = {
  properties: Property[];
  user: AuthUser;
  onNavigate: (view: 'create-property' | 'reports' | 'ask-ai') => void;
  onViewProperty: (propertyId: string) => void;
  onSignOut: () => void;
};

export function Dashboard({ properties, user, onNavigate, onSignOut }: DashboardProps) {
  // Calculate statistics
  const activeProperties = properties.filter(p => p.status === 'active').length;
  const pendingProperties = properties.filter(p => p.status === 'pending').length;
  const totalProperties = properties.length;

  // Ask AI state
  const [aiInput, setAiInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles([...attachedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() && attachedFiles.length === 0) return;

    setIsLoading(true);
    setAiResponse(null);

    try {
      // Call real Claude AI
      const response = await chatWithUser([], aiInput.trim());
      setAiResponse(response);
      setAiInput('');
      setAttachedFiles([]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setAiResponse('Sorry, I encountered an error. Please make sure the backend server is running (npm run server) and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20 md:pb-8">
      {/* User Info Bar - Below Navigation */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b md:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-end gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-900 font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.type}</p>
            </div>
            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section with Modern Design */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl mb-8 md:mb-12">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
          <div className="relative px-6 sm:px-8 lg:px-12 py-12 md:py-16">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed">
                Manage your rental properties with confidence. Track utilities, generate reports, and ensure a secure renting experience.
              </p>
              {user.type === 'tenant' && (
                <button
                  onClick={() => onNavigate('create-property')}
                  className="group inline-flex items-center gap-3 px-6 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl font-semibold text-base"
                >
                  <PlusCircle className="w-5 h-5" />
                  {properties.length === 0 ? 'Rent a Property' : 'Rent New Property'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ask AI Prompt Box - Below Hero Section */}
        <div className="mb-8 md:mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                  <p className="text-sm text-purple-100">Get instant help with your rental questions</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* AI Response Display */}
              {aiResponse && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">{aiResponse}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Attached Files Display */}
              {attachedFiles.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors border border-gray-200"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 truncate max-w-[150px]">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleAISubmit} className="space-y-4">
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask a question about renting, utilities, agreements, or property management..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[100px] text-sm"
                  disabled={isLoading}
                  rows={3}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileAttach}
                  className="hidden"
                />

                <div className="flex items-center justify-between gap-3">
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 flex-1">
                    {[
                      'How do I track utilities?',
                      'What is a move-in report?',
                      'Explain rental agreement',
                    ].map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => setAiInput(question)}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-lg transition-colors border border-gray-200"
                        disabled={isLoading}
                      >
                        {question}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => onNavigate('ask-ai')}
                      className="text-xs px-3 py-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-medium border border-purple-200"
                    >
                      View Full Chat →
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors border border-gray-300 hover:border-purple-300"
                      disabled={isLoading}
                      title="Attach file"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={(!aiInput.trim() && attachedFiles.length === 0) || isLoading}
                      className="px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 font-medium"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="hidden sm:inline">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span className="hidden sm:inline">Send</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalProperties}</h3>
            <p className="text-sm text-gray-600">Total Properties</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{activeProperties}</h3>
            <p className="text-sm text-gray-600">Active Rentals</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{pendingProperties}</h3>
            <p className="text-sm text-gray-600">Pending Actions</p>
          </div>
        </div>

        {/* Features Overview - Modern Card Design */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Platform Features</h2>
              <p className="text-gray-600">Everything you need for a secure renting experience</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Report Generator */}
            <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Report Generator</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Generate comprehensive reports for your rental properties including move-in conditions, utilities usage, and complete rental history.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Property condition reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Utilities summary reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Complete rental documentation</span>
                </li>
              </ul>
            </div>

            {/* Utilities Tracker */}
            <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 hover:shadow-xl hover:border-green-300 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Utilities Tracker</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Track and monitor water, electricity, and rent payments throughout your tenancy. Maintain transparent records and avoid billing disputes.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Water usage tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Electricity consumption logs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Rent payment history</span>
                </li>
              </ul>
            </div>

            {/* Ask AI */}
            <button
              onClick={() => onNavigate('ask-ai')}
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300 text-left w-full"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Assistant</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Get instant answers to your renting questions. Our AI assistant provides guidance on rental processes, tenant rights, and utilities management.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>24/7 instant support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Rental process guidance</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Best practices advice</span>
                </li>
              </ul>
            </button>
          </div>
        </div>

        {/* How It Works - Modern Step Design */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">How SewaSecure Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A simple, secure process to manage your rental properties</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="relative group">
              <div className="absolute -left-4 top-6 hidden lg:block">
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Rent a Property</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Start by creating a property rental with property details and Tenancy Agreement
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -left-4 top-6 hidden lg:block">
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Move-In Report</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Document property condition with photos and detailed room-by-room inspection
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -left-4 top-6 hidden lg:block">
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Sign Agreement</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Review and digitally sign the rental agreement with all terms clearly defined
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Track Utilities</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Monitor and record utilities usage and rent payments throughout tenancy
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}