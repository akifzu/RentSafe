import { Home, FileText, User, Settings, FolderOpen } from 'lucide-react';

type NavigationProps = {
  currentView: string;
  onNavigate: (view: 'dashboard' | 'properties' | 'my-reports' | 'profile' | 'settings') => void;
};

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'properties', icon: FileText, label: 'Properties' },
    { id: 'my-reports', icon: FolderOpen, label: 'My Reports' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* SewaSecure Branding - Visible on all screens */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 text-sm sm:text-base md:text-lg font-semibold italic" style={{ fontFamily: '"Myriad Pro", "Myriad", "Myriad Web Pro", Arial, sans-serif' }}>SewaSecure</h1>
              <p className="text-xs text-gray-500 hidden md:block">Secure Renting Process Platform</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center justify-around md:justify-end md:gap-2 flex-1 md:flex-initial">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as 'dashboard' | 'properties' | 'my-reports' | 'profile' | 'settings')}
                  className={`group relative flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-indigo-600' : ''}`} />
                  
                  {/* Desktop - Always show label */}
                  <span className="hidden md:block text-sm">
                    {item.label}
                  </span>
                  
                  {/* Mobile - Show label on hover as tooltip */}
                  <span className="md:hidden absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
