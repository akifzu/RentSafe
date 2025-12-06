import { useState } from 'react';
import { ArrowLeft, Droplet, Zap, DollarSign, Plus, TrendingUp } from 'lucide-react';
import type { Property, UtilityReading } from '../App';

type UtilitiesTrackerProps = {
  propertyId: string;
  property?: Property;
  readings: UtilityReading[];
  onAddReading: (reading: UtilityReading) => void;
  onBack: () => void;
};

export function UtilitiesTracker({ propertyId, property, readings, onAddReading, onBack }: UtilitiesTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    water: '',
    electricity: '',
    rent: '',
    waterReceipt: null as File | null,
    electricityReceipt: null as File | null,
    rentReceipt: null as File | null,
  });

  const handleFileChange = (category: 'water' | 'electricity' | 'rent', file: File | null) => {
    if (category === 'water') {
      setFormData({ ...formData, waterReceipt: file });
    } else if (category === 'electricity') {
      setFormData({ ...formData, electricityReceipt: file });
    } else if (category === 'rent') {
      setFormData({ ...formData, rentReceipt: file });
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const reading: UtilityReading = {
        propertyId,
        date: new Date().toISOString(),
        water: parseFloat(formData.water) || 0,
        electricity: parseFloat(formData.electricity) || 0,
        rent: parseFloat(formData.rent) || 0,
      };

      // Convert files to base64 if provided
      if (formData.waterReceipt) {
        try {
          reading.waterReceipt = await convertFileToBase64(formData.waterReceipt);
        } catch (error) {
          console.error('Error converting water receipt:', error);
          alert('Error uploading water receipt. Please try again.');
          return;
        }
      }
      if (formData.electricityReceipt) {
        try {
          reading.electricityReceipt = await convertFileToBase64(formData.electricityReceipt);
        } catch (error) {
          console.error('Error converting electricity receipt:', error);
          alert('Error uploading electricity receipt. Please try again.');
          return;
        }
      }
      if (formData.rentReceipt) {
        try {
          reading.rentReceipt = await convertFileToBase64(formData.rentReceipt);
        } catch (error) {
          console.error('Error converting rent receipt:', error);
          alert('Error uploading rent receipt. Please try again.');
          return;
        }
      }
      
      onAddReading(reading);
      setFormData({ 
        water: '', 
        electricity: '', 
        rent: '',
        waterReceipt: null,
        electricityReceipt: null,
        rentReceipt: null,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error submitting payment record:', error);
      alert('Error submitting payment record. Please try again.');
    }
  };

  const calculateTotal = (reading: UtilityReading) => {
    return reading.water + reading.electricity + reading.rent;
  };

  const calculateAverages = () => {
    if (readings.length === 0) return { water: 0, electricity: 0, rent: 0, total: 0 };
    
    const totals = readings.reduce(
      (acc, reading) => ({
        water: acc.water + reading.water,
        electricity: acc.electricity + reading.electricity,
        rent: acc.rent + reading.rent,
      }),
      { water: 0, electricity: 0, rent: 0 }
    );

    return {
      water: totals.water / readings.length,
      electricity: totals.electricity / readings.length,
      rent: totals.rent / readings.length,
      total: (totals.water + totals.electricity + totals.rent) / readings.length,
    };
  };

  const averages = calculateAverages();

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Utilities Tracker</h1>
              <p className="text-sm text-gray-500">
                {property?.propertyAddress || 'Property Utilities'}
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Payment Record
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Droplet className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-gray-600">Water</h3>
            </div>
            <p className="text-2xl text-gray-900">${averages.water.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Average per month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-gray-600">Electricity</h3>
            </div>
            <p className="text-2xl text-gray-900">${averages.electricity.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Average per month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-gray-600">Rent</h3>
            </div>
            <p className="text-2xl text-gray-900">${averages.rent.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Average per month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-gray-600">Total</h3>
            </div>
            <p className="text-2xl text-gray-900">${averages.total.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Average per month</p>
          </div>
        </div>

        {/* Add Reading Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-gray-900 mb-6">Add Payment Record</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Water Bill */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-600" />
                    Water Bill
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="water" className="block text-gray-700 mb-2">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        id="water"
                        step="0.01"
                        value={formData.water}
                        onChange={(e) => setFormData({ ...formData, water: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="waterReceipt" className="block text-gray-700 mb-2">
                        Payment Receipt (Required)
                      </label>
                      <input
                        type="file"
                        id="waterReceipt"
                        accept="image/*,.pdf"
                        required
                        onChange={(e) => handleFileChange('water', e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {formData.waterReceipt && (
                        <p className="text-sm text-green-600 mt-1">✓ {formData.waterReceipt.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Electricity Bill */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Electricity Bill
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="electricity" className="block text-gray-700 mb-2">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        id="electricity"
                        step="0.01"
                        value={formData.electricity}
                        onChange={(e) => setFormData({ ...formData, electricity: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="electricityReceipt" className="block text-gray-700 mb-2">
                        Payment Receipt (Required)
                      </label>
                      <input
                        type="file"
                        id="electricityReceipt"
                        accept="image/*,.pdf"
                        required
                        onChange={(e) => handleFileChange('electricity', e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {formData.electricityReceipt && (
                        <p className="text-sm text-green-600 mt-1">✓ {formData.electricityReceipt.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rent Payment */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Rent Payment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rent" className="block text-gray-700 mb-2">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        id="rent"
                        step="0.01"
                        value={formData.rent}
                        onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="rentReceipt" className="block text-gray-700 mb-2">
                        Payment Receipt (Required)
                      </label>
                      <input
                        type="file"
                        id="rentReceipt"
                        accept="image/*,.pdf"
                        required
                        onChange={(e) => handleFileChange('rent', e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {formData.rentReceipt && (
                        <p className="text-sm text-green-600 mt-1">✓ {formData.rentReceipt.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Payment Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Readings History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Payment History</h2>
          </div>

          {readings.length === 0 ? (
            <div className="p-12 text-center">
              <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No payment records yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your utility payments by adding your first record</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add First Payment Record
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Water Bill</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Electricity Bill</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Rent Payment</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Receipts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {readings.map((reading, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {new Date(reading.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        ${reading.water.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        ${reading.electricity.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        ${reading.rent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                        ${calculateTotal(reading).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {reading.waterReceipt && (
                            <a
                              href={reading.waterReceipt}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                              title="Water Receipt"
                            >
                              💧
                            </a>
                          )}
                          {reading.electricityReceipt && (
                            <a
                              href={reading.electricityReceipt}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-600 hover:text-yellow-800 text-sm"
                              title="Electricity Receipt"
                            >
                              ⚡
                            </a>
                          )}
                          {reading.rentReceipt && (
                            <a
                              href={reading.rentReceipt}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 text-sm"
                              title="Rent Receipt"
                            >
                              💰
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
