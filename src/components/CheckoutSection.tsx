import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { CreditCard, User, Calendar, DollarSign, Plus, Trash2, FileText, Download, Receipt } from "lucide-react";
import { BookingData } from "./BookingForm";

interface CheckoutSectionProps {
  booking: BookingData & { id: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckoutComplete: (bookingId: string, additionalCharges: AdditionalCharge[], finalTotal: number) => void;
}

export interface AdditionalCharge {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

export function CheckoutSection({ booking, isOpen, onClose, onCheckoutComplete }: CheckoutSectionProps) {
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([]);
  const [newCharge, setNewCharge] = useState({ description: "", amount: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState<"review" | "payment" | "receipt">("review");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: ""
  });

  if (!booking) return null;

  const calculateNights = () => {
    const checkIn = new Date(bookingDetails.checkIn);
    const checkOut = new Date(bookingDetails.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  };

  const { bookingDetails, customerDetails, room, extras = [] } = booking;
  const advancePaid = bookingDetails.advanceAmount;
  
  // Calculate room charges and extras separately for display
  const roomOnlyCharges = room.price * calculateNights();
  const extrasCharges = extras.reduce((sum, extra) => sum + (extra.quantity * extra.pricePerUnit), 0);
  const totalRoomCharges = bookingDetails.totalAmount; // This already includes extras
  
  const additionalTotal = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const grandTotal = totalRoomCharges + additionalTotal;
  const balanceDue = grandTotal - advancePaid;

  const handleAddCharge = () => {
    if (newCharge.description && newCharge.amount) {
      const charge: AdditionalCharge = {
        id: Date.now().toString(),
        description: newCharge.description,
        amount: parseFloat(newCharge.amount),
        date: new Date()
      };
      setAdditionalCharges([...additionalCharges, charge]);
      setNewCharge({ description: "", amount: "" });
    }
  };

  const handleRemoveCharge = (id: string) => {
    setAdditionalCharges(additionalCharges.filter(charge => charge.id !== id));
  };

  const handleProceedToPayment = () => {
    setStep("payment");
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("receipt");
  };

  const handleCompleteCheckout = () => {
    onCheckoutComplete(booking.id, additionalCharges, grandTotal);
    onClose();
    // Reset state
    setAdditionalCharges([]);
    setStep("review");
    setPaymentDetails({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardholderName: ""
    });
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log("Downloading receipt...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Guest Checkout - {booking.id}
          </DialogTitle>
          <DialogDescription>
            Review charges, process final payment, and generate receipt for guest checkout.
          </DialogDescription>
        </DialogHeader>

        {step === "review" && (
          <div className="space-y-6">
            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{customerDetails.firstName} {customerDetails.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{customerDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{customerDetails.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room</p>
                    <p>{room.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stay Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Stay Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in Date</span>
                    <span>{new Date(bookingDetails.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out Date</span>
                    <span>{new Date(bookingDetails.checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of Nights</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of Guests</span>
                    <span>{bookingDetails.guests}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Rate per Night</span>
                    <span>₱{room.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Charges ({calculateNights()} nights)</span>
                    <span>₱{roomOnlyCharges.toLocaleString()}</span>
                  </div>
                  {extras && extras.length > 0 && (
                    <>
                      <Separator />
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-2">Booked Extras:</p>
                        {extras.map((extra, index) => (
                          <div key={index} className="flex justify-between mb-1">
                            <span>{extra.name} (x{extra.quantity})</span>
                            <span>₱{(extra.quantity * extra.pricePerUnit).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <span>Extras Subtotal</span>
                        <span>₱{extrasCharges.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total Room Charges</span>
                    <span>₱{totalRoomCharges.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Charges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5" />
                  Additional Charges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Charge */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Description (e.g., Room Service, Minibar)"
                      value={newCharge.description}
                      onChange={(e) => setNewCharge({ ...newCharge, description: e.target.value })}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newCharge.amount}
                      onChange={(e) => setNewCharge({ ...newCharge, amount: e.target.value })}
                    />
                  </div>
                  <Button type="button" onClick={handleAddCharge} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Charges List */}
                {additionalCharges.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {additionalCharges.map((charge) => (
                        <TableRow key={charge.id}>
                          <TableCell>{charge.description}</TableCell>
                          <TableCell>{charge.date.toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">₱{charge.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveCharge(charge.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2}>Subtotal - Additional Charges</TableCell>
                        <TableCell className="text-right">₱{additionalTotal.toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}

                {additionalCharges.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No additional charges added</p>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Charges</span>
                    <span>₱{totalRoomCharges.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Additional Charges</span>
                    <span>₱{additionalTotal.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Grand Total</span>
                    <span>₱{grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Advance Paid (30%)</span>
                    <span>- ₱{advancePaid.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span>Balance Due</span>
                    <Badge variant="destructive" className="text-base px-3 py-1">
                      ₱{balanceDue.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleProceedToPayment} className="flex-1">
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            {/* Payment Summary Card */}
            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Amount to Pay</p>
                  <p className="text-3xl">₱{balanceDue.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="h-20 flex-col"
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    Credit/Debit
                  </Button>
                  <Button
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("cash")}
                    className="h-20 flex-col"
                  >
                    <DollarSign className="h-6 w-6 mb-2" />
                    Cash
                  </Button>
                  <Button
                    variant={paymentMethod === "bank" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("bank")}
                    className="h-20 flex-col"
                  >
                    <Receipt className="h-6 w-6 mb-2" />
                    Bank Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details Form (only for card payment) */}
            {paymentMethod === "card" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5" />
                    Card Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProcessPayment} className="space-y-4">
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

                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep("review")} className="flex-1">
                        Back to Review
                      </Button>
                      <Button type="submit" className="flex-1">
                        Process Payment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "cash" && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("review")} className="flex-1">
                  Back to Review
                </Button>
                <Button onClick={(e) => { e.preventDefault(); setStep("receipt"); }} className="flex-1">
                  Confirm Cash Payment
                </Button>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("review")} className="flex-1">
                  Back to Review
                </Button>
                <Button onClick={(e) => { e.preventDefault(); setStep("receipt"); }} className="flex-1">
                  Confirm Bank Transfer
                </Button>
              </div>
            )}
          </div>
        )}

        {step === "receipt" && (
          <div className="space-y-6">
            {/* Success Message */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground">Guest checkout completed successfully</p>
              </CardContent>
            </Card>

            {/* Receipt */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl">AAA Hotel</h2>
                    <p className="text-sm text-muted-foreground">Official Receipt</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Receipt No: {booking.id}</p>
                    <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Guest Information */}
                <div>
                  <h4 className="mb-2">Guest Information</h4>
                  <div className="text-sm space-y-1">
                    <p>{customerDetails.firstName} {customerDetails.lastName}</p>
                    <p>{customerDetails.email}</p>
                    <p>{customerDetails.phone}</p>
                  </div>
                </div>

                <Separator />

                {/* Stay Details */}
                <div>
                  <h4 className="mb-2">Stay Details</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Room</TableCell>
                        <TableCell className="text-right">{room.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Check-in</TableCell>
                        <TableCell className="text-right">{new Date(bookingDetails.checkIn).toLocaleDateString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Check-out</TableCell>
                        <TableCell className="text-right">{new Date(bookingDetails.checkOut).toLocaleDateString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number of Nights</TableCell>
                        <TableCell className="text-right">{calculateNights()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                {/* Charges Breakdown */}
                <div>
                  <h4 className="mb-2">Charges</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Room Charges ({calculateNights()} nights @ ₱{room.price.toLocaleString()})</TableCell>
                        <TableCell className="text-right">₱{roomOnlyCharges.toLocaleString()}</TableCell>
                      </TableRow>
                      {extras && extras.length > 0 && extras.map((extra, index) => (
                        <TableRow key={index}>
                          <TableCell>{extra.name} (x{extra.quantity} @ ₱{extra.pricePerUnit.toLocaleString()})</TableCell>
                          <TableCell className="text-right">₱{(extra.quantity * extra.pricePerUnit).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {additionalCharges.map((charge) => (
                        <TableRow key={charge.id}>
                          <TableCell>{charge.description}</TableCell>
                          <TableCell className="text-right">₱{charge.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                {/* Payment Summary */}
                <div>
                  <h4 className="mb-2">Payment Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Grand Total</span>
                      <span>₱{grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Advance Paid</span>
                      <span>₱{advancePaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Balance Paid ({paymentMethod === "card" ? "Card" : paymentMethod === "cash" ? "Cash" : "Bank Transfer"})</span>
                      <span>₱{balanceDue.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Total Paid</span>
                      <span>₱{grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Balance</span>
                      <span>₱0.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadReceipt} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button onClick={handleCompleteCheckout} className="flex-1">
                Complete Checkout
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}