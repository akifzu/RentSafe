import { FileText, PlusCircle, ChevronRight, Filter, Search, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { Property } from '../App';
import type { AuthUser } from './SignIn';

type TicketsProps = {
  properties: Property[];
  user: AuthUser;
  onNavigate: (view: 'create-property' | 'reports') => void;
  onViewProperty: (propertyId: string) => void;
};

export function Tickets({ properties, user, onNavigate, onViewProperty }: TicketsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Property['status']>('all');

  const getStatusBadge = (status: Property['status']) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'report-submitted': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
    };
    
    const labels = {
      'pending': 'Pending Report',
      'report-submitted': 'Report Submitted',
      'active': 'Active',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.renterName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: properties.length,
    pending: properties.filter(p => p.status === 'pending').length,
    'report-submitted': properties.filter(p => p.status === 'report-submitted').length,
    active: properties.filter(p => p.status === 'active').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20 md:pb-8 md:pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-gray-900">All Properties</h1>
            <p className="text-gray-600">Manage and track your rental properties</p>
          </div>
          {user.type === 'tenant' && (
            <button
              onClick={() => onNavigate('create-property')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Rent Property</span>
            </button>
          )}
        </div>

        {/* Monthly Report Generator */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Monthly Report Generator</h2>
                    <p className="text-indigo-100 text-sm md:text-base">
                      Generate comprehensive monthly reports for your rental properties
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">Utility Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FileText className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">Payment History</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Calendar className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">Monthly Summary</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('reports')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl font-semibold whitespace-nowrap"
              >
                <Calendar className="w-5 h-5" />
                Generate Monthly Report
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by address or renter name..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | Property['status'])}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Statuses ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="report-submitted">Report Submitted ({statusCounts['report-submitted']})</option>
              <option value="active">Active ({statusCounts.active})</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Total Properties</p>
            <p className="text-2xl text-gray-900">{statusCounts.all}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl text-yellow-600">{statusCounts.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">In Progress</p>
            <p className="text-2xl text-blue-600">{statusCounts['report-submitted']}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-2xl text-green-600">{statusCounts.active}</p>
          </div>
        </div>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No properties found' : 'No properties yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Rent your first property to get started'}
            </p>
            {user.type === 'tenant' && !searchQuery && filterStatus === 'all' && (
              <button
                onClick={() => onNavigate('create-property')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Rent a Property
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => onViewProperty(property.id)}
                  className="w-full p-6 hover:bg-gray-50 transition-colors text-left flex items-center justify-between group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{property.propertyAddress}</h3>
                      {getStatusBadge(property.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Renter:</span>
                        <span>{property.renterName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Move-in:</span>
                        <span>{new Date(property.moveInDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Created:</span>
                        <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                      {property.tenancyAgreement && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Agreement:</span>
                          <span className="text-green-600">✓ Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
