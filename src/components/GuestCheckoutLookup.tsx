import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Search, User, Mail, Phone } from "lucide-react";
import { BookingData } from "./BookingForm";
import { Alert, AlertDescription } from "./ui/alert";

interface GuestCheckoutLookupProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: (BookingData & { id: string; status: string })[];
  onSelectBooking: (booking: BookingData & { id: string; status: string }) => void;
}

export function GuestCheckoutLookup({ isOpen, onClose, bookings, onSelectBooking }: GuestCheckoutLookupProps) {
  const [searchMethod, setSearchMethod] = useState<"bookingId" | "email" | "phone">("bookingId");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<(BookingData & { id: string; status: string })[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    // Filter bookings that are checked-in (ready for checkout)
    const checkedInBookings = bookings.filter(b => b.status === 'checked-in');

    let results: (BookingData & { id: string; status: string })[] = [];

    if (searchMethod === "bookingId") {
      results = checkedInBookings.filter(booking => 
        booking.id.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else if (searchMethod === "email") {
      results = checkedInBookings.filter(booking => 
        booking.customerDetails.email.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else if (searchMethod === "phone") {
      results = checkedInBookings.filter(booking => 
        booking.customerDetails.phone.includes(searchValue)
      );
    }

    setSearchResults(results);
  };

  const handleSelectBooking = (booking: BookingData & { id: string; status: string }) => {
    onSelectBooking(booking);
    // Reset state
    setSearchValue("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleClose = () => {
    setSearchValue("");
    setSearchResults([]);
    setHasSearched(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Guest Checkout
          </DialogTitle>
          <DialogDescription>
            Search for your booking using your booking ID, email, or phone number to proceed with checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={searchMethod === "bookingId" ? "default" : "outline"}
                  onClick={() => {
                    setSearchMethod("bookingId");
                    setSearchValue("");
                    setSearchResults([]);
                    setHasSearched(false);
                  }}
                  className="h-20 flex-col"
                >
                  <Search className="h-6 w-6 mb-2" />
                  Booking ID
                </Button>
                <Button
                  variant={searchMethod === "email" ? "default" : "outline"}
                  onClick={() => {
                    setSearchMethod("email");
                    setSearchValue("");
                    setSearchResults([]);
                    setHasSearched(false);
                  }}
                  className="h-20 flex-col"
                >
                  <Mail className="h-6 w-6 mb-2" />
                  Email
                </Button>
                <Button
                  variant={searchMethod === "phone" ? "default" : "outline"}
                  onClick={() => {
                    setSearchMethod("phone");
                    setSearchValue("");
                    setSearchResults([]);
                    setHasSearched(false);
                  }}
                  className="h-20 flex-col"
                >
                  <Phone className="h-6 w-6 mb-2" />
                  Phone
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="searchValue">
                {searchMethod === "bookingId" && "Enter Booking ID"}
                {searchMethod === "email" && "Enter Email Address"}
                {searchMethod === "phone" && "Enter Phone Number"}
              </Label>
              <Input
                id="searchValue"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchMethod === "bookingId" ? "e.g., BK123456" :
                  searchMethod === "email" ? "e.g., guest@example.com" :
                  "e.g., +63 123 456 7890"
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4">
              {searchResults.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No checked-in bookings found. Please verify your information or contact the front desk for assistance.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-sm">Found {searchResults.length} booking{searchResults.length !== 1 ? 's' : ''}</h3>
                  {searchResults.map((booking) => (
                    <Card key={booking.id} className="cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{booking.id}</span>
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Checked In</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{booking.customerDetails.firstName} {booking.customerDetails.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{booking.customerDetails.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{booking.customerDetails.phone}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Room: </span>
                              <span>{booking.room.name}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Check-in: </span>
                              <span>{new Date(booking.bookingDetails.checkIn).toLocaleDateString()}</span>
                              <span className="mx-2">→</span>
                              <span className="text-muted-foreground">Check-out: </span>
                              <span>{new Date(booking.bookingDetails.checkOut).toLocaleDateString()}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Total Amount: </span>
                              <span className="font-semibold">₱{booking.bookingDetails.totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                          <Button onClick={() => handleSelectBooking(booking)}>
                            Proceed to Checkout
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}