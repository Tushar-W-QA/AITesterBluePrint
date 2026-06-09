import React, { useEffect, useState } from 'react';
import { useSettingsStore } from './store/settingsStore';
import { SettingsPanel } from './components/SettingsPanel';
import { TestPlanGenerator } from './components/TestPlanGenerator';
import './index.css';

function App() {
  const { loadSettings, settings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'generator' | 'settings'>('generator');

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <div className={`${settings.theme === 'dark' ? 'dark' : ''} min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800`}> 
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 dark:text-gray-100">
            🧪 Test Plan Generator Gaint
          </h1>
          <p className="text-gray-600">
            Automatically generate comprehensive test plans from Jira issues using GROQ AI
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Test Plan Generator
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'generator' && <TestPlanGenerator />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>
            Built with React + GROQ API (openai/gpt-oss-120b) | Jira Integration | Test Plan Generator
          </p>
          <p className="mt-2">v0.1.0 | Following BLAST Framework</p>
        </div>
      </div>
    </div>
  );
}

export default App;
