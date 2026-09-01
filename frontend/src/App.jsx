import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './pages/DashboardView';
import AssetsView from './pages/AssetsView';
import VulnerabilitiesView from './pages/VulnerabilitiesView';
import MonteCarloView from './pages/MonteCarloView';
import OptimizerView from './pages/OptimizerView';
import WhatIfView from './pages/WhatIfView';
import AttackPathView from './pages/AttackPathView';
import ComplianceView from './pages/ComplianceView';
import IngestionView from './pages/IngestionView';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const currentEal = dashboardData?.expected_annual_loss || 18400000;
  const currentRiskScore = dashboardData?.enterprise_risk_score || 72;

  return (
    <div className="flex min-h-screen bg-cyber-bg text-cyber-textMain">
      {/* Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        liveEventsCount={events.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          currentEal={currentEal}
          riskScore={currentRiskScore}
          onSimulateEvent={handleSimulateEvent}
          onReset={handleReset}
          isSimulating={isSimulating}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="sticky top-16 z-30 bg-cyan-950/90 border-b border-cyan-500/50 px-6 py-2.5 text-xs text-cyan-200 font-mono flex items-center justify-between shadow-glow-cyan backdrop-blur-md">
            <span>{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-cyan-400 hover:text-white font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        <main className="flex-1 pb-12">
          {activeTab === 'dashboard' && (
            <DashboardView 
              dashboardData={dashboardData} 
              onNavigate={setActiveTab}
              onSimulateEvent={handleSimulateEvent}
              isSimulating={isSimulating}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsView 
              assets={assets} 
              onNavigate={setActiveTab} 
            />
          )}

          {activeTab === 'vulnerabilities' && (
            <VulnerabilitiesView 
              vulnerabilities={vulnerabilities} 
              onNavigate={setActiveTab} 
            />
          )}

          {activeTab === 'monte_carlo' && (
            <MonteCarloView />
          )}

          {activeTab === 'optimizer' && (
            <OptimizerView 
              onNavigate={setActiveTab} 
            />
          )}

          {activeTab === 'what_if' && (
            <WhatIfView 
              onNavigate={setActiveTab} 
            />
          )}

          {activeTab === 'attack_path' && (
            <AttackPathView 
              onNavigate={setActiveTab} 
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceView 
              complianceMappings={compliance} 
              onNavigate={setActiveTab} 
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
