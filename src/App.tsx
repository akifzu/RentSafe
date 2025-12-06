import { useState } from 'react';
import { SignIn, type AuthUser } from './components/SignIn';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Tickets } from './components/Tickets';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { CreateTicket } from './components/CreateTicket';
import { MoveInReport } from './components/MoveInReport';
import { UtilitiesTracker } from './components/UtilitiesTracker';
import { Reports } from './components/Reports';
import { AskAI } from './components/AskAI';

export type Property = {
  id: string;
  propertyAddress: string;
  renterName: string;
  renterEmail: string;
  moveInDate: string;
  status: 'pending' | 'report-submitted' | 'active';
  createdAt: string;
  tenancyAgreement?: string;
  ownerEmail?: string;
};

export type MoveInReportType = {
  propertyId: string;
  rooms: {
    name: string;
    condition: string;
    photos: string[];
    notes: string;
  }[];
  submittedAt: string;
};

export type UtilityReading = {
  propertyId: string;
  date: string;
  water: number;
  electricity: number;
  rent: number;
  waterReceipt?: string;
  electricityReceipt?: string;
  rentReceipt?: string;
};

type ViewType = 'dashboard' | 'properties' | 'profile' | 'settings' | 'create-property' | 'move-in-report' | 'utilities' | 'reports' | 'ask-ai';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [properties, setProperties] = useState<Property[]>([]);
  const [reports, setReports] = useState<MoveInReportType[]>([]);
  const [utilities, setUtilities] = useState<UtilityReading[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<ViewType>('dashboard');

  const handleCreateProperty = (property: Property) => {
    setProperties([...properties, property]);
    setCurrentView('dashboard');
  };

  const handleSubmitReport = (report: MoveInReportType) => {
    setReports([...reports, report]);
    setProperties(properties.map(p => 
      p.id === report.propertyId 
        ? { ...p, status: 'active' } 
        : p
    ));
    setCurrentView('dashboard');
  };

  const handleAddUtilityReading = (reading: UtilityReading) => {
    setUtilities([...utilities, reading]);
    setProperties(properties.map(p => 
      p.id === reading.propertyId 
        ? { ...p, status: 'active' } 
        : p
    ));
  };

  const handleViewProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const property = properties.find(p => p.id === propertyId);
    
    if (property?.status === 'pending') {
      setCurrentView('move-in-report');
    } else if (property?.status === 'report-submitted' || property?.status === 'active') {
      setCurrentView('utilities');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdateProfile = (updatedUser: AuthUser) => {
    setUser(updatedUser);
  };

  const handleNavigate = (view: ViewType) => {
    setPreviousView(currentView);
    setCurrentView(view);
    setSelectedPropertyId(null);
  };

  if (!user) {
    return <SignIn onSignIn={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      
      {currentView === 'dashboard' && (
        <Dashboard 
          properties={properties}
          user={user}
          onNavigate={setCurrentView}
          onViewProperty={handleViewProperty}
          onSignOut={handleSignOut}
        />
      )}
      
      {currentView === 'properties' && (
        <Tickets 
          properties={properties}
          user={user}
          onNavigate={setCurrentView}
          onViewProperty={handleViewProperty}
        />
      )}
      
      {currentView === 'profile' && (
        <Profile 
          user={user}
          properties={properties}
          reports={reports}
          utilities={utilities}
          onUpdateProfile={handleUpdateProfile}
          onSignOut={handleSignOut}
        />
      )}
      
      {currentView === 'settings' && (
        <Settings user={user} />
      )}
      
      {currentView === 'create-property' && (
        <CreateTicket 
          user={user}
          onSubmit={handleCreateProperty}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'move-in-report' && selectedPropertyId && (
        <MoveInReport 
          propertyId={selectedPropertyId}
          property={properties.find(p => p.id === selectedPropertyId)}
          onSubmit={handleSubmitReport}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'utilities' && selectedPropertyId && (
        <UtilitiesTracker 
          propertyId={selectedPropertyId}
          property={properties.find(p => p.id === selectedPropertyId)}
          readings={utilities.filter(u => u.propertyId === selectedPropertyId)}
          onAddReading={handleAddUtilityReading}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'reports' && (
        <Reports 
          properties={properties}
          reports={reports}
          utilities={utilities}
          defaultMode={previousView === 'properties' ? 'monthly' : 'general'}
          onBack={() => setCurrentView(previousView)}
        />
      )}
      
      {currentView === 'ask-ai' && (
        <AskAI 
          onBack={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  );
}