import { create } from 'zustand';
import { Settings } from '../types';

interface SettingsStore {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  loadSettings: () => void;
  clearSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    jiraUrl: '',
    jiraEmail: '',
    jiraToken: '',
    groqKey: '',
    theme: 'light',
  },
  updateSettings: (newSettings) => {
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      localStorage.setItem('jiraTestPlanSettings', JSON.stringify(updated));
      return { settings: updated };
    });
  },
  loadSettings: () => {
    const stored = localStorage.getItem('jiraTestPlanSettings');
    let baseSettings = {
      jiraUrl: '',
      jiraEmail: '',
      jiraToken: '',
      groqKey: '',
      theme: 'light',
    };

    if (stored) {
      try {
        baseSettings = { ...baseSettings, ...JSON.parse(stored) };
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }

    try {
      const env = (import.meta as any).env || {};
      const envValue = (k: string) => {
        const v = env[k] ?? env[`VITE_${k}`] ?? env[`VITE_${k.toUpperCase()}`] ?? env[k.toUpperCase()];
        if (typeof v === 'string') return v.replace(/^'+|'+$/g, '');
        return v;
      };

      const envSettings = {
        jiraUrl: envValue('JIRA_URL') || envValue('VITE_JIRA_URL') || '',
        jiraEmail: envValue('JIRA_EMAIL') || envValue('VITE_JIRA_EMAIL') || '',
        jiraToken: envValue('JIRA_TOKEN') || envValue('VITE_JIRA_TOKEN') || '',
        groqKey: envValue('GROQ_KEY') || envValue('VITE_GROQ_KEY') || '',
        theme: (envValue('THEME') as any) || '',
      };

      const merged = {
        ...baseSettings,
        ...Object.fromEntries(
          Object.entries(envSettings).filter(([, value]) => value !== '' && value !== undefined)
        ),
      };

      set({ settings: merged });
      if (!stored) {
        localStorage.setItem('jiraTestPlanSettings', JSON.stringify(merged));
      }
      return;
    } catch (e) {
      // ignore if import.meta.env is not available
    }

    set({ settings: baseSettings });
  },
  clearSettings: () => {
    set({
      settings: {
        jiraUrl: '',
        jiraEmail: '',
        jiraToken: '',
        groqKey: '',
        theme: 'light',
      },
    });
    localStorage.removeItem('jiraTestPlanSettings');
  },
}));
