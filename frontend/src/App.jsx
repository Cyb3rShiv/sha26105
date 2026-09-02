import React, { useState, useEffect, useCallback } from 'react';
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
import { api, subscribeConnectivity } from './services/api';
import { AlertTriangle, WifiOff } from 'lucide-react';

const VALID_TABS = [
  'dashboard',
  'assets',
  'vulnerabilities',
  'monte_carlo',
  'optimizer',
  'what_if',
  'attack_path',
  'compliance',
  'ingestion'
];

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const [dashboardData, setDashboardData] = useState(null);
  const [assets, setAssets] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [events, setEvents] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastSimulatedResponse, setLastSimulatedResponse] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Subscribe to backend connectivity state
  useEffect(() => {
    return subscribeConnectivity((status) => {
      setIsOnline(status);
    });
  }, []);

  // Hash-based routing & deep linking support
  const syncRouteFromHash = useCallback(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash || rawHash === 'overview' || rawHash === 'landing') {
      setViewMode('landing');
    } else {
      const matched = VALID_TABS.find(t => t === rawHash || t === rawHash.replace('-', '_'));
      if (matched) {
        setActiveTab(matched);
        setViewMode('app');
      } else {
        setViewMode('landing');
      }
    }
  }, []);

  useEffect(() => {
    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);
    window.addEventListener('popstate', syncRouteFromHash);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromHash);
      window.removeEventListener('popstate', syncRouteFromHash);
    };
  }, [syncRouteFromHash]);

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
      setToastMessage('⚠️ Telemetry simulation failed. Operating on fallback engine.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetState();
      setToastMessage("🔄 Runtime state successfully reset to default FinTrust Bank baseline (EAL ₹1.84 Cr, Score 70).");
      setLastSimulatedResponse(null);
      await fetchGlobalState();
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Reset failed', err);
      setToastMessage("⚠️ Reset failed on server; local baseline restored.");
    }
  };

  const navigate = (tab) => {
    setActiveTab(tab);
    setIsNavOpen(false);
    if (viewMode !== 'app') setViewMode('app');
    window.location.hash = `#${tab}`;
  };

  const handleLaunchConsole = (tab = 'dashboard') => {
    setActiveTab(tab);
    setViewMode('app');
    window.location.hash = `#${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToLanding = () => {
    setViewMode('landing');
    window.location.hash = '#overview';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentEal = dashboardData?.expected_annual_loss || 18400000;
  const currentRiskScore = dashboardData?.enterprise_risk_score || 70;

  // Render full Marketing Landing Page
  if (viewMode === 'landing') {
    return (
      <>
        {!isOnline && (
          <div className="bg-amber-600 text-white text-xs font-mono py-1.5 px-4 text-center flex items-center justify-center gap-2">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Operating in High-Precision Local Fallback Mode (Backend Reconnecting…)</span>
          </div>
        )}
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
        isOnline={isOnline}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {!isOnline && (
          <div className="bg-amber-600 text-white text-xs font-mono py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-xs">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Operating in Local Engine Mode (Backend Reconnecting / Cold-Start)</span>
          </div>
        )}

        <Header
          currentEal={currentEal}
          riskScore={currentRiskScore}
          onSimulateEvent={handleSimulateEvent}
          onReset={handleReset}
          isSimulating={isSimulating}
          isOnline={isOnline}
          onToggleNav={() => setIsNavOpen((v) => !v)}
          onGoToLanding={handleGoToLanding}
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
