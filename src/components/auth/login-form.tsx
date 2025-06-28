import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Target, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { validatePasswordStrength } from '@/utils/security';
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    login
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in."
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const demoAccounts = [{
    email: 'admin@campaign.com',
    role: 'Admin',
    password: 'SecurePass123!'
  }, {
    email: 'supervisor@campaign.com',
    role: 'Supervisor',
    password: 'SecurePass123!'
  }, {
    email: 'volunteer@campaign.com',
    role: 'Volunteer',
    password: 'SecurePass123!'
  }];
  return <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CampaignUAE</h1>
          <p className="text-gray-600 mt-2">Manage your awareness campaigns</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required className="h-11 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-primary-500 hover:bg-primary-600" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800 font-medium">Security Update</p>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Password requirements: 8+ chars, uppercase, lowercase, number, and special character
                </p>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">Demo accounts:</p>
              <div className="space-y-2">
                {demoAccounts.map(account => <button key={account.email} onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
              }} className="w-full text-left p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-sm">
                    <div className="font-medium">{account.role}</div>
                    <div className="text-gray-600">{account.email}</div>
                    <div className="text-xs text-gray-500">Password: {account.password}</div>
                  </button>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}