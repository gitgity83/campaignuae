
export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'closed';
  startDate: string;
  endDate: string;
  targetCommunitySize: number;
  currentAwarenessLevel: number;
  volunteerSuccessRate: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  customMetrics: CustomMetric[];
  surveys: Survey[];
}

export interface CustomMetric {
  id: string;
  name: string;
  description: string;
  dataType: 'number' | 'percentage' | 'text' | 'boolean';
  unit: string;
  value: any;
  target?: number;
  campaignId: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  campaignId: string;
  createdAt: string;
  isActive: boolean;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'yes_no';
  question: string;
  options?: string[];
  required: boolean;
  order: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId?: string;
  answers: { [questionId: string]: any };
  submittedAt: string;
}

export interface VolunteerPerformance {
  id: string;
  volunteerId: string;
  campaignId: string;
  tasksCompleted: number;
  totalTasks: number;
  qualityScore: number;
  notes: string;
  recordedBy: string;
  recordedAt: string;
}
