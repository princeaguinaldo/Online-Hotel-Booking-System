import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  Home,
  Users,
  Package,
  DollarSign
} from "lucide-react";
import { RegisteredCustomer } from "./CustomerRegistration";
import { BookingData } from "./BookingForm";

interface CustomerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  customer: RegisteredCustomer | null;
  bookings: (BookingData & { id: string; status: string })[];
}

export function CustomerDashboard({ isOpen, onClose, customer, bookings }: CustomerDashboardProps) {
  if (!customer) return null;

  // Filter bookings for this customer
  const customerBookings = bookings.filter(
    booking => booking.customerDetails.email === customer.email
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'booked': { variant: 'default' as const, label: 'Booked' },
      'checked-in': { variant: 'default' as const, label: 'Checked-In' },
      'completed': { variant: 'secondary' as const, label: 'Completed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.booked;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Account
          </DialogTitle>
          <DialogDescription>
            View your profile information and booking history
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p>{formatDate(customer.registeredDate.toString())}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl mb-1">{customerBookings.length}</div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl mb-1">
                    {customerBookings.filter(b => b.status === 'checked-in').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Stays</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl mb-1">
                    {customerBookings.filter(b => b.status === 'completed').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Bookings List */}
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {customerBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No bookings yet</p>
                    <p className="text-sm">Start by booking a room, banquet hall, or restaurant</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerBookings.map((booking, index) => (
                      <Card key={booking.id} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{booking.room.name}</h4>
                                  {getStatusBadge(booking.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Booking ID: {booking.id}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="text-xl">₱{booking.bookingDetails.totalAmount.toLocaleString()}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Booking Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Check-in</p>
                                  <p className="text-sm">{formatDate(booking.bookingDetails.checkIn)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Check-out</p>
                                  <p className="text-sm">{formatDate(booking.bookingDetails.checkOut)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Guests</p>
                                  <p className="text-sm">{booking.bookingDetails.guests}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Home className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Room Type</p>
                                  <p className="text-sm">{booking.room.type}</p>
                                </div>
                              </div>
                            </div>

                            {/* Payment Info */}
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Advance Payment (30%)</p>
                                  <p className="text-sm">₱{booking.bookingDetails.advanceAmount.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Balance Due</p>
                                <p className="text-sm">
                                  ₱{(booking.bookingDetails.totalAmount - booking.bookingDetails.advanceAmount).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Extras */}
                            {booking.extras && booking.extras.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">Extra Items</p>
                                  <div className="space-y-1">
                                    {booking.extras.map((extra, i) => (
                                      <div key={i} className="flex items-center justify-between text-sm">
                                        <span>{extra.name} (x{extra.quantity})</span>
                                        <span>₱{(extra.pricePerUnit * extra.quantity).toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}

                            {/* In-Stay Additions */}
                            {booking.inStayItems && booking.inStayItems.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">In-Stay Additions</p>
                                  <div className="space-y-1">
                                    {booking.inStayItems.map((item) => (
                                      <div key={item.id} className="flex items-center justify-between text-sm">
                                        <span>{item.name} (x{item.quantity})</span>
                                        <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Special Requests */}
                            {booking.customerDetails.specialRequests && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                                  <p className="text-sm bg-muted p-2 rounded">
                                    {booking.customerDetails.specialRequests}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
