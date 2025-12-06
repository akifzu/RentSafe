import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Camera, Upload, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import type { Property, MoveInReportType } from '../App';
import { analyzePropertyPhoto, isClaudeConfigured } from '../services/claudeAI';

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
  aiAnalysis?: any;
};

type UploadingState = {
  roomIndex: number;
  isAnalyzing: boolean;
};

export function MoveInReport({ propertyId, property, onSubmit, onBack }: MoveInReportProps) {
  const [rooms, setRooms] = useState<Room[]>([
    { name: 'Living Room', condition: 'excellent', photos: [], notes: '', aiAnalysis: null },
  ]);
  const [uploadingState, setUploadingState] = useState<UploadingState | null>(null);
  const [aiEnabled] = useState(isClaudeConfigured());

  const addRoom = () => {
    setRooms([...rooms, { name: '', condition: 'good', photos: [], notes: '', aiAnalysis: null }]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const updateRoom = (index: number, field: keyof Room, value: any) => {
    const newRooms = [...rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setRooms(newRooms);
  };

  const handlePhotoUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      const base64Data = base64Image.split(',')[1]; // Remove data:image/jpeg;base64, prefix

      // Add photo to room
      const newPhotos = [...rooms[index].photos, base64Image];
      updateRoom(index, 'photos', newPhotos);

      // Run AI analysis if enabled
      if (aiEnabled) {
        setUploadingState({ roomIndex: index, isAnalyzing: true });
        
        try {
          const analysis = await analyzePropertyPhoto(base64Data, {
            propertyAddress: property?.propertyAddress || 'Unknown Property',
            roomType: rooms[index].name || 'Unnamed Room',
            moveInDate: property?.moveInDate || new Date().toISOString(),
            purpose: 'Tenant documenting pre-existing damage to protect deposit',
          });

          updateRoom(index, 'aiAnalysis', analysis);
          
          // Auto-populate notes if AI found issues
          if (analysis.items_detected && analysis.items_detected.length > 0) {
            const aiNotes = analysis.items_detected
              .map((item: any) => `${item.object}: ${item.issue} - ${item.reasoning}`)
              .join('\n');
            updateRoom(index, 'notes', aiNotes);
          }
        } catch (error) {
          console.error('AI analysis failed:', error);
          alert('AI analysis failed. Photo uploaded but analysis unavailable.');
        } finally {
          setUploadingState(null);
        }
      }
    };

    reader.readAsDataURL(file);
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
                        Photos {aiEnabled && <span className="text-xs text-purple-600 font-medium">(AI Analysis Enabled ✨)</span>}
                      </label>
                      
                      {/* Photo Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(index, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingState?.roomIndex === index}
                        />
                        
                        {uploadingState?.roomIndex === index && uploadingState.isAnalyzing ? (
                          <>
                            <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2 animate-pulse" />
                            <p className="text-sm text-purple-600 font-medium">
                              AI Analyzing Photo...
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Detecting damage and classifying liability
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload room photos
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {aiEnabled ? 'AI will analyze for damage automatically' : 'JPG, PNG up to 10MB'}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Uploaded Photos Preview */}
                      {room.photos.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {room.photos.map((photo, photoIndex) => (
                            <div key={photoIndex} className="relative">
                              <img
                                src={photo}
                                alt={`Room ${index + 1} - Photo ${photoIndex + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPhotos = room.photos.filter((_, i) => i !== photoIndex);
                                  updateRoom(index, 'photos', newPhotos);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* AI Analysis Results */}
                      {room.aiAnalysis && room.aiAnalysis.items_detected && (
                        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <h4 className="font-medium text-purple-900">AI Analysis Results</h4>
                          </div>
                          
                          {room.aiAnalysis.items_detected.length === 0 ? (
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle className="w-4 h-4" />
                              <p className="text-sm">No damage detected - Room appears to be in good condition</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {room.aiAnalysis.items_detected.map((item: any, itemIndex: number) => (
                                <div key={itemIndex} className="bg-white p-3 rounded border border-purple-200">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900 capitalize">
                                        {item.object}: {item.issue}
                                      </p>
                                      <p className="text-xs text-gray-500">{item.location}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      item.classification === 'wear_and_tear' ? 'bg-green-100 text-green-700' :
                                      item.classification === 'pre_existing_damage' ? 'bg-yellow-100 text-yellow-700' :
                                      item.classification === 'tenant_damage' ? 'bg-red-100 text-red-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {item.classification.replace('_', ' ')}
                                    </span>
                                  </div>
                                  
                                  <p className="text-sm text-gray-700 mb-2">{item.reasoning}</p>
                                  
                                  <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>Severity: <strong>{item.severity}</strong></span>
                                    <span>Liability: <strong>{item.tenant_liability}</strong></span>
                                    <span>Confidence: <strong>{Math.round(item.confidence * 100)}%</strong></span>
                                  </div>
                                </div>
                              ))}
                              
                              {room.aiAnalysis.overall_assessment && (
                                <div className="mt-3 p-3 bg-indigo-50 rounded border border-indigo-200">
                                  <p className="text-sm text-indigo-900">
                                    <strong>Overall Assessment:</strong> {room.aiAnalysis.overall_assessment}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {!aiEnabled && room.photos.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-yellow-800 font-medium">AI Analysis Unavailable</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              Configure VITE_CLAUDE_API_KEY to enable automatic damage detection
                            </p>
                          </div>
                        </div>
                      )}
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
