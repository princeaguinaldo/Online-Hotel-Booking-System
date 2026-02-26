import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { CalendarDays, Users } from "lucide-react";

interface SearchFormProps {
  onSearch?: (data: SearchData) => void;
}

export interface SearchData {
  type: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [searchData, setSearchData] = useState<SearchData>({
    type: "room",
    checkIn: "",
    checkOut: "",
    guests: "2"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const handleInputChange = (field: keyof SearchData, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm text-foreground">Booking Type</label>
          <Select value={searchData.type} onValueChange={(value) => handleInputChange("type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="room">Hotel Room</SelectItem>
              <SelectItem value="banquet">Banquet Hall</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Check In
          </label>
          <Input
            type="date"
            value={searchData.checkIn}
            onChange={(e) => handleInputChange("checkIn", e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Check Out
          </label>
          <Input
            type="date"
            value={searchData.checkOut}
            onChange={(e) => handleInputChange("checkOut", e.target.value)}
            min={searchData.checkIn || new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Guests
          </label>
          <Select value={searchData.guests} onValueChange={(value) => handleInputChange("guests", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Guest{num > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" className="w-full">
          Search Availability
        </Button>
      </form>
    </Card>
  );
}