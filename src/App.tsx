
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/main-layout';
import { LoginForm } from '@/components/auth/login-form';
import { CampaignProvider } from '@/contexts/campaign-context';

// Page imports
import Index from '@/pages/Index';
import Dashboard from '@/pages/dashboard';
import Campaigns from '@/pages/campaigns';
import CampaignDetails from '@/pages/campaign-details';
import Tasks from '@/pages/tasks';
import Volunteers from '@/pages/volunteers';
import Surveys from '@/pages/surveys';
import Reports from '@/pages/reports';
import Users from '@/pages/users';
import Settings from '@/pages/settings';
import NotFound from '@/pages/NotFound';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-primary-500 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoginForm />
        <Toaster />
      </div>
    );
  }

  return (
    <CampaignProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </MainLayout>
        <Toaster />
      </Router>
    </CampaignProvider>
  );
}

export default App;
