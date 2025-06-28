
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { UserRole, CreateUserData } from "@/types/auth";
import { Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const { user, createUser } = useAuth();
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'volunteer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registrationLink, setRegistrationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canCreateRole = (role: UserRole) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'supervisor' && role === 'volunteer') return true;
    return false;
  };

  const availableRoles: UserRole[] = user?.role === 'admin' 
    ? ['admin', 'supervisor', 'volunteer'] 
    : ['volunteer'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createUser(formData);
      setRegistrationLink(result.registrationLink);
      
      toast({
        title: "User created successfully",
        description: `${formData.firstName} ${formData.lastName} has been created. Share the registration link with them.`,
      });
    } catch (error) {
      toast({
        title: "Error creating user",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (registrationLink) {
      await navigator.clipboard.writeText(registrationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Registration link copied",
        description: "The registration link has been copied to your clipboard.",
      });
    }
  };

  const handleFinish = () => {
    onSuccess();
    setRegistrationLink(null);
    setFormData({ email: '', firstName: '', lastName: '', role: 'volunteer' });
  };

  if (registrationLink) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>User Created Successfully!</CardTitle>
          <CardDescription>
            Share this registration link with {formData.firstName} {formData.lastName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2">Registration Link:</p>
            <p className="text-xs font-mono break-all">{registrationLink}</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="flex-1"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button onClick={handleFinish} className="flex-1">
              Done
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            The user will need to click this link to set their password and complete registration.
            {user?.role === 'supervisor' && formData.role === 'volunteer' && 
              " Admin approval will be required before they can access the system."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
        <CardDescription>
          Add a new team member to the campaign system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role} disabled={!canCreateRole(role)}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
