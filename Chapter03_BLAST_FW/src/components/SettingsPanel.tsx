import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { Settings } from '../types';
import { jiraService } from '../services/jiraService';

interface SettingsPanelProps {
  onSave?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSave }) => {
  const { settings, updateSettings, clearSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [theme, setTheme] = useState<"light" | "dark">(settings.theme || 'light');
  const [showPassword, setShowPassword] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [credentialStatus, setCredentialStatus] = useState<{ status: 'idle' | 'valid' | 'invalid' | 'loading'; message: string; requestUrl?: string; statusCode?: number; details?: string }>({
    status: 'idle',
    message: '',
  });

  React.useEffect(() => {
    setLocalSettings(settings);
    setTheme(settings.theme || 'light');
  }, [settings]);

  const handleChange = (field: keyof Settings, value: string) => {
    setLocalSettings({ ...localSettings, [field]: value });
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
    onSave?.();
  };

  const handleValidate = async () => {
    setCredentialStatus({ status: 'loading', message: 'Validating Jira credentials...' });

    if (!localSettings.jiraUrl || !localSettings.jiraEmail || !localSettings.jiraToken) {
      setCredentialStatus({ status: 'invalid', message: 'Please fill in Jira URL, email, and token first.' });
      return;
    }

    const result = await jiraService.validateCredentials(
      localSettings.jiraUrl,
      localSettings.jiraEmail,
      localSettings.jiraToken
    );

    setCredentialStatus({
      status: result.success ? 'valid' : 'invalid',
      message: result.message,
      requestUrl: result.requestUrl,
      statusCode: result.status,
      details: typeof result.details === 'string' ? result.details : JSON.stringify(result.details),
    });
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all settings?')) {
      clearSettings();
      setLocalSettings({
        jiraUrl: '',
        jiraEmail: '',
        jiraToken: '',
        groqKey: '',
        theme: 'light',
      });
      setTheme('light');
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-4">
        {/* Jira URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jira Base URL
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="https://your-domain.atlassian.net"
            value={localSettings.jiraUrl}
            onChange={(e) => handleChange('jiraUrl', e.target.value)}
          />
        </div>

        {/* Jira Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jira Email
          </label>
          <input
            type="email"
            className="input-field"
            placeholder="your-email@example.com"
            value={localSettings.jiraEmail}
            onChange={(e) => handleChange('jiraEmail', e.target.value)}
          />
        </div>

        {/* Jira Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jira API Token
          </label>
          <div className="flex gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="Your Jira API token"
              value={localSettings.jiraToken}
              onChange={(e) => handleChange('jiraToken', e.target.value)}
            />
            <button
              className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* GROQ API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GROQ API Key
          </label>
          <div className="flex gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="Your GROQ API key"
              value={localSettings.groqKey}
              onChange={(e) => handleChange('groqKey', e.target.value)}
            />
            <button
              className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
        <div className="flex items-center gap-3">
          <button
            className={`px-3 py-2 rounded-md font-medium transition-colors ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-transparent text-gray-600 hover:bg-gray-700'}`}
            onClick={() => { setTheme('light'); setLocalSettings({ ...localSettings, theme: 'light' }); }}
          >
            Light
          </button>
          <button
            className={`px-3 py-2 rounded-md font-medium transition-colors ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
            onClick={() => { setTheme('dark'); setLocalSettings({ ...localSettings, theme: 'dark' }); }}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Messages */}
      {savedMessage && (
        <div className="success-message">✓ Settings saved successfully</div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-6">
        <button className="button-primary" onClick={handleSave}>
          Save Settings
        </button>
        <button className="button-secondary" onClick={handleClear}>
          Clear Settings
        </button>
        <button
          className="button-secondary"
          onClick={handleValidate}
          disabled={credentialStatus.status === 'loading'}
        >
          {credentialStatus.status === 'loading' ? 'Validating...' : 'Validate Jira Credentials'}
        </button>
      </div>

      {credentialStatus.status !== 'idle' && (
        <div className={`mt-4 rounded-lg p-4 text-sm ${credentialStatus.status === 'valid' ? 'bg-green-50 text-green-900 border border-green-200' : 'bg-red-50 text-red-900 border border-red-200'}`}>
          <p className="font-semibold">{credentialStatus.message}</p>
          {credentialStatus.requestUrl && (
            <p className="mt-2 break-words"><strong>Request URL:</strong> {credentialStatus.requestUrl}</p>
          )}
          {credentialStatus.statusCode && (
            <p><strong>Status Code:</strong> {credentialStatus.statusCode}</p>
          )}
          {credentialStatus.details && (
            <pre className="mt-2 overflow-x-auto rounded bg-white p-2 text-xs text-gray-800 dark:bg-gray-900 dark:text-gray-100">{credentialStatus.details}</pre>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4">
        <p>Note: Your settings are stored in browser localStorage and never sent to external servers.</p>
        <p className="mt-2">
          Model: <strong>openai/gpt-oss-120b</strong> (Free tier via GROQ)
        </p>
      </div>
    </div>
  );
};
