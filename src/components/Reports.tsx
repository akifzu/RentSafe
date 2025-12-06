import { useState } from 'react';
import { ArrowLeft, FileText, Download, Calendar, TrendingUp, DollarSign, Sparkles, X } from 'lucide-react';
import type { Property, MoveInReportType, UtilityReading } from '../App';
import { generateForm198 } from '../services/claudeAI';

type ReportsProps = {
  properties: Property[];
  reports: MoveInReportType[];
  utilities: UtilityReading[];
  onBack: () => void;
  defaultMode?: 'general' | 'monthly';
};

type ReportMode = 'general' | 'monthly';

export function Reports({ properties, reports, utilities, onBack, defaultMode = 'general' }: ReportsProps) {
  const [mode, setMode] = useState<ReportMode>(defaultMode);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [reportType, setReportType] = useState<'summary' | 'utilities' | 'complete'>('summary');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [showForm198Modal, setShowForm198Modal] = useState(false);
  const [generatingForm198, setGeneratingForm198] = useState(false);
  const [form198Content, setForm198Content] = useState<string>('');

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const selectedReport = reports.find(r => r.propertyId === selectedPropertyId);
  
  // Filter utilities based on mode
  const allUtilities = utilities.filter(u => u.propertyId === selectedPropertyId);
  const monthlyUtilities = allUtilities.filter(u => {
    if (!selectedPropertyId) return false;
    const utilityDate = new Date(u.date);
    const [year, month] = selectedMonth.split('-').map(Number);
    return utilityDate.getFullYear() === year && utilityDate.getMonth() + 1 === month;
  });
  
  const selectedUtilities = mode === 'monthly' ? monthlyUtilities : allUtilities;

  const calculateUtilityTotals = () => {
    return selectedUtilities.reduce(
      (acc, reading) => ({
        water: acc.water + reading.water,
        electricity: acc.electricity + reading.electricity,
        rent: acc.rent + reading.rent,
        total: acc.total + reading.water + reading.electricity + reading.rent,
        count: acc.count + 1,
      }),
      { water: 0, electricity: 0, rent: 0, total: 0, count: 0 }
    );
  };

  const calculateAverages = () => {
    const totals = calculateUtilityTotals();
    if (totals.count === 0) return { water: 0, electricity: 0, rent: 0, total: 0 };
    return {
      water: totals.water / totals.count,
      electricity: totals.electricity / totals.count,
      rent: totals.rent / totals.count,
      total: totals.total / totals.count,
    };
  };

  const generateReport = () => {
    if (!selectedPropertyId) {
      alert('Please select a property');
      return;
    }
    if (mode === 'monthly' && monthlyUtilities.length === 0) {
      alert('No utility data available for the selected month');
      return;
    }
    if (mode === 'general' && selectedUtilities.length === 0) {
      alert('No utility data available');
      return;
    }
    
    const monthName = mode === 'monthly' 
      ? new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '';
    
    const reportTypeName = mode === 'monthly' 
      ? `Monthly Report for ${monthName}`
      : reportType === 'summary' ? 'Summary Report'
      : reportType === 'utilities' ? 'Utilities Report'
      : 'Complete Report';
    
    alert(`${reportTypeName} for ${selectedProperty?.propertyAddress} would be generated here. In production, this would create a downloadable PDF.`);
  };

  // Generate Form 198 with AI
  const handleGenerateForm198 = async () => {
    if (!selectedPropertyId || !selectedProperty) {
      alert('Please select a property first');
      return;
    }

    setGeneratingForm198(true);
    setShowForm198Modal(true);

    try {
      // Example dispute data - in production, this would come from a form
      const form198 = await generateForm198({
        plaintiffName: selectedProperty.renterName,
        plaintiffIC: '123456-78-9012', // Would come from user profile
        plaintiffAddress: 'Plaintiff Address',
        defendantName: 'Property Owner',
        defendantIC: '987654-32-1098',
        defendantAddress: selectedProperty.propertyAddress,
        amount: 2000,
        reason: 'Deposit withholding dispute',
        facts: [
          `Tenancy agreement for ${selectedProperty.propertyAddress} dated ${new Date(selectedProperty.moveInDate).toLocaleDateString()}`,
          'Move-in report documented pre-existing damage',
          'Landlord withheld RM 2000 from security deposit',
          'Tenant disputes liability for pre-existing damage'
        ],
        evidence: [
          'Move-in report with photos',
          'Tenancy agreement',
          'Payment receipts',
          'Communication records'
        ]
      });

      setForm198Content(form198);
    } catch (error) {
      console.error('Form 198 generation error:', error);
      alert('Failed to generate Form 198. Please ensure the backend server is running (npm run server)');
      setShowForm198Modal(false);
    } finally {
      setGeneratingForm198(false);
    }
  };

  const totals = calculateUtilityTotals();
  const averages = mode === 'monthly' ? calculateAverages() : null;
  const monthName = mode === 'monthly' 
    ? new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
            <div className={`w-10 h-10 ${mode === 'monthly' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-indigo-600'} rounded-lg flex items-center justify-center`}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">Report Generator</h1>
              <p className="text-sm text-gray-500">Generate comprehensive rental reports</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Tabs */}
        <div className="mb-6 flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
          <button
            onClick={() => {
              setMode('general');
              setSelectedPropertyId('');
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              mode === 'general'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            General Reports
          </button>
          <button
            onClick={() => {
              setMode('monthly');
              setSelectedPropertyId('');
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              mode === 'monthly'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Monthly Reports
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Report Configuration</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="property" className="block text-gray-700 mb-2">
                    Select Property
                  </label>
                  <select
                    id="property"
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Choose a property...</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.propertyAddress}
                      </option>
                    ))}
                  </select>
                </div>

                {mode === 'monthly' && (
                  <div>
                    <label htmlFor="month" className="block text-gray-700 mb-2">
                      Select Month
                    </label>
                    <input
                      type="month"
                      id="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}

                {mode === 'general' && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Report Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="reportType"
                          value="summary"
                          checked={reportType === 'summary'}
                          onChange={(e) => setReportType(e.target.value as 'summary' | 'utilities' | 'complete')}
                        />
                        <div>
                          <p className="text-gray-900">Summary Report</p>
                          <p className="text-xs text-gray-500">Overview of rental details</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="reportType"
                          value="utilities"
                          checked={reportType === 'utilities'}
                          onChange={(e) => setReportType(e.target.value as 'summary' | 'utilities' | 'complete')}
                        />
                        <div>
                          <p className="text-gray-900">Utilities Report</p>
                          <p className="text-xs text-gray-500">Detailed utility usage</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="reportType"
                          value="complete"
                          checked={reportType === 'complete'}
                          onChange={(e) => setReportType(e.target.value as 'summary' | 'utilities' | 'complete')}
                        />
                        <div>
                          <p className="text-gray-900">Complete Report</p>
                          <p className="text-xs text-gray-500">All details included</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <button
                  onClick={generateReport}
                  disabled={!selectedPropertyId || (mode === 'monthly' ? monthlyUtilities.length === 0 : selectedUtilities.length === 0)}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg transition-all disabled:cursor-not-allowed shadow-lg ${
                    mode === 'monthly'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400'
                      : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300'
                  }`}
                >
                  <Download className="w-5 h-5" />
                  {mode === 'monthly' ? 'Generate Monthly Report' : 'Generate Report'}
                </button>

                {/* AI Legal Documents Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Legal Documents
                  </h3>
                  <button
                    onClick={handleGenerateForm198}
                    disabled={!selectedPropertyId}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Form 198 (Borang 198)
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    AI-powered Form 198 for Tribunal Tuntutan Pengguna Malaysia
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-gray-900 mb-6">
                {mode === 'monthly' ? 'Monthly Report Preview' : 'Report Preview'}
              </h2>

              {!selectedPropertyId ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a property to preview the report</p>
                </div>
              ) : (mode === 'monthly' && monthlyUtilities.length === 0) ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No utility data available for {monthName}</p>
                  <p className="text-sm text-gray-500">Please add utility readings for this month</p>
                </div>
              ) : (mode === 'general' && selectedUtilities.length === 0) ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No utility data available</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Header Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-gray-900 mb-4">
                      {mode === 'monthly' 
                        ? `Monthly Report - ${monthName}`
                        : reportType === 'summary' && 'Summary Report'
                        || reportType === 'utilities' && 'Utilities Report'
                        || 'Complete Rental Report'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Property Address</p>
                        <p className="text-gray-900 font-medium">{selectedProperty?.propertyAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tenant</p>
                        <p className="text-gray-900 font-medium">{selectedProperty?.renterName}</p>
                      </div>
                      {mode === 'general' && (
                        <>
                          <div>
                            <p className="text-gray-500">Move-In Date</p>
                            <p className="text-gray-900">
                              {selectedProperty?.moveInDate ? new Date(selectedProperty.moveInDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Status</p>
                            <p className="text-gray-900 capitalize">{selectedProperty?.status.replace('-', ' ')}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary Content - Only for general reports */}
                  {mode === 'general' && (reportType === 'summary' || reportType === 'complete') && (
                    <div>
                      <h4 className="text-gray-900 mb-4">Property Condition</h4>
                      {selectedReport ? (
                        <div className="space-y-3">
                          {selectedReport.rooms.map((room, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-900">{room.name}</p>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
                                  {room.condition}
                                </span>
                              </div>
                              {room.notes && (
                                <p className="text-sm text-gray-600">{room.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No move-in report available</p>
                      )}
                    </div>
                  )}

                  {/* Utilities Content */}
                  {(mode === 'monthly' || reportType === 'utilities' || reportType === 'complete') && (
                    <div>
                      <h4 className="text-gray-900 mb-4">
                        {mode === 'monthly' ? 'Monthly Utilities Summary' : 'Utilities Summary'}
                      </h4>
                      {selectedUtilities.length > 0 ? (
                        <div className="space-y-4">
                          {/* Summary Cards */}
                          <div className={`grid ${mode === 'monthly' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-4'} gap-4`}>
                            {mode === 'monthly' ? (
                              <>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                    <p className="text-sm text-blue-600 font-medium">Total Water</p>
                                  </div>
                                  <p className="text-2xl font-bold text-blue-900">${totals.water.toFixed(2)}</p>
                                  {averages && <p className="text-xs text-blue-600 mt-1">Avg: ${averages.water.toFixed(2)}</p>}
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                                    <p className="text-sm text-yellow-600 font-medium">Total Electricity</p>
                                  </div>
                                  <p className="text-2xl font-bold text-yellow-900">${totals.electricity.toFixed(2)}</p>
                                  {averages && <p className="text-xs text-yellow-600 mt-1">Avg: ${averages.electricity.toFixed(2)}</p>}
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <p className="text-sm text-green-600 font-medium">Total Rent</p>
                                  </div>
                                  <p className="text-2xl font-bold text-green-900">${totals.rent.toFixed(2)}</p>
                                  {averages && <p className="text-xs text-green-600 mt-1">Avg: ${averages.rent.toFixed(2)}</p>}
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="w-4 h-4 text-indigo-600" />
                                    <p className="text-sm text-indigo-600 font-medium">Grand Total</p>
                                  </div>
                                  <p className="text-2xl font-bold text-indigo-900">${totals.total.toFixed(2)}</p>
                                  <p className="text-xs text-indigo-600 mt-1">{monthlyUtilities.length} entries</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-600 mb-1">Total Water</p>
                                  <p className="text-xl text-blue-900">${totals.water.toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                  <p className="text-sm text-yellow-600 mb-1">Total Electricity</p>
                                  <p className="text-xl text-yellow-900">${totals.electricity.toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                  <p className="text-sm text-green-600 mb-1">Total Rent</p>
                                  <p className="text-xl text-green-900">${totals.rent.toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-lg">
                                  <p className="text-sm text-indigo-600 mb-1">Grand Total</p>
                                  <p className="text-xl text-indigo-900">${totals.total.toFixed(2)}</p>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Detailed Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Date</th>
                                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Water</th>
                                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Electricity</th>
                                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Rent</th>
                                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {selectedUtilities.map((reading, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-gray-900">
                                      {mode === 'monthly'
                                        ? new Date(reading.date).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                          })
                                        : new Date(reading.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700">${reading.water.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-gray-700">${reading.electricity.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-gray-700">${reading.rent.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-gray-900 font-semibold">
                                      ${(reading.water + reading.electricity + reading.rent).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              {mode === 'monthly' && (
                                <tfoot className="bg-gray-50">
                                  <tr>
                                    <td className="px-4 py-3 text-gray-900 font-semibold">Total</td>
                                    <td className="px-4 py-3 text-gray-900 font-semibold">${totals.water.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-gray-900 font-semibold">${totals.electricity.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-gray-900 font-semibold">${totals.rent.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-indigo-600 font-bold">${totals.total.toFixed(2)}</td>
                                  </tr>
                                </tfoot>
                              )}
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No utility readings available</p>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="border-t border-gray-200 pt-6 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Generated on {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Form 198 Modal */}
      {showForm198Modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Form 198 - Borang 198</h2>
                  <p className="text-sm text-purple-100">Tribunal Tuntutan Pengguna Malaysia</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm198Modal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {generatingForm198 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Generating Form 198...</p>
                  <p className="text-sm text-gray-600">AI is preparing your legal document</p>
                </div>
              ) : form198Content ? (
                <div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Legal Disclaimer:</strong> This AI-generated document is for reference only. 
                      Please consult with a qualified lawyer before submitting to the tribunal.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900">
                      {form198Content}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No content generated</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!generatingForm198 && form198Content && (
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(form198Content);
                    alert('Form 198 copied to clipboard!');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([form198Content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Form_198_${selectedProperty?.propertyAddress.replace(/\s+/g, '_')}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium"
                >
                  Download Form 198
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

