import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { LogIn, Mail, Lock } from "lucide-react";
import { RegisteredCustomer } from "./CustomerRegistration";

interface CustomerLoginProps {
  isOpen: boolean;
  onClose: () => void;
  registeredCustomers: RegisteredCustomer[];
  onLoginSuccess: (customer: RegisteredCustomer) => void;
}

export function CustomerLogin({ isOpen, onClose, registeredCustomers, onLoginSuccess }: CustomerLoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Find customer by email
    const customer = registeredCustomers.find(c => c.email === formData.email);

    if (!customer) {
      setError("Invalid email address");
      return;
    }

    // Extract last 5 digits from phone number (remove all non-digit characters)
    const phoneDigits = customer.phone.replace(/\D/g, '');
    const last5Digits = phoneDigits.slice(-5);

    // Check password (last 5 digits of phone number)
    if (formData.password !== last5Digits) {
      setError("Invalid password");
      return;
    }

    // Success
    onLoginSuccess(customer);
    setFormData({ email: "", password: "" });
    setError("");
    onClose();
  };

  const handleClose = () => {
    setFormData({ email: "", password: "" });
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Customer Login
          </DialogTitle>
          <DialogDescription>
            Login to view your bookings and account details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="login-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="login-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="login-password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password (Last 5 digits of your phone)
            </Label>
            <Input
              id="login-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="12345"
              maxLength={5}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the last 5 digits of your registered phone number
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Login
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
