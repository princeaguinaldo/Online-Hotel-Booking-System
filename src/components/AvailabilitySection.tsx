import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SearchData } from "./SearchForm";
import { Wifi, Car, Coffee, Utensils, Users, Calendar } from "lucide-react";

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

interface AvailabilitySectionProps {
  searchData: SearchData | null;
  onBookRoom: (room: Room) => void;
  serviceFilter?: string;
}

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Deluxe Suite",
    type: "room",
    price: 7999,
    image: "https://images.unsplash.com/photo-1652881389205-9f85f82888c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBlbGVnYW50fGVufDF8fHx8MTc1OTI1MjIxNnww&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["WiFi", "Parking", "Room Service", "Mini Bar"],
    capacity: 2,
    available: true,
    description: "Spacious suite with city view and premium amenities"
  },
  {
    id: "2",
    name: "Executive Room",
    type: "room",
    price: 4999,
    image: "https://images.unsplash.com/photo-1652881389205-9f85f82888c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBlbGVnYW50fGVufDF8fHx8MTc1OTI1MjIxNnww&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["WiFi", "Parking", "Room Service"],
    capacity: 2,
    available: true,
    description: "Comfortable room with modern amenities"
  },
  {
    id: "3",
    name: "Standard Room",
    type: "room",
    price: 2999,
    image: "https://images.unsplash.com/photo-1652881389205-9f85f82888c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhob3RlbCUyMHJvb20lMjBlbGVnYW50fGVufDF8fHx8MTc1OTI1MjIxNnww&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["WiFi", "Parking"],
    capacity: 2,
    available: true,
    description: "Cozy room with essential amenities"
  },
  {
    id: "4",
    name: "Grand Ballroom",
    type: "banquet",
    price: 49999,
    image: "https://images.unsplash.com/photo-1572040428263-14d4b4221d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhiYW5xdWV0JTIwaGFsbCUyMGVsZWdhbnR8ZW58MXx8fHwxNzU5MjUyMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["Sound System", "Lighting", "Catering Service", "Parking"],
    capacity: 200,
    available: true,
    description: "Elegant ballroom perfect for weddings and corporate events"
  },
  {
    id: "5",
    name: "Crystal Hall",
    type: "banquet",
    price: 29999,
    image: "https://images.unsplash.com/photo-1572040428263-14d4b4221d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhiYW5xdWV0JTIwaGFsbCUyMGVsZWdhbnR8ZW58MXx8fHwxNzU5MjUyMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["Sound System", "Lighting", "Catering Service"],
    capacity: 100,
    available: false,
    description: "Intimate venue for smaller celebrations"
  },
  {
    id: "6",
    name: "Le Jardin Restaurant",
    type: "restaurant",
    price: 2499,
    image: "https://images.unsplash.com/photo-1731941465921-eb4285693713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZmluZSUyMGRpbmluZ3xlbnwxfHx8fDE3NTkyMTI3Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["Fine Dining", "Wine Selection", "Private Tables", "Valet Parking"],
    capacity: 8,
    available: true,
    description: "Premium dining experience with seasonal menu"
  }
];

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case 'wifi': return <Wifi className="h-4 w-4" />;
    case 'parking': case 'valet parking': return <Car className="h-4 w-4" />;
    case 'room service': case 'catering service': return <Coffee className="h-4 w-4" />;
    case 'fine dining': return <Utensils className="h-4 w-4" />;
    default: return null;
  }
};

export function AvailabilitySection({ searchData, onBookRoom, serviceFilter }: AvailabilitySectionProps) {
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  useEffect(() => {
    let filtered: Room[] = [];
    
    if (serviceFilter && serviceFilter !== 'all') {
      // Filter by service type from ServicesPreview
      const typeMap: { [key: string]: string } = {
        'rooms': 'room',
        'banquets': 'banquet',
        'restaurants': 'restaurant'
      };
      const targetType = typeMap[serviceFilter] || serviceFilter;
      filtered = mockRooms.filter(room => room.type === targetType);
    } else if (searchData) {
      // Filter by search data
      filtered = mockRooms.filter(room => room.type === searchData.type);
    } else {
      filtered = [];
    }
    
    setFilteredRooms(filtered);
  }, [searchData, serviceFilter]);

  if ((!searchData && !serviceFilter) || filteredRooms.length === 0) {
    return null;
  }

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'room': return 'Available Rooms';
      case 'banquet': return 'Available Banquet Halls';
      case 'restaurant': return 'Available Restaurant Tables';
      default: return 'Available Options';
    }
  };

  const getPriceLabel = (type: string) => {
    switch (type) {
      case 'room': return 'per night';
      case 'banquet': return 'per event';
      case 'restaurant': return 'per person';
      default: return '';
    }
  };

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl">
            {serviceFilter && serviceFilter !== 'all' ? 
              getTypeTitle(serviceFilter === 'rooms' ? 'room' : serviceFilter === 'banquets' ? 'banquet' : 'restaurant') : 
              searchData ? getTypeTitle(searchData.type) : 'Available Options'
            }
          </h2>
          {searchData && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {searchData.checkIn} - {searchData.checkOut}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <Card key={room.id} className="overflow-hidden">
              <div className="relative h-48">
                <ImageWithFallback
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                {!room.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Not Available</Badge>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl">₱{room.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{getPriceLabel(room.type)}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Capacity: {room.capacity} {room.type === 'restaurant' ? 'people' : room.type === 'banquet' ? 'guests' : 'guests'}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map(amenity => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      <div className="flex items-center gap-1">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </div>
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={!room.available}
                  onClick={() => onBookRoom(room)}
                >
                  {room.available ? 'Book Now' : 'Not Available'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}