import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { UserPlus, Mail, Phone, User, CheckCircle } from "lucide-react";

interface CustomerRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (customerData: RegisteredCustomer) => void;
}

export interface RegisteredCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: Date;
}

export function CustomerRegistration({ isOpen, onClose, onRegister }: CustomerRegistrationProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const registeredCustomer: RegisteredCustomer = {
      id: `CUST${Date.now().toString().slice(-6)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      registeredDate: new Date(),
    };

    onRegister(registeredCustomer);
    setIsSubmitted(true);

    // Reset form after 5 seconds and close
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "" });
      setIsSubmitted(false);
      setErrors({});
      onClose();
    }, 5000);
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", phone: "" });
    setIsSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Customer Registration
          </DialogTitle>
          <DialogDescription>
            Register to make your booking process faster and easier
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Juan Dela Cruz"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="juan.delacruz@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+63 912 345 6789"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Benefits Info */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <h4 className="text-sm mb-2">Benefits of Registration:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Faster booking process</li>
                  <li>✓ Pre-filled information</li>
                  <li>✓ Track your booking history</li>
                  <li>✓ Special offers and promotions</li>
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Register
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl mb-2">Registration Successful!</h3>
              <p className="text-muted-foreground">
                Welcome, {formData.name}!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You can now login using your email and the last 5 digits of your phone number.
              </p>
              <p className="text-sm mt-1 p-2 bg-primary/10 rounded">
                <strong>Your password:</strong> {formData.phone.replace(/\D/g, '').slice(-5)}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}