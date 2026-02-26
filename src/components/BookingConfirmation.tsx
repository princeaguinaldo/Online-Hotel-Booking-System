import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CheckCircle, Download, Calendar, User, CreditCard, MapPin } from "lucide-react";
import { BookingData } from "./BookingForm";

interface BookingConfirmationProps {
  bookingData: BookingData | null;
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onDownloadReceipt: () => void;
}

export function BookingConfirmation({ 
  bookingData, 
  bookingId, 
  isOpen, 
  onClose, 
  onDownloadReceipt 
}: BookingConfirmationProps) {
  if (!bookingData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <DialogTitle>Booking Confirmed!</DialogTitle>
          </div>
          <DialogDescription>
            Your reservation has been successfully confirmed. Here are your booking details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking ID */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Booking ID</p>
                <p className="text-2xl tracking-wider font-mono bg-muted px-4 py-2 rounded-lg inline-block">
                  {bookingId}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Room:</span>
                <span>{bookingData.room.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span>{new Date(bookingData.bookingDetails.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span>{new Date(bookingData.bookingDetails.checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span>{bookingData.bookingDetails.guests}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Name:</span>
                <span>{bookingData.customerDetails.firstName} {bookingData.customerDetails.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span>{bookingData.customerDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{bookingData.customerDetails.phone}</span>
              </div>
              {bookingData.customerDetails.address && (
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span className="text-right max-w-xs">{bookingData.customerDetails.address}</span>
                </div>
              )}
              {bookingData.customerDetails.specialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Special Requests:</p>
                  <p className="text-sm bg-muted p-2 rounded">{bookingData.customerDetails.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>₱{bookingData.bookingDetails.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Advance Paid:</span>
                <span>₱{bookingData.bookingDetails.advanceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Balance Due:</span>
                <span>₱{(bookingData.bookingDetails.totalAmount - bookingData.bookingDetails.advanceAmount).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span>Card ending in ****{bookingData.paymentDetails.cardNumber.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium mb-2">Important Information:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Please arrive at the reception with a valid ID</li>
                <li>• Check-in time: 3:00 PM | Check-out time: 12:00 PM</li>
                <li>• The remaining balance is payable at check-out</li>
                <li>• Cancellation policy: 24 hours notice required</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onDownloadReceipt} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}