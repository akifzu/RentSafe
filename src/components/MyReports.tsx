import { useState } from 'react';
import { ArrowLeft, FileText, Camera, Calendar, Home, DollarSign, Eye, X, ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import type { Property, MoveInReportType, UtilityReading } from '../App';

type MyReportsProps = {
  properties: Property[];
  reports: MoveInReportType[];
  utilities: UtilityReading[];
  onBack: () => void;
  onViewReport: (reportId: string) => void;
};

type ReportTab = 'all' | 'move-in' | 'utilities';

export function MyReports({ properties, reports, utilities, onBack, onViewReport }: MyReportsProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUtilities, setExpandedUtilities] = useState<string[]>([]);

  // Get property by ID
  const getProperty = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  // Filter reports based on search
  const filteredMoveInReports = reports.filter(report => {
    const property = getProperty(report.propertyId);
    if (!property) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      property.propertyAddress.toLowerCase().includes(searchLower) ||
      property.renterName.toLowerCase().includes(searchLower)
    );
  });

  // Group utilities by property
  const utilitiesByProperty = utilities.reduce((acc, reading) => {
    if (!acc[reading.propertyId]) {
      acc[reading.propertyId] = [];
    }
    acc[reading.propertyId].push(reading);
    return acc;
  }, {} as Record<string, UtilityReading[]>);

  // Filter utilities based on search
  const filteredUtilitiesEntries = Object.entries(utilitiesByProperty).filter(([propertyId]) => {
    const property = getProperty(propertyId);
    if (!property) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      property.propertyAddress.toLowerCase().includes(searchLower) ||
      property.renterName.toLowerCase().includes(searchLower)
    );
  });

  const toggleUtilityExpand = (propertyId: string) => {
    setExpandedUtilities(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const calculateUtilityTotal = (readings: UtilityReading[]) => {
    return readings.reduce((acc, r) => acc + r.water + r.electricity + r.rent, 0);
  };

  const tabs = [
    { id: 'all', label: 'All Reports', count: reports.length + Object.keys(utilitiesByProperty).length },
    { id: 'move-in', label: 'Move-In Reports', count: reports.length },
    { id: 'utilities', label: 'Utility Records', count: Object.keys(utilitiesByProperty).length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-500">View all your submitted reports and records</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by property address or tenant name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            {/* Filter Tabs */}
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ReportTab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {reports.length === 0 && utilities.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't submitted any reports yet. Start by adding a property and completing a move-in report.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Move-In Reports Section */}
        {(activeTab === 'all' || activeTab === 'move-in') && filteredMoveInReports.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              Move-In Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMoveInReports.map((report, index) => {
                const property = getProperty(report.propertyId);
                const totalPhotos = report.rooms.reduce((acc, room) => acc + room.photos.length, 0);
                
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-1">
                              {property?.propertyAddress || 'Unknown Property'}
                            </h3>
                            <p className="text-sm text-gray-500">{property?.renterName}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Submitted
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">{report.rooms.length}</p>
                          <p className="text-xs text-gray-500">Rooms</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">{totalPhotos}</p>
                          <p className="text-xs text-gray-500">Photos</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-900">
                            {new Date(report.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-500">Date</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onViewReport(report.propertyId)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Full Report
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Utility Records Section */}
        {(activeTab === 'all' || activeTab === 'utilities') && filteredUtilitiesEntries.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Utility Records
            </h2>
            <div className="space-y-4">
              {filteredUtilitiesEntries.map(([propertyId, readings]) => {
                const property = getProperty(propertyId);
                const isExpanded = expandedUtilities.includes(propertyId);
                const total = calculateUtilityTotal(readings);
                const sortedReadings = [...readings].sort((a, b) => 
                  new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                return (
                  <div
                    key={propertyId}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div
                      onClick={() => toggleUtilityExpand(propertyId)}
                      className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {property?.propertyAddress || 'Unknown Property'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {readings.length} record{readings.length !== 1 ? 's' : ''} • Total: RM {total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            {readings.length} entries
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Water</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Electricity</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rent</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {sortedReadings.map((reading, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-5 py-3 text-sm text-gray-900">
                                    {new Date(reading.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </td>
                                  <td className="px-5 py-3 text-sm text-blue-600 font-medium">
                                    RM {reading.water.toFixed(2)}
                                  </td>
                                  <td className="px-5 py-3 text-sm text-yellow-600 font-medium">
                                    RM {reading.electricity.toFixed(2)}
                                  </td>
                                  <td className="px-5 py-3 text-sm text-green-600 font-medium">
                                    RM {reading.rent.toFixed(2)}
                                  </td>
                                  <td className="px-5 py-3 text-sm font-bold text-gray-900">
                                    RM {(reading.water + reading.electricity + reading.rent).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                              <tr>
                                <td className="px-5 py-3 text-sm font-bold text-gray-900">Total</td>
                                <td className="px-5 py-3 text-sm font-bold text-blue-600">
                                  RM {readings.reduce((acc, r) => acc + r.water, 0).toFixed(2)}
                                </td>
                                <td className="px-5 py-3 text-sm font-bold text-yellow-600">
                                  RM {readings.reduce((acc, r) => acc + r.electricity, 0).toFixed(2)}
                                </td>
                                <td className="px-5 py-3 text-sm font-bold text-green-600">
                                  RM {readings.reduce((acc, r) => acc + r.rent, 0).toFixed(2)}
                                </td>
                                <td className="px-5 py-3 text-sm font-bold text-indigo-600">
                                  RM {total.toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && filteredMoveInReports.length === 0 && filteredUtilitiesEntries.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-500">
              No reports match your search "{searchQuery}"
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

