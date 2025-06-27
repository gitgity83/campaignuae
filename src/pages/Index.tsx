
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-subtle">
          <div className="w-8 h-8 bg-primary-500 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

export default Index;
