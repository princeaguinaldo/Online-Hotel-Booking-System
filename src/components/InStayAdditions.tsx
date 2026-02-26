import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { BookingData } from "./BookingForm";

interface InStayAdditionsProps {
  booking: (BookingData & { id: string; status: string }) | null;
  isOpen: boolean;
  onClose: () => void;
  onAddItems: (bookingId: string, items: AddedItem[]) => void;
}

export interface AddedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  addedDate: Date;
}

interface ItemOption {
  id: string;
  name: string;
  price: number;
  icon: string;
}

const AVAILABLE_ITEMS: ItemOption[] = [
  { id: "bedsheets", name: "Bed Sheets", price: 200, icon: "🛏️" },
  { id: "blanket", name: "Extra Blanket", price: 250, icon: "🧣" },
  { id: "pillow", name: "Pillow", price: 150, icon: "🛋️" },
  { id: "towel", name: "Towel Set", price: 100, icon: "🧺" },
  { id: "utensils", name: "Utensils Set", price: 180, icon: "🍴" },
  { id: "extraguest", name: "Extra Guest", price: 800, icon: "👤" },
];

export function InStayAdditions({ booking, isOpen, onClose, onAddItems }: InStayAdditionsProps) {
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());

  if (!booking) return null;

  const handleQuantityChange = (itemId: string, change: number) => {
    setSelectedItems(prev => {
      const newMap = new Map(prev);
      const currentQty = newMap.get(itemId) || 0;
      const newQty = Math.max(0, currentQty + change);
      
      if (newQty === 0) {
        newMap.delete(itemId);
      } else {
        newMap.set(itemId, newQty);
      }
      
      return newMap;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    selectedItems.forEach((quantity, itemId) => {
      const item = AVAILABLE_ITEMS.find(i => i.id === itemId);
      if (item) {
        total += item.price * quantity;
      }
    });
    return total;
  };

  const handleConfirm = () => {
    const items: AddedItem[] = [];
    selectedItems.forEach((quantity, itemId) => {
      const item = AVAILABLE_ITEMS.find(i => i.id === itemId);
      if (item) {
        items.push({
          id: `${itemId}-${Date.now()}`,
          name: item.name,
          price: item.price,
          quantity,
          addedDate: new Date(),
        });
      }
    });

    if (items.length > 0) {
      onAddItems(booking.id, items);
      setSelectedItems(new Map());
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedItems(new Map());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add Items for Guest
          </DialogTitle>
          <DialogDescription>
            Add extra items or services for {booking.customerDetails.firstName} {booking.customerDetails.lastName} - Booking {booking.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest Info */}
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Guest</p>
                  <p className="font-medium">{booking.customerDetails.firstName} {booking.customerDetails.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-medium">{booking.room.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Items */}
          <div>
            <h3 className="text-lg mb-4">Available Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_ITEMS.map((item) => {
                const quantity = selectedItems.get(item.id) || 0;
                return (
                  <Card key={item.id} className={quantity > 0 ? "border-primary" : ""}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-2xl">{item.icon}</span>
                          {item.name}
                        </span>
                        <Badge variant="outline">₱{item.price.toLocaleString()}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Quantity</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={quantity === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {quantity > 0 && (
                        <div className="mt-2 text-right">
                          <span className="text-sm text-muted-foreground">Subtotal: </span>
                          <span className="font-medium">₱{(item.price * quantity).toLocaleString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          {selectedItems.size > 0 && (
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from(selectedItems.entries()).map(([itemId, quantity]) => {
                  const item = AVAILABLE_ITEMS.find(i => i.id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} className="flex justify-between text-sm">
                      <span>{item.name} × {quantity}</span>
                      <span>₱{(item.price * quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-2 flex justify-between">
                  <span>Total Additional Charges</span>
                  <span className="text-lg">₱{calculateTotal().toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1"
              disabled={selectedItems.size === 0}
            >
              Add Items (₱{calculateTotal().toLocaleString()})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
