import { GeneratedTestPlan } from '../types';

export const fileService = {
  async saveTestPlan(testPlan: GeneratedTestPlan): Promise<{
    success: boolean;
    filePath: string;
    fileName: string;
  }> {
    try {
      const fileName = `${testPlan.issueId}-test-plan.md`;
      const content = buildFileContent(testPlan);

      // Create a blob and download
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        filePath: `test-plans/${fileName}`,
        fileName: fileName,
      };
    } catch (error: any) {
      throw {
        message: 'Failed to save test plan',
        details: error.message,
      };
    }
  },

  copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  },
};

function buildFileContent(testPlan: GeneratedTestPlan): string {
  return `# Test Plan: ${testPlan.issueId}

**Generated:** ${new Date(testPlan.timestamp).toLocaleString()}
**Model:** ${testPlan.model}
**Tool:** Jira Test Plan Generator

---

${testPlan.generatedMarkdown}
`;
}
