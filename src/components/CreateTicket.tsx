import { useState } from 'react';
import { ArrowLeft, Home, Upload, FileText, X } from 'lucide-react';
import type { Property } from '../App';
import type { AuthUser } from './SignIn';

type CreateTicketProps = {
  user: AuthUser;
  onSubmit: (property: Property) => void;
  onBack: () => void;
};

export function CreateTicket({ user, onSubmit, onBack }: CreateTicketProps) {
  const [formData, setFormData] = useState({
    propertyAddress: '',
    renterName: user.name,
    renterEmail: user.email,
    moveInDate: '',
    ownerEmail: '',
  });
  const [tenancyAgreementFile, setTenancyAgreementFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTenancyAgreementFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenancyAgreementFile) {
      alert('Please upload a Tenancy Agreement document');
      return;
    }
    
    const property: Property = {
      id: `PROP-${Date.now()}`,
      propertyAddress: formData.propertyAddress,
      renterName: formData.renterName,
      renterEmail: formData.renterEmail,
      moveInDate: formData.moveInDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
      tenancyAgreement: tenancyAgreementFile.name,
      ownerEmail: formData.ownerEmail,
    };
    
    onSubmit(property);
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">Rent a Property</h1>
              <p className="text-sm text-gray-500">Start the secure renting process</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="propertyAddress" className="block text-gray-900 mb-2">
                  Property Address
                </label>
                <input
                  type="text"
                  id="propertyAddress"
                  required
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="123 Main Street, City, State 12345"
                />
              </div>

              <div>
                <label htmlFor="renterName" className="block text-gray-900 mb-2">
                  Renter Name
                </label>
                <input
                  type="text"
                  id="renterName"
                  required
                  value={formData.renterName}
                  onChange={(e) => setFormData({ ...formData, renterName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  placeholder="John Doe"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="renterEmail" className="block text-gray-900 mb-2">
                  Renter Email
                </label>
                <input
                  type="email"
                  id="renterEmail"
                  required
                  value={formData.renterEmail}
                  onChange={(e) => setFormData({ ...formData, renterEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  placeholder="john.doe@email.com"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="ownerEmail" className="block text-gray-900 mb-2">
                  Property Owner Email
                </label>
                <input
                  type="email"
                  id="ownerEmail"
                  required
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="owner@email.com"
                />
              </div>

              <div>
                <label htmlFor="moveInDate" className="block text-gray-900 mb-2">
                  Move-In Date
                </label>
                <input
                  type="date"
                  id="moveInDate"
                  required
                  value={formData.moveInDate}
                  onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Tenancy Agreement Document Upload */}
              <div>
                <label className="block text-gray-900 mb-2">
                  Tenancy Agreement Document <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Please upload your signed Tenancy Agreement document. Accepted formats: PDF, DOC, DOCX, JPG, PNG
                </p>
                
                {!tenancyAgreementFile ? (
                  <label className="block">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                      <Upload className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                      <p className="text-gray-700 mb-1">Click to upload Tenancy Agreement</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, or PNG (Max 10MB)</p>
                    </div>
                  </label>
                ) : (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-gray-900">{tenancyAgreementFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(tenancyAgreementFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTenancyAgreementFile(null)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Property
              </button>
            </div>
          </form>
        </div>

        {/* Process Flow Guide */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-blue-900 mb-4">Next Steps After Renting Property</h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              <span className="text-blue-800">Complete the Move-In Report with property condition details</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
              <span className="text-blue-800">Track utilities (water, electricity, rent) throughout tenancy</span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}