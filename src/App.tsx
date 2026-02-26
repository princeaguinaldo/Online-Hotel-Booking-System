import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ServicesPreview } from "./components/ServicesPreview";
import { AvailabilitySection } from "./components/AvailabilitySection";
import { BookingForm, BookingData } from "./components/BookingForm";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { ManagementSection } from "./components/ManagementSection";
import { GuestCheckoutLookup } from "./components/GuestCheckoutLookup";
import { CheckoutSection, AdditionalCharge } from "./components/CheckoutSection";
import { StaffLogin } from "./components/StaffLogin";
import { AddedItem } from "./components/InStayAdditions";
import { CustomerRegistration, RegisteredCustomer } from "./components/CustomerRegistration";
import { CustomerLogin } from "./components/CustomerLogin";
import { CustomerDashboard } from "./components/CustomerDashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { SearchData } from "./components/SearchForm";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

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

export default function App() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [bookingId, setBookingId] = useState("");
  const [allBookings, setAllBookings] = useState<(BookingData & { id: string; status: string })[]>([]);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [isGuestCheckoutLookupOpen, setIsGuestCheckoutLookupOpen] = useState(false);
  const [isGuestCheckoutOpen, setIsGuestCheckoutOpen] = useState(false);
  const [selectedBookingForGuestCheckout, setSelectedBookingForGuestCheckout] = useState<(BookingData & { id: string; status: string }) | null>(null);
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const [registeredCustomers, setRegisteredCustomers] = useState<RegisteredCustomer[]>([]);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);
  const [loggedInCustomer, setLoggedInCustomer] = useState<RegisteredCustomer | null>(null);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  
  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    setServiceFilter(""); // Clear service filter when searching
    toast.success("Searching for available options...");
    
    // Scroll to availability section
    const availabilitySection = document.querySelector('[data-section="availability"]');
    if (availabilitySection) {
      availabilitySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingFormOpen(true);
  };

  const handleConfirmBooking = (bookingData: BookingData) => {
    // Generate booking ID
    const newBookingId = `BK${Date.now().toString().slice(-6)}`;
    setBookingId(newBookingId);
    setConfirmedBooking(bookingData);
    setAllBookings(prev => [...prev, { ...bookingData, id: newBookingId, status: 'booked' }]);
    
    // Close booking form and show confirmation
    setIsBookingFormOpen(false);
    setIsConfirmationOpen(true);
    
    toast.success("Booking confirmed successfully!");
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt downloaded successfully!");
    // In a real app, this would generate and download a PDF receipt
  };

  const handleViewOptions = (serviceType: string) => {
    setServiceFilter(serviceType);
    toast.success(`Showing ${serviceType === 'all' ? 'all' : serviceType} options...`);
    
    // Scroll to availability section
    const availabilitySection = document.querySelector('[data-section="availability"]');
    if (availabilitySection) {
      availabilitySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleManagementClick = () => {
    setIsStaffLoginOpen(true);
  };

  const handleStaffLoginSuccess = () => {
    setIsManagementOpen(true);
    toast.success("Successfully logged in to Staff Portal");
  };

  const handleCheckIn = (bookingId: string) => {
    setAllBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'checked-in' } : booking
    ));
    toast.success(`Checked in booking ${bookingId}`);
  };

  const handleCheckOut = (bookingId: string) => {
    setAllBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'completed' } : booking
    ));
    toast.success(`Checked out booking ${bookingId} - Receipt generated automatically`);
  };

  const handleGenerateReceipt = (bookingId: string) => {
    toast.success(`Receipt generated for booking ${bookingId}`);
    // In a real app, this would generate and download a receipt
  };

  const handleGuestCheckoutLookup = () => {
    setIsGuestCheckoutLookupOpen(true);
  };

  const handleSelectBookingForGuestCheckout = (booking: (BookingData & { id: string; status: string })) => {
    setSelectedBookingForGuestCheckout(booking);
    setIsGuestCheckoutLookupOpen(false);
    setIsGuestCheckoutOpen(true);
  };

  const handleGuestCheckout = (bookingId: string) => {
    setAllBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'completed' } : booking
    ));
    toast.success(`Checked out booking ${bookingId} - Receipt generated automatically`);
  };

  const handleAddInStayItems = (bookingId: string, items: AddedItem[]) => {
    setAllBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        const existingInStayItems = booking.inStayItems || [];
        return {
          ...booking,
          inStayItems: [...existingInStayItems, ...items]
        };
      }
      return booking;
    }));
    
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    toast.success(`Added items worth ₱${totalAmount.toLocaleString()} to booking ${bookingId}`);
  };

  const handleRegisterCustomer = (customer: RegisteredCustomer) => {
    setRegisteredCustomers(prev => [...prev, customer]);
    toast.success("Customer registered successfully!");
  };

  const handleRegisterClick = () => {
    setIsRegistrationOpen(true);
  };

  const handleCustomerLoginClick = () => {
    setIsCustomerLoginOpen(true);
  };

  const handleCustomerLoginSuccess = (customer: RegisteredCustomer) => {
    setLoggedInCustomer(customer);
    setIsCustomerLoginOpen(false);
    setIsCustomerDashboardOpen(true);
    toast.success("Successfully logged in to Customer Dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onManagementClick={handleManagementClick}
        onCheckoutClick={handleGuestCheckoutLookup}
        onRegisterClick={handleRegisterClick}
        onLoginClick={handleCustomerLoginClick}
      />
      
      <main>
        <HeroSection onSearch={handleSearch} />
        
        <ServicesPreview onViewOptions={handleViewOptions} />
        
        <div data-section="availability">
          <AvailabilitySection 
            searchData={searchData} 
            onBookRoom={handleBookRoom}
            serviceFilter={serviceFilter}
          />
        </div>
      </main>

      <BookingForm
        room={selectedRoom}
        searchData={searchData}
        isOpen={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        onConfirmBooking={handleConfirmBooking}
      />

      <BookingConfirmation
        bookingData={confirmedBooking}
        bookingId={bookingId}
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onDownloadReceipt={handleDownloadReceipt}
      />

      <Dialog open={isManagementOpen} onOpenChange={setIsManagementOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hotel Management - Check-in/Check-out</DialogTitle>
            <DialogDescription>
              Manage hotel bookings, check-in and check-out guests, and generate receipts.
            </DialogDescription>
          </DialogHeader>
          <ManagementSection 
            bookings={allBookings}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onGenerateReceipt={handleGenerateReceipt}
            onAddInStayItems={handleAddInStayItems}
          />
        </DialogContent>
      </Dialog>

      <GuestCheckoutLookup 
        isOpen={isGuestCheckoutLookupOpen}
        onClose={() => setIsGuestCheckoutLookupOpen(false)}
        bookings={allBookings}
        onSelectBooking={handleSelectBookingForGuestCheckout}
      />

      <CheckoutSection 
        booking={selectedBookingForGuestCheckout}
        isOpen={isGuestCheckoutOpen}
        onClose={() => setIsGuestCheckoutOpen(false)}
        onCheckoutComplete={(bookingId, additionalCharges, finalTotal) => {
          handleGuestCheckout(bookingId);
          setIsGuestCheckoutOpen(false);
          setSelectedBookingForGuestCheckout(null);
        }}
      />

      <StaffLogin 
        isOpen={isStaffLoginOpen}
        onClose={() => setIsStaffLoginOpen(false)}
        onSuccess={handleStaffLoginSuccess}
      />

      <CustomerRegistration 
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onRegister={handleRegisterCustomer}
      />

      <CustomerLogin 
        isOpen={isCustomerLoginOpen}
        onClose={() => setIsCustomerLoginOpen(false)}
        registeredCustomers={registeredCustomers}
        onLoginSuccess={handleCustomerLoginSuccess}
      />

      <CustomerDashboard 
        isOpen={isCustomerDashboardOpen}
        onClose={() => setIsCustomerDashboardOpen(false)}
        customer={loggedInCustomer}
        bookings={allBookings}
      />

      <Toaster />
    </div>
  );
}