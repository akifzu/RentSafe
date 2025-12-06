import { useState, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, Camera, X, Upload, Image, Sparkles, AlertCircle } from 'lucide-react';
import type { Property, MoveInReportType } from '../App';
import { analyzePropertyPhoto } from '../services/claudeAI';

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

export function MoveInReport({ propertyId, property, onSubmit, onBack }: MoveInReportProps) {
  const [rooms, setRooms] = useState<Room[]>([
    { name: 'Living Room', condition: 'excellent', photos: [], notes: '' },
  ]);
  const [uploadingRoom, setUploadingRoom] = useState<number | null>(null);
  const [analyzingRoom, setAnalyzingRoom] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

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

  // Handle photo upload with AI analysis
  const handlePhotoUpload = async (roomIndex: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploadingRoom(roomIndex);
    
    const newPhotos: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        continue;
      }
      
      // Convert to base64
      const base64 = await fileToBase64(file);
      newPhotos.push(base64);
    }
    
    // Update room photos
    const newRooms = [...rooms];
    newRooms[roomIndex] = {
      ...newRooms[roomIndex],
      photos: [...newRooms[roomIndex].photos, ...newPhotos],
    };
    setRooms(newRooms);
    setUploadingRoom(null);
    
    // Clear the file input
    if (fileInputRefs.current[roomIndex]) {
      fileInputRefs.current[roomIndex]!.value = '';
    }

    // Run AI analysis on first photo
    if (newPhotos.length > 0 && newRooms[roomIndex].name) {
      await runAIAnalysis(roomIndex, newPhotos[0]);
    }
  };

  // Run AI analysis on photo
  const runAIAnalysis = async (roomIndex: number, photoBase64: string) => {
    setAnalyzingRoom(roomIndex);
    
    try {
      // Extract base64 data (remove data:image/jpeg;base64, prefix)
      const base64Data = photoBase64.split(',')[1];
      
      const analysis = await analyzePropertyPhoto(base64Data, {
        propertyAddress: property?.propertyAddress || 'Property',
        roomType: rooms[roomIndex].name,
        moveInDate: new Date().toISOString()
      });

      // Update room with AI analysis
      const newRooms = [...rooms];
      newRooms[roomIndex] = {
        ...newRooms[roomIndex],
        aiAnalysis: analysis
      };
      setRooms(newRooms);
      
      console.log('✅ AI Analysis Complete:', analysis);
    } catch (error) {
      console.error('❌ AI Analysis Failed:', error);
      alert('AI analysis failed. Please check that the backend server is running (npm run server)');
    } finally {
      setAnalyzingRoom(null);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Remove photo from room
  const removePhoto = (roomIndex: number, photoIndex: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex] = {
      ...newRooms[roomIndex],
      photos: newRooms[roomIndex].photos.filter((_, i) => i !== photoIndex),
    };
    setRooms(newRooms);
  };

  // Trigger file input click
  const triggerFileInput = (roomIndex: number) => {
    fileInputRefs.current[roomIndex]?.click();
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

                    {/* AI Analysis Results */}
                    {analyzingRoom === index && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2 text-purple-700">
                          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          <Sparkles className="w-5 h-5" />
                          <span className="font-medium">AI analyzing photo...</span>
                        </div>
                      </div>
                    )}

                    {room.aiAnalysis && (
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2 text-purple-700 mb-3">
                          <Sparkles className="w-5 h-5" />
                          <span className="font-semibold">AI Analysis Results</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Overall Assessment:</p>
                            <p className="text-sm text-gray-600">{room.aiAnalysis.overall_assessment}</p>
                          </div>

                          {room.aiAnalysis.items_detected && room.aiAnalysis.items_detected.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Items Detected:</p>
                              <div className="space-y-2">
                                {room.aiAnalysis.items_detected.map((item: any, idx: number) => (
                                  <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-start justify-between mb-1">
                                      <span className="text-sm font-medium text-gray-900">
                                        {item.object} - {item.issue}
                                      </span>
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        item.classification === 'pre_existing_damage' ? 'bg-yellow-100 text-yellow-800' :
                                        item.classification === 'wear_and_tear' ? 'bg-green-100 text-green-800' :
                                        item.classification === 'tenant_damage' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {item.classification.replace(/_/g, ' ')}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-1">{item.reasoning}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                      <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                                      <span>•</span>
                                      <span>Liability: {item.tenant_liability}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {room.aiAnalysis.recommendation && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-blue-900 mb-1">Recommendation:</p>
                                  <p className="text-xs text-blue-700">{room.aiAnalysis.recommendation}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Photos
                      </label>
                      
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        onChange={(e) => handlePhotoUpload(index, e.target.files)}
                        className="hidden"
                      />
                      
                      {/* Photo preview grid */}
                      {room.photos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                          {room.photos.map((photo, photoIndex) => (
                            <div
                              key={photoIndex}
                              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                            >
                              <img
                                src={photo}
                                alt={`${room.name} photo ${photoIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* Delete button overlay */}
                              <button
                                type="button"
                                onClick={() => removePhoto(index, photoIndex)}
                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                title="Remove photo"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {/* Photo number badge */}
                              <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                                {photoIndex + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Upload area */}
                      <div
                        onClick={() => triggerFileInput(index)}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          uploadingRoom === index
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                        }`}
                      >
                        {uploadingRoom === index ? (
                          <>
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-indigo-600">Uploading photos...</p>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-center gap-2 mb-2">
                              <Camera className="w-6 h-6 text-gray-400" />
                              <Upload className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                              Click to upload photos
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, JPEG up to 5MB each
                            </p>
                            {room.photos.length > 0 && (
                              <p className="text-xs text-indigo-600 mt-2 font-medium">
                                {room.photos.length} photo{room.photos.length !== 1 ? 's' : ''} uploaded
                              </p>
                            )}
                          </>
                        )}
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
