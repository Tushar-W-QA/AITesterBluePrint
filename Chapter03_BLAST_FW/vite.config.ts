import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawJiraTarget = env.JIRA_URL || env.VITE_JIRA_URL || '';
  const jiraTarget = rawJiraTarget.replace(/\/+$/, '');

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'JIRA_', 'GROQ_'],
    server: {
      port: 5173,
      open: true,
      proxy: jiraTarget
        ? {
            '/jira': {
              target: jiraTarget,
              changeOrigin: true,
              secure: true,
              rewrite: (path) => path.replace(/^\/jira/, ''),
            },
          }
        : undefined,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  };
});
