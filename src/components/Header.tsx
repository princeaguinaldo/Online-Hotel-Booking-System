import { Button } from "./ui/button";
import { Calendar, Users, Utensils, Building, UserCheck, LogOut, UserPlus, LogIn } from "lucide-react";

interface HeaderProps {
  onManagementClick: () => void;
  onCheckoutClick: () => void;
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

export function Header({ onManagementClick, onCheckoutClick, onRegisterClick, onLoginClick }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">AAA Hotel</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#rooms" className="text-muted-foreground hover:text-foreground transition-colors">
              Rooms
            </a>
            <a href="#banquets" className="text-muted-foreground hover:text-foreground transition-colors">
              Banquet Halls
            </a>
            <a href="#restaurants" className="text-muted-foreground hover:text-foreground transition-colors">
              Restaurants
            </a>
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCheckoutClick}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Guest Checkout
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onManagementClick}
              className="flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Staff Portal
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={onLoginClick}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
            <Button 
              size="sm"
              onClick={onRegisterClick}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}