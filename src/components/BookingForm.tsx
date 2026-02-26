import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { CreditCard, User, Mail, Phone, MapPin, Plus, Minus } from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  amenities: string[];
  capacity: number;
  available: boolean;
  description: string;
}

interface BookingFormProps {
  room: Room | null;
  searchData: {
    checkIn: string;
    checkOut: string;
    guests: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (bookingData: BookingData) => void;
}

export interface BookingData {
  room: Room;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    specialRequests: string;
  };
  paymentDetails: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
  };
  bookingDetails: {
    checkIn: string;
    checkOut: string;
    guests: string;
    totalAmount: number;
    advanceAmount: number;
  };
  extras: {
    name: string;
    quantity: number;
    pricePerUnit: number;
  }[];
  inStayItems?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    addedDate: Date;
  }[];
}

export function BookingForm({ room, searchData, isOpen, onClose, onConfirmBooking }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    specialRequests: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });
  const [extras, setExtras] = useState<{ name: string; quantity: number; pricePerUnit: number }[]>([]);

  const handleAddExtra = (name: string, price: number) => {
    setExtras(prev => {
      const existing = prev.find(extra => extra.name === name);
      if (existing) {
        return prev.map(extra => 
          extra.name === name ? { ...extra, quantity: extra.quantity + 1 } : extra
        );
      } else {
        return [...prev, { name, quantity: 1, pricePerUnit: price }];
      }
    });
  };

  const handleRemoveExtra = (name: string) => {
    setExtras(prev => {
      const existing = prev.find(extra => extra.name === name);
      if (existing && existing.quantity > 1) {
        return prev.map(extra => 
          extra.name === name ? { ...extra, quantity: extra.quantity - 1 } : extra
        );
      } else {
        return prev.filter(extra => extra.name !== name);
      }
    });
  };

  if (!room || !searchData) return null;

  const calculateNights = () => {
    const checkIn = new Date(searchData.checkIn);
    const checkOut = new Date(searchData.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  };

  const nights = calculateNights();
  const totalAmount = room.price * nights;
  const extrasTotal = extras.reduce((acc, extra) => acc + extra.quantity * extra.pricePerUnit, 0);
  const totalWithExtras = totalAmount + extrasTotal;
  const advanceWithExtras = Math.round(totalWithExtras * 0.3); // 30% advance

  const handleCustomerDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData: BookingData = {
      room,
      customerDetails,
      paymentDetails,
      bookingDetails: {
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
        guests: searchData.guests,
        totalAmount: totalWithExtras,
        advanceAmount: advanceWithExtras
      },
      extras
    };
    
    onConfirmBooking(bookingData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {room.name}</DialogTitle>
          <DialogDescription>
            Complete your booking details and secure your reservation.
          </DialogDescription>
        </DialogHeader>

        {/* Booking Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Room:</span>
                <span>{room.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span>{new Date(searchData.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span>{new Date(searchData.checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights:</span>
                <span>{nights}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span>{searchData.guests}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Rate per night:</span>
                <span>₱{room.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Room Charges:</span>
                <span>₱{totalAmount.toLocaleString()}</span>
              </div>
              {extras.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Extras:</span>
                    <span>₱{extrasTotal.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span>₱{totalWithExtras.toLocaleString()}</span>
                  </div>
                </>
              )}
              {extras.length === 0 && (
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span>₱{totalAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-primary">
                <span>Advance Payment (30%):</span>
                <span>₱{advanceWithExtras.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {step === 1 && (
          <form onSubmit={handleCustomerDetailsSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5" />
              <h3 className="text-lg">Customer Details</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={customerDetails.firstName}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={customerDetails.lastName}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Textarea
                id="address"
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={customerDetails.specialRequests}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>

            {/* Extra Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Extra Options (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Extra Pillows', price: 150 },
                  { name: 'Extra Bedding Set', price: 300 },
                  { name: 'Extra Towels', price: 100 },
                  { name: 'Bathrobe', price: 250 },
                  { name: 'Breakfast for 2', price: 800 },
                  { name: 'Airport Transport', price: 1200 }
                ].map((option) => {
                  const selectedExtra = extras.find(extra => extra.name === option.name);
                  const quantity = selectedExtra?.quantity || 0;
                  return (
                    <div key={option.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p>{option.name}</p>
                        <p className="text-sm text-muted-foreground">₱{option.price.toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveExtra(option.name)}
                          disabled={quantity === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleAddExtra(option.name, option.price)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5" />
              <h3 className="text-lg">Payment Details</h3>
            </div>

            <div>
              <Label htmlFor="cardholderName">Cardholder Name *</Label>
              <Input
                id="cardholderName"
                value={paymentDetails.cardholderName}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expiryMonth">Month *</Label>
                <Input
                  id="expiryMonth"
                  value={paymentDetails.expiryMonth}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryMonth: e.target.value }))}
                  placeholder="MM"
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="expiryYear">Year *</Label>
                <Input
                  id="expiryYear"
                  value={paymentDetails.expiryYear}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryYear: e.target.value }))}
                  placeholder="YY"
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Pay ₱{advanceWithExtras.toLocaleString()} & Confirm Booking
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}