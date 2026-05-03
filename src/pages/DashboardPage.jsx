import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';

// Import section components
import HomeSection from '../components/sections/HomeSection';
import LiveDetectSection from '../components/sections/LiveDetectSection';
import HistorySection from '../components/sections/HistorySection';
import PracticeSection from '../components/sections/PracticeSection';
import ReportsSection from '../components/sections/ReportsSection';
import SettingsSection from '../components/sections/SettingsSection';

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('home');

  // Render active section
  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection setActiveSection={setActiveSection} />;
      case 'live-detect':
        return <LiveDetectSection />;
      case 'history':
        return <HistorySection />;
      case 'practice':
        return <PracticeSection />;
      case 'reports':
        return <ReportsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <HomeSection setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors">
      
      {/* Left Sidebar - Fixed */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Right Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        
        {/* Header */}
        <DashboardHeader />

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
