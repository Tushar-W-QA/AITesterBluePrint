import axios from 'axios';
import { JiraIssue, ApiError } from '../types';

function sanitizeBaseUrl(baseUrl: string) {
  return baseUrl?.replace(/\/+$/, '') || '';
}

function buildJiraUrl(baseUrl: string, path: string) {
  const sanitizedUrl = sanitizeBaseUrl(baseUrl);
  return sanitizedUrl && (sanitizedUrl.startsWith('http') || sanitizedUrl.startsWith('https'))
    ? `/jira${path}`
    : `${sanitizedUrl}${path}`;
}

function buildJiraAuthToken(email: string, token: string) {
  const creds = `${email}:${token}`;
  return typeof btoa === 'function'
    ? btoa(unescape(encodeURIComponent(creds)))
    : Buffer.from(creds).toString('base64');
}

function normalizeApiError(error: any, requestUrl: string): ApiError & { requestUrl: string } {
  return {
    message: error.response?.data?.errorMessages?.[0] || error.response?.data?.error || error.message || 'Unknown Jira error',
    status: error.response?.status,
    details: error.response?.data || error.message,
    requestUrl,
  };
}

export const jiraService = {
  async fetchIssue(
    issueId: string,
    baseUrl: string,
    email: string,
    token: string
  ): Promise<JiraIssue> {
    const result = await this.fetchIssueWithDebug(issueId, baseUrl, email, token);
    return result.issue;
  },

  async fetchIssueWithDebug(
    issueId: string,
    baseUrl: string,
    email: string,
    token: string
  ): Promise<{ issue: JiraIssue; debug: { requestUrl: string; status: number } }> {
    const requestUrl = buildJiraUrl(baseUrl, `/rest/api/3/issue/${issueId}`);
    try {
      const auth = buildJiraAuthToken(email, token);
      const response = await axios.get(requestUrl, {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });

      const issue = response.data;
      return {
        issue: {
          issueId: issue.key,
          summary: issue.fields?.summary || '',
          description: issue.fields?.description?.content?.[0]?.content?.[0]?.text || issue.fields?.description || '',
          acceptanceCriteria: extractCustomField(issue.fields, 'acceptanceCriteria') || '',
          labels: issue.fields?.labels || [],
          components: (issue.fields?.components || []).map((c: any) => c.name),
          priority: issue.fields?.priority?.name || 'Not Set',
          issueType: issue.fields?.issuetype?.name || 'Unknown',
          reporter: issue.fields?.reporter?.displayName || '',
          assignee: issue.fields?.assignee?.displayName || '',
        },
        debug: {
          requestUrl,
          status: response.status,
        },
      };
    } catch (error: any) {
      throw normalizeApiError(error, requestUrl);
    }
  },

  async validateCredentials(
    baseUrl: string,
    email: string,
    token: string
  ): Promise<{ success: boolean; message: string; requestUrl: string; status?: number; details?: any }> {
    const requestUrl = buildJiraUrl(baseUrl, '/rest/api/3/myself');
    try {
      const auth = buildJiraAuthToken(email, token);
      const response = await axios.get(requestUrl, {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });
      return {
        success: true,
        message: `Authenticated as ${response.data.displayName || 'Jira user'}`,
        requestUrl,
        status: response.status,
        details: response.data,
      };
    } catch (error: any) {
      const apiError = normalizeApiError(error, requestUrl);
      return {
        success: false,
        message: apiError.message || 'Failed to validate credentials',
        requestUrl: apiError.requestUrl,
        status: apiError.status,
        details: apiError.details,
      };
    }
  },
};

function extractCustomField(fields: any, fieldName: string): string {
  // Try to find custom fields that might contain acceptance criteria
  const possibleKeys = [
    'customfield_10000',
    'customfield_10001',
    'customfield_10002',
    'customfield_10003',
    'customfield_10004',
  ];

  for (const key of possibleKeys) {
    if (fields[key]) {
      return typeof fields[key] === 'string' ? fields[key] : JSON.stringify(fields[key]);
    }
  }

  return '';
}
