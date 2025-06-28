
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Target, Eye, EyeOff, CheckCircle, AlertTriangle, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/auth';
import { validatePasswordStrength } from '@/utils/security';

export function RegistrationForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { validateToken, completeRegistration } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, errors: [] as string[] });

  useEffect(() => {
    if (token) {
      const foundUser = validateToken(token);
      if (foundUser) {
        setUser(foundUser);
        setFirstName(foundUser.firstName);
        setLastName(foundUser.lastName);
      }
    }
  }, [token, validateToken]);

  useEffect(() => {
    if (password) {
      setPasswordValidation(validatePasswordStrength(password));
    } else {
      setPasswordValidation({ isValid: false, errors: [] });
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      toast({
        title: "Password requirements not met",
        description: "Please ensure your password meets all security requirements.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (!token) return;

    setIsLoading(true);

    try {
      await completeRegistration({
        token,
        password,
        firstName,
        lastName
      });
      
      setIsComplete(true);
      
      toast({
        title: "Registration completed!",
        description: "Your account has been set up successfully.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-red-600">Invalid Registration Link</CardTitle>
            <CardDescription>
              This registration link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-green-600">Registration Complete!</CardTitle>
            <CardDescription>
              Your account has been set up successfully.
              {user.status === 'pending_approval' && (
                <span className="block mt-2 text-yellow-600">
                  Your account is pending admin approval before you can sign in.
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Registration</h1>
          <p className="text-gray-600 mt-2">Set up your CampaignHub account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Welcome, {user.firstName}!</CardTitle>
            <CardDescription>
              Complete your registration to access the campaign management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {password && (
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      {passwordValidation.isValid ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                      <span className={passwordValidation.isValid ? "text-green-600" : "text-red-600"}>
                        Password meets security requirements
                      </span>
                    </div>
                    {passwordValidation.errors.map((error, index) => (
                      <div key={index} className="flex items-center space-x-2 text-red-600">
                        <X className="w-3 h-3" />
                        <span className="text-xs">{error}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <X className="w-4 h-4" />
                    <span>Passwords do not match</span>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary-500 hover:bg-primary-600"
                disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
              >
                {isLoading ? "Setting up account..." : "Complete Registration"}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              {user.status === 'pending_approval' && (
                <p className="text-sm text-yellow-700 mt-1">
                  Note: Your account will require admin approval before you can sign in.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
