import React, { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { jiraService } from '../services/jiraService';
import { groqService } from '../services/groqService';
import { fileService } from '../services/fileService';
import { JiraIssue, GeneratedTestPlan, ApiError } from '../types';

export const TestPlanGenerator: React.FC = () => {
  const { settings } = useSettingsStore();
  const [issueId, setIssueId] = useState('KAN-12');
  const [jiraData, setJiraData] = useState<JiraIssue | null>(null);
  const [testPlan, setTestPlan] = useState<GeneratedTestPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [stage, setStage] = useState<'idle' | 'fetching' | 'generating' | 'complete'>('idle');
  const [debugInfo, setDebugInfo] = useState<{ requestUrl: string; status?: number; message: string; details?: string } | null>(null);

  const handleFetchIssue = async () => {
    setError('');
    if (!issueId.trim()) {
      setError('Please enter a Jira Issue ID');
      return;
    }

    if (!settings.jiraUrl || !settings.jiraEmail || !settings.jiraToken) {
      setError('Please configure Jira settings first');
      return;
    }

    setLoading(true);
    setStage('fetching');
    try {
      const result = await jiraService.fetchIssueWithDebug(
        issueId,
        settings.jiraUrl,
        settings.jiraEmail,
        settings.jiraToken
      );
      setJiraData(result.issue);
      setDebugInfo({
        requestUrl: result.debug.requestUrl,
        status: result.debug.status,
        message: 'Fetched issue successfully.',
      });
      setError('');
    } catch (err: any) {
      setError(`Fetch failed: ${err.details || err.message}`);
      setDebugInfo({
        requestUrl: err.requestUrl || 'unknown',
        status: err.status,
        message: err.message || 'Unknown error',
        details: typeof err.details === 'string' ? err.details : JSON.stringify(err.details),
      });
      setJiraData(null);
    } finally {
      setLoading(false);
      setStage('idle');
    }
  };

  const handleGenerateTestPlan = async () => {
    setError('');
    if (!jiraData) {
      setError('No Jira data available. Please fetch an issue first.');
      return;
    }

    if (!settings.groqKey) {
      setError('Please configure GROQ API key in settings');
      return;
    }

    setLoading(true);
    setStage('generating');
    try {
      const plan = await groqService.generateTestPlan(jiraData, settings.groqKey);
      setTestPlan(plan);
      setStage('complete');
      setError('');
    } catch (err: any) {
      setError(`Generation failed: ${err.details || err.message}`);
      setTestPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTestPlan = async () => {
    if (!testPlan) {
      setError('No test plan to save');
      return;
    }

    try {
      await fileService.saveTestPlan(testPlan);
      setError('');
    } catch (err: any) {
      setError(`Save failed: ${err.details || err.message}`);
    }
  };

  const handleCopyMarkdown = async () => {
    if (!testPlan) {
      setError('No test plan to copy');
      return;
    }

    try {
      await fileService.copyToClipboard(testPlan.generatedMarkdown);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Test Plan Generator</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Enter Jira Issue ID (e.g., KAN-12)"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFetchIssue()}
          />
          <button
            className="button-primary"
            onClick={handleFetchIssue}
            disabled={loading}
          >
            {loading && stage === 'fetching' ? (
              <>
                <span className="loading-spinner mr-2"></span>
                Fetching...
              </>
            ) : (
              'Fetch Issue'
            )}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {debugInfo && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200">
            <div className="font-semibold mb-2">Debug Info</div>
            <p><strong>Request URL:</strong> {debugInfo.requestUrl}</p>
            <p><strong>Status:</strong> {debugInfo.status ?? 'N/A'}</p>
            <p><strong>Message:</strong> {debugInfo.message}</p>
            {debugInfo.details && (
              <pre className="mt-2 overflow-x-auto rounded bg-white px-3 py-2 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-100">{debugInfo.details}</pre>
            )}
          </div>
        )}
      </div>

      {/* Jira Data Display */}
      {jiraData && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Jira Issue Details</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">Issue ID</p>
              <p className="text-gray-900">{jiraData.issueId}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Type</p>
              <p className="text-gray-900">{jiraData.issueType}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Priority</p>
              <p className="text-gray-900">{jiraData.priority}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Assignee</p>
              <p className="text-gray-900">{jiraData.assignee || 'Unassigned'}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600 mb-1">Summary</p>
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{jiraData.summary}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600 mb-1">Description</p>
            <p className="text-gray-900 bg-gray-50 p-2 rounded whitespace-pre-wrap text-sm">
              {jiraData.description || 'N/A'}
            </p>
          </div>

          {jiraData.acceptanceCriteria && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-1">Acceptance Criteria</p>
              <p className="text-gray-900 bg-gray-50 p-2 rounded whitespace-pre-wrap text-sm">
                {jiraData.acceptanceCriteria}
              </p>
            </div>
          )}

          {jiraData.labels.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Labels</p>
              <div className="flex flex-wrap gap-2">
                {jiraData.labels.map((label) => (
                  <span
                    key={label}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            className="button-primary w-full"
            onClick={handleGenerateTestPlan}
            disabled={loading}
          >
            {loading && stage === 'generating' ? (
              <>
                <span className="loading-spinner mr-2"></span>
                Generating Test Plan...
              </>
            ) : (
              'Generate Test Plan'
            )}
          </button>
        </div>
      )}

      {/* Test Plan Display */}
      {testPlan && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Generated Test Plan</h3>

          <div className="mb-4 text-sm text-gray-600">
            <p>
              <strong>Issue:</strong> {testPlan.issueId} | <strong>Model:</strong> {testPlan.model}
            </p>
            <p>
              <strong>Generated:</strong> {new Date(testPlan.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200 max-h-96 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{testPlan.generatedMarkdown}</pre>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="button-primary flex-1" onClick={handleSaveTestPlan}>
              📥 Download Markdown
            </button>
            <button className="button-secondary flex-1" onClick={handleCopyMarkdown}>
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
