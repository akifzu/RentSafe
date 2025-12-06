import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Camera } from 'lucide-react';
import type { Property, MoveInReportType } from '../App';

type MoveInReportProps = {
  propertyId: string;
  property?: Property;
  onSubmit: (report: MoveInReportType) => void;
  onBack: () => void;
};

type Room = {
  name: string;
  condition: string;
  photos: string[];
  notes: string;
};

export function MoveInReport({ propertyId, property, onSubmit, onBack }: MoveInReportProps) {
  const [rooms, setRooms] = useState<Room[]>([
    { name: 'Living Room', condition: 'excellent', photos: [], notes: '' },
  ]);

  const addRoom = () => {
    setRooms([...rooms, { name: '', condition: 'good', photos: [], notes: '' }]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const updateRoom = (index: number, field: keyof Room, value: string) => {
    const newRooms = [...rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setRooms(newRooms);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const report: MoveInReportType = {
      propertyId,
      rooms,
      submittedAt: new Date().toISOString(),
    };
    
    onSubmit(report);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-gray-900">Move-In Report</h1>
            <p className="text-sm text-gray-500">
              {property?.propertyAddress || 'Property Inspection'}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-gray-900 mb-2">Property Condition Report</h2>
            <p className="text-gray-600">
              Document the condition of each room before moving in. This report will be used for reference during move-out.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {rooms.map((room, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-gray-900">Room {index + 1}</h3>
                    {rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoom(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Room Name
                      </label>
                      <input
                        type="text"
                        required
                        value={room.name}
                        onChange={(e) => updateRoom(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., Living Room, Bedroom 1"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Condition
                      </label>
                      <select
                        value={room.condition}
                        onChange={(e) => updateRoom(index, 'condition', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                        <option value="damaged">Damaged</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={room.notes}
                        onChange={(e) => updateRoom(index, 'notes', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={3}
                        placeholder="Any scratches, stains, or issues to document..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Photos
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Camera className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          In a production app, you would upload photos here
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to add photos of this room
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRoom}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Another Room
            </button>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
