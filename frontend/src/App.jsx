import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import DashboardView from './pages/DashboardView';
import AssetsView from './pages/AssetsView';
import VulnerabilitiesView from './pages/VulnerabilitiesView';
import MonteCarloView from './pages/MonteCarloView';
import OptimizerView from './pages/OptimizerView';
import WhatIfView from './pages/WhatIfView';
import AttackPathView from './pages/AttackPathView';
import ComplianceView from './pages/ComplianceView';
import IngestionView from './pages/IngestionView';
import Toast from './components/ui/Toast';
import CommandPalette from './components/ui/CommandPalette';
import { api } from './services/api';

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const [assets, setAssets] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [events, setEvents] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastSimulatedResponse, setLastSimulatedResponse] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchGlobalState = async () => {
    try {
      const [dash, asts, vulns, comp, evts] = await Promise.all([
        api.getDashboard(),
        api.getAssets(),
        api.getVulnerabilities(),
        api.getCompliance(),
        api.getEvents()
      ]);

      if (dash) setDashboardData(dash);
      if (asts) setAssets(asts);
      if (vulns) setVulnerabilities(vulns);
      if (comp) setCompliance(comp);
      if (evts) setEvents(evts);
    } catch (err) {
      console.error('Failed to load platform data', err);
    }
  };

  useEffect(() => {
    fetchGlobalState();
  }, []);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSimulateEvent = async () => {
    setIsSimulating(true);
    try {
      const res = await api.simulateEvent();
      if (res && res.status === 'success') {
        setLastSimulatedResponse(res);
        setToastMessage(`⚡ ${res.message}`);
        await fetchGlobalState();
        setTimeout(() => setToastMessage(null), 6000);
      }
    } catch (err) {
      console.error('Simulation trigger failed', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetState();
      setToastMessage("🔄 Runtime state successfully reset to default FinTrust Bank baseline.");
      setLastSimulatedResponse(null);
      await fetchGlobalState();
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Reset failed', err);
    }
  };

  const navigate = (tab) => {
    setActiveTab(tab);
    setIsNavOpen(false);
    if (viewMode !== 'app') setViewMode('app');
  };

  const handleLaunchConsole = (tab = 'dashboard') => {
    setActiveTab(tab);
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentEal = dashboardData?.expected_annual_loss || 18400000;
  const currentRiskScore = dashboardData?.enterprise_risk_score || 72;

  // Render full Marketing Landing Page
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onLaunchConsole={handleLaunchConsole}
          dashboardData={dashboardData}
        />
        <CommandPalette
          open={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={(tab) => {
            handleLaunchConsole(tab);
          }}
        />
      </>
    );
  }

  // Render Authenticated Console / Application
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Left sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={navigate}
        liveEventsCount={events.length}
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <Header
          currentEal={currentEal}
          riskScore={currentRiskScore}
          onSimulateEvent={handleSimulateEvent}
          onReset={handleReset}
          isSimulating={isSimulating}
          onToggleNav={() => setIsNavOpen((v) => !v)}
          onGoToLanding={() => setViewMode('landing')}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Global command palette */}
        <CommandPalette
          open={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={navigate}
        />

        {/* Global toast notification */}
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

        {/* Main View Area */}
        <main key={activeTab} className="flex-1 pb-16">
          {activeTab === 'dashboard' && (
            <DashboardView
              dashboardData={dashboardData}
              onNavigate={navigate}
              onSimulateEvent={handleSimulateEvent}
              isSimulating={isSimulating}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsView
              assets={assets}
              onNavigate={navigate}
            />
          )}

          {activeTab === 'vulnerabilities' && (
            <VulnerabilitiesView
              vulnerabilities={vulnerabilities}
              onNavigate={navigate}
            />
          )}

          {activeTab === 'monte_carlo' && (
            <MonteCarloView />
          )}

          {activeTab === 'optimizer' && (
            <OptimizerView
              onNavigate={navigate}
            />
          )}

          {activeTab === 'what_if' && (
            <WhatIfView
              onNavigate={navigate}
            />
          )}

          {activeTab === 'attack_path' && (
            <AttackPathView
              onNavigate={navigate}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceView
              complianceMappings={compliance}
              onNavigate={navigate}
            />
          )}

          {activeTab === 'ingestion' && (
            <IngestionView
              events={events}
              onSimulateEvent={handleSimulateEvent}
              isSimulating={isSimulating}
              lastSimulatedResponse={lastSimulatedResponse}
            />
          )}
        </main>
      </div>
    </div>
  );
}
