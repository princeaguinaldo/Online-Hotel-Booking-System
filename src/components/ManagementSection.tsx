import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, User, Calendar, CreditCard, CheckCircle, Clock, Download, Eye, ShoppingCart } from "lucide-react";
import { BookingData } from "./BookingForm";
import { CheckoutSection, AdditionalCharge } from "./CheckoutSection";
import { InStayAdditions, AddedItem } from "./InStayAdditions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface ManagementSectionProps {
  bookings: BookingData[];
  onCheckIn: (bookingId: string) => void;
  onCheckOut: (bookingId: string) => void;
  onGenerateReceipt: (bookingId: string) => void;
  onAddInStayItems: (bookingId: string, items: AddedItem[]) => void;
}

interface BookingWithStatus extends BookingData {
  id: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'completed';
  createdAt: Date;
}

export function ManagementSection({ bookings, onCheckIn, onCheckOut, onGenerateReceipt, onAddInStayItems }: ManagementSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState<BookingWithStatus | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCheckInSuccessOpen, setIsCheckInSuccessOpen] = useState(false);
  const [checkInBookingId, setCheckInBookingId] = useState("");
  
  // Convert bookings to include status and ID - preserve existing status
  const bookingsWithStatus: BookingWithStatus[] = bookings.map((booking) => {
    // Map 'booked' status to 'confirmed' for display
    const displayStatus = booking.status === 'booked' ? 'confirmed' : booking.status;
    
    return {
      ...booking,
      status: displayStatus as 'confirmed' | 'checked-in' | 'checked-out' | 'completed',
      createdAt: booking.createdAt || new Date()
    };
  });

  const filteredBookings = bookingsWithStatus.filter(booking => 
    booking.customerDetails.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerDetails.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'checked-in':
        return <Badge className="bg-green-100 text-green-800">Checked In</Badge>;
      case 'checked-out':
        return <Badge className="bg-gray-100 text-gray-800">Checked Out</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const todayBookings = filteredBookings.filter(booking => {
    const today = new Date().toDateString();
    const checkInDate = new Date(booking.bookingDetails.checkIn).toDateString();
    return checkInDate === today;
  });

  const upcomingBookings = filteredBookings.filter(booking => {
    const today = new Date();
    const checkInDate = new Date(booking.bookingDetails.checkIn);
    return checkInDate > today;
  });

  const checkedInBookings = filteredBookings.filter(booking => booking.status === 'checked-in');

  const handleOpenCheckout = (booking: BookingWithStatus) => {
    setSelectedBookingForCheckout(booking);
    setIsCheckoutOpen(true);
  };

  const handleCheckIn = (bookingId: string) => {
    setCheckInBookingId(bookingId);
    setIsCheckInSuccessOpen(true);
    onCheckIn(bookingId);
  };

  const handleCheckoutComplete = (bookingId: string, additionalCharges: AdditionalCharge[], finalTotal: number) => {
    onCheckOut(bookingId);
    setIsCheckoutOpen(false);
    setSelectedBookingForCheckout(null);
  };

  return (
    <section id="management" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl mb-4">Hotel Management</h2>
          <p className="text-muted-foreground">Manage bookings, check-ins, and check-outs</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today's Arrivals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{todayBookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Upcoming Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{upcomingBookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Currently Checked In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{checkedInBookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{filteredBookings.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Management Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="today">Today's Arrivals</TabsTrigger>
            <TabsTrigger value="checked-in">Checked In</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <BookingTable 
              bookings={filteredBookings} 
              onCheckIn={handleCheckIn}
              onCheckOut={handleOpenCheckout}
              onGenerateReceipt={onGenerateReceipt}
              onAddInStayItems={onAddInStayItems}
            />
          </TabsContent>
          
          <TabsContent value="today">
            <BookingTable 
              bookings={todayBookings} 
              onCheckIn={handleCheckIn}
              onCheckOut={handleOpenCheckout}
              onGenerateReceipt={onGenerateReceipt}
              onAddInStayItems={onAddInStayItems}
            />
          </TabsContent>
          
          <TabsContent value="checked-in">
            <BookingTable 
              bookings={checkedInBookings} 
              onCheckIn={handleCheckIn}
              onCheckOut={handleOpenCheckout}
              onGenerateReceipt={onGenerateReceipt}
              onAddInStayItems={onAddInStayItems}
            />
          </TabsContent>
          
          <TabsContent value="upcoming">
            <BookingTable 
              bookings={upcomingBookings} 
              onCheckIn={handleCheckIn}
              onCheckOut={handleOpenCheckout}
              onGenerateReceipt={onGenerateReceipt}
              onAddInStayItems={onAddInStayItems}
            />
          </TabsContent>
        </Tabs>

        <CheckoutSection 
          booking={selectedBookingForCheckout}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onCheckoutComplete={handleCheckoutComplete}
        />

        {/* Check-in Success Dialog */}
        <Dialog open={isCheckInSuccessOpen} onOpenChange={setIsCheckInSuccessOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Successfully Checked In
              </DialogTitle>
              <DialogDescription>
                Booking {checkInBookingId} has been successfully checked in.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={() => setIsCheckInSuccessOpen(false)}>
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

interface BookingTableProps {
  bookings: BookingWithStatus[];
  onCheckIn: (bookingId: string) => void;
  onCheckOut: (booking: BookingWithStatus) => void;
  onGenerateReceipt: (bookingId: string) => void;
  onAddInStayItems: (bookingId: string, items: AddedItem[]) => void;
}

function BookingTable({ bookings, onCheckIn, onCheckOut, onGenerateReceipt, onAddInStayItems }: BookingTableProps) {
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<BookingWithStatus | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBookingForInStayItems, setSelectedBookingForInStayItems] = useState<BookingWithStatus | null>(null);
  const [isInStayItemsOpen, setIsInStayItemsOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'checked-in':
        return <Badge className="bg-green-100 text-green-800">Checked In</Badge>;
      case 'checked-out':
        return <Badge className="bg-gray-100 text-gray-800">Checked Out</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewDetails = (booking: BookingWithStatus) => {
    setSelectedBookingForDetails(booking);
    setIsDetailsOpen(true);
  };

  const handleOpenInStayItems = (booking: BookingWithStatus) => {
    setSelectedBookingForInStayItems(booking);
    setIsInStayItemsOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono">{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        <div>{booking.customerDetails.firstName} {booking.customerDetails.lastName}</div>
                        <div className="text-sm text-muted-foreground">{booking.customerDetails.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.room.name}</TableCell>
                    <TableCell>{new Date(booking.bookingDetails.checkIn).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.bookingDetails.checkOut).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>₱{booking.bookingDetails.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {booking.status === 'confirmed' && (
                          <Button size="sm" onClick={() => onCheckIn(booking.id)}>
                            Check In
                          </Button>
                        )}
                        {booking.status === 'checked-in' && (
                          <Button size="sm" onClick={() => onCheckOut(booking)}>
                            Check Out
                          </Button>
                        )}
                        {booking.status === 'completed' && (
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(booking)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        )}
                        {booking.status !== 'completed' && (
                          <Button size="sm" variant="outline" onClick={() => onGenerateReceipt(booking.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {booking.status === 'checked-in' && (
                          <Button size="sm" variant="outline" onClick={() => handleOpenInStayItems(booking)}>
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete booking information for {selectedBookingForDetails?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedBookingForDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm">Name: </span>
                      <span className="text-sm">{selectedBookingForDetails.customerDetails.firstName} {selectedBookingForDetails.customerDetails.lastName}</span>
                    </div>
                    <div>
                      <span className="text-sm">Email: </span>
                      <span className="text-sm">{selectedBookingForDetails.customerDetails.email}</span>
                    </div>
                    <div>
                      <span className="text-sm">Phone: </span>
                      <span className="text-sm">{selectedBookingForDetails.customerDetails.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-2">Booking Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm">Booking ID: </span>
                      <span className="text-sm font-mono">{selectedBookingForDetails.id}</span>
                    </div>
                    <div>
                      <span className="text-sm">Status: </span>
                      <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
                    </div>
                    <div>
                      <span className="text-sm">Room: </span>
                      <span className="text-sm">{selectedBookingForDetails.room.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Stay Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm">Check-in: </span>
                    <span className="text-sm">{new Date(selectedBookingForDetails.bookingDetails.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sm">Check-out: </span>
                    <span className="text-sm">{new Date(selectedBookingForDetails.bookingDetails.checkOut).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sm">Guests: </span>
                    <span className="text-sm">{selectedBookingForDetails.bookingDetails.guests}</span>
                  </div>
                </div>
              </div>

              {selectedBookingForDetails.bookingDetails.extraOptions && selectedBookingForDetails.bookingDetails.extraOptions.length > 0 && (
                <div>
                  <h3 className="text-sm text-muted-foreground mb-2">Extra Options</h3>
                  <div className="space-y-1">
                    {selectedBookingForDetails.bookingDetails.extraOptions.map((option, index) => (
                      <div key={index} className="text-sm">
                        • {option}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Payment</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm">Total Amount: </span>
                    <span className="text-sm">₱{selectedBookingForDetails.bookingDetails.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onGenerateReceipt(selectedBookingForDetails.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* In-Stay Items Dialog */}
      <InStayAdditions
        booking={selectedBookingForInStayItems}
        isOpen={isInStayItemsOpen}
        onClose={() => setIsInStayItemsOpen(false)}
        onAddItems={(bookingId, items) => {
          onAddInStayItems(bookingId, items);
          setIsInStayItemsOpen(false);
        }}
      />
    </>
  );
}