import axios from 'axios';
import { JiraIssue, GeneratedTestPlan, ApiError } from '../types';

export const groqService = {
  async generateTestPlan(
    issue: JiraIssue,
    apiKey: string
  ): Promise<GeneratedTestPlan> {
    try {
      const prompt = buildPrompt(issue);

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'openai/gpt-oss-120b',
          messages: [
            {
              role: 'system',
              content: 'You are a QA test plan generator. Generate comprehensive markdown test plans based on Jira issue data. Output ONLY markdown. No explanations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const markdown = response.data.choices[0]?.message?.content || '';

      return {
        issueId: issue.issueId,
        generatedMarkdown: markdown,
        timestamp: new Date().toISOString(),
        model: 'openai/gpt-oss-120b',
      };
    } catch (error: any) {
      const err: ApiError = {
        message: 'Failed to generate test plan',
        status: error.response?.status,
        details: error.response?.data?.error?.message || error.message,
      };
      throw err;
    }
  },
};

function buildPrompt(issue: JiraIssue): string {
  return `Generate a comprehensive markdown test plan based on the following Jira issue:

**Issue ID:** ${issue.issueId}
**Summary:** ${issue.summary}
**Issue Type:** ${issue.issueType}
**Priority:** ${issue.priority}
**Components:** ${issue.components.join(', ') || 'N/A'}
**Labels:** ${issue.labels.join(', ') || 'N/A'}

**Description:**
${issue.description || 'N/A'}

**Acceptance Criteria:**
${issue.acceptanceCriteria || 'N/A'}

**Reporter:** ${issue.reporter || 'N/A'}
**Assignee:** ${issue.assignee || 'N/A'}

Please generate a markdown test plan with the following sections:
- Test Scope
- Test Strategy
- Test Cases (with steps, expected results, and acceptance criteria)
- Test Data Requirements
- Environment Setup
- Success Criteria
- Assumptions and Risks

Use clear markdown formatting with appropriate headers, lists, and tables.`;
}
