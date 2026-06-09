export interface JiraIssue {
  issueId: string;
  summary: string;
  description: string;
  acceptanceCriteria?: string;
  labels: string[];
  components: string[];
  priority: string;
  issueType: string;
  reporter?: string;
  assignee?: string;
}

export interface Settings {
  jiraUrl: string;
  jiraEmail: string;
  jiraToken: string;
  groqKey: string;
  theme?: 'light' | 'dark';
}

export interface GeneratedTestPlan {
  issueId: string;
  generatedMarkdown: string;
  timestamp: string;
  model: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}
