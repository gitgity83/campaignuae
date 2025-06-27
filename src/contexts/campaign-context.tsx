
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActionPlanTask } from '@/components/campaigns/action-plan-builder';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  progress: number;
  totalTasks: number;
  completedTasks: number;
  assignedUsers: number;
  createdAt: string;
  endDate: string;
  actionPlan?: ActionPlanTask[];
}

interface CampaignContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  getCampaign: (id: string) => Campaign | undefined;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Community Outreach 2024',
    description: 'Engaging with local communities to increase awareness',
    status: 'active',
    progress: 65,
    totalTasks: 20,
    completedTasks: 13,
    assignedUsers: 8,
    createdAt: '2024-01-15',
    endDate: '2024-03-30',
    actionPlan: [
      {
        id: '1',
        title: 'Community Survey Design',
        description: 'Create comprehensive survey to gather community feedback',
        assignedEmails: ['sarah@example.com', 'mike@example.com'],
        deadline: '2024-02-15',
        status: 'completed',
        notes: 'Survey completed and reviewed by stakeholders',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Door-to-Door Campaign',
        description: 'Organize volunteers for neighborhood canvassing',
        assignedEmails: ['volunteers@example.com'],
        deadline: '2024-03-01',
        status: 'in-progress',
        notes: 'Contact local volunteer coordinator: John Doe (555-123-4567)',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Community Event Planning',
        description: 'Plan and execute community engagement event',
        assignedEmails: ['events@example.com', 'sarah@example.com'],
        deadline: '2024-03-15',
        status: 'not-started',
        notes: 'Venue: Community Center, Budget: $2000',
        priority: 'high'
      }
    ]
  },
  {
    id: '2',
    name: 'Digital Marketing Push',
    description: 'Social media and online advertising campaign',
    status: 'active',
    progress: 45,
    totalTasks: 15,
    completedTasks: 7,
    assignedUsers: 5,
    createdAt: '2024-02-01',
    endDate: '2024-04-15',
    actionPlan: []
  },
  {
    id: '3',
    name: 'Volunteer Training Program',
    description: 'Training new volunteers for field operations',
    status: 'completed',
    progress: 100,
    totalTasks: 12,
    completedTasks: 12,
    assignedUsers: 15,
    createdAt: '2024-01-01',
    endDate: '2024-02-28',
    actionPlan: []
  }
];

const STORAGE_KEY = 'campaigns-data';

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // Load campaigns from localStorage or use mock data
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCampaigns(JSON.parse(stored));
      } catch {
        setCampaigns(mockCampaigns);
      }
    } else {
      setCampaigns(mockCampaigns);
    }
  }, []);

  useEffect(() => {
    // Save campaigns to localStorage whenever they change
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }, [campaigns]);

  const addCampaign = (campaign: Campaign) => {
    console.log('Adding campaign:', campaign);
    setCampaigns(prev => [...prev, campaign]);
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    console.log('Updating campaign:', id, updates);
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === id ? { ...campaign, ...updates } : campaign
      )
    );
  };

  const getCampaign = (id: string) => {
    return campaigns.find(campaign => campaign.id === id);
  };

  return (
    <CampaignContext.Provider value={{ campaigns, addCampaign, updateCampaign, getCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
}
