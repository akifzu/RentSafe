import { useState, useEffect } from 'react';
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
import { MyReports } from './components/MyReports';
import { ReportView } from './components/ReportView';
import { properties as propertiesDB, moveInReports, utilityReadings, auth } from './services/database';

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

type ViewType = 'dashboard' | 'properties' | 'profile' | 'settings' | 'create-property' | 'move-in-report' | 'utilities' | 'reports' | 'ask-ai' | 'my-reports' | 'report-view';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [properties, setProperties] = useState<Property[]>([]);
  const [reports, setReports] = useState<MoveInReportType[]>([]);
  const [utilities, setUtilities] = useState<UtilityReading[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<ViewType>('dashboard');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase when user signs in
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Load properties
        const userProperties = await propertiesDB.getAll(user.id);
        setProperties(userProperties.map(p => ({
          id: p.id,
          propertyAddress: p.property_address,
          renterName: p.renter_name,
          renterEmail: p.renter_email,
          moveInDate: p.move_in_date,
          status: p.status,
          createdAt: p.created_at,
          tenancyAgreement: p.tenancy_agreement_url || undefined,
          ownerEmail: p.owner_email
        })));

        // Load reports
        const userReports = await moveInReports.getAll(user.id);
        setReports(userReports.map(r => ({
          propertyId: r.property_id,
          rooms: r.rooms as any,
          submittedAt: r.submitted_at
        })));

        // Load utilities
        const userUtilities = await utilityReadings.getAll(user.id);
        setUtilities(userUtilities.map(u => ({
          propertyId: u.property_id,
          date: u.date,
          water: Number(u.water),
          electricity: Number(u.electricity),
          rent: Number(u.rent),
          waterReceipt: u.water_receipt_url || undefined,
          electricityReceipt: u.electricity_receipt_url || undefined,
          rentReceipt: u.rent_receipt_url || undefined
        })));

      } catch (error) {
        console.error('Error loading user data:', error);
        alert('Failed to load data from database. Using local mode.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user?.id]);

  const handleCreateProperty = async (property: Property) => {
    if (!user?.id) return;

    try {
      // Save to Supabase
      const newProperty = await propertiesDB.create({
        user_id: user.id,
        property_address: property.propertyAddress,
        renter_name: property.renterName,
        renter_email: property.renterEmail,
        move_in_date: property.moveInDate,
        owner_email: property.ownerEmail || '',
        tenancy_agreement_url: property.tenancyAgreement || null
      });

      // Update local state
      setProperties([...properties, {
        id: newProperty.id,
        propertyAddress: newProperty.property_address,
        renterName: newProperty.renter_name,
        renterEmail: newProperty.renter_email,
        moveInDate: newProperty.move_in_date,
        status: newProperty.status,
        createdAt: newProperty.created_at,
        tenancyAgreement: newProperty.tenancy_agreement_url || undefined,
        ownerEmail: newProperty.owner_email
      }]);
      
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property. Please try again.');
    }
  };

  const handleSubmitReport = async (report: MoveInReportType) => {
    if (!user?.id) return;

    try {
      // Save to Supabase
      await moveInReports.create({
        property_id: report.propertyId,
        user_id: user.id,
        rooms: report.rooms as any
      });

      // Update local state
      setReports([...reports, report]);
      setProperties(properties.map(p => 
        p.id === report.propertyId 
          ? { ...p, status: 'active' } 
          : p
      ));

      // Update property status in database
      await propertiesDB.update(report.propertyId, { status: 'active' });
      
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleAddUtilityReading = async (reading: UtilityReading) => {
    if (!user?.id) return;

    try {
      // Save to Supabase
      await utilityReadings.create({
        property_id: reading.propertyId,
        user_id: user.id,
        date: reading.date,
        water: reading.water,
        electricity: reading.electricity,
        rent: reading.rent,
        water_receipt_url: reading.waterReceipt || null,
        electricity_receipt_url: reading.electricityReceipt || null,
        rent_receipt_url: reading.rentReceipt || null
      });

      // Update local state
      setUtilities([...utilities, reading]);
      setProperties(properties.map(p => 
        p.id === reading.propertyId 
          ? { ...p, status: 'active' } 
          : p
      ));
    } catch (error) {
      console.error('Error adding utility reading:', error);
      alert('Failed to add utility reading. Please try again.');
    }
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

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setProperties([]);
      setReports([]);
      setUtilities([]);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateProfile = (updatedUser: AuthUser) => {
    setUser(updatedUser);
  };

  const handleNavigate = (view: ViewType) => {
    setPreviousView(currentView);
    setCurrentView(view);
    setSelectedPropertyId(null);
  };

  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setPreviousView(currentView);
    setCurrentView('report-view');
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
      
      {currentView === 'my-reports' && (
        <MyReports 
          properties={properties}
          reports={reports}
          utilities={utilities}
          onBack={() => setCurrentView('dashboard')}
          onViewReport={handleViewReport}
        />
      )}
      
      {currentView === 'report-view' && selectedReportId && (
        <ReportView 
          report={reports.find(r => r.propertyId === selectedReportId)!}
          property={properties.find(p => p.id === selectedReportId)!}
          onBack={() => setCurrentView('my-reports')}
        />
      )}
    </div>
  );
}