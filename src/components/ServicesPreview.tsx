import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Bed, Users, Utensils, Wifi, Car, Coffee, Crown, Calendar, MapPin } from "lucide-react";

interface ServicesPreviewProps {
  onViewOptions: (serviceType: string) => void;
}

export function ServicesPreview({ onViewOptions }: ServicesPreviewProps) {
  const services = [
    {
      id: "rooms",
      title: "Luxury Hotel Rooms",
      description: "Experience comfort and elegance in our well-appointed rooms with modern amenities and stunning views.",
      image: "https://images.unsplash.com/photo-1652881389205-9f85f82888c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBlbGVnYW50fGVufDF8fHx8MTc1OTI1MjIxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["King & Queen Beds", "City & Garden Views", "Premium Amenities", "24/7 Room Service"],
      priceRange: "₱2,500 - ₱8,000",
      icon: <Bed className="h-6 w-6" />
    },
    {
      id: "banquets",
      title: "Elegant Banquet Halls",
      description: "Host memorable events in our sophisticated banquet halls perfect for weddings, corporate gatherings, and celebrations.",
      image: "https://images.unsplash.com/photo-1572040428263-14d4b4221d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhiYW5xdWV0JTIwaGFsbCUyMGVsZWdhbnR8ZW58MXx8fHwxNzU5MjUyMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Multiple Hall Sizes", "Professional Sound & Lighting", "Full Catering Service", "Event Planning Support"],
      priceRange: "₱15,000 - ₱50,000",
      icon: <Users className="h-6 w-6" />
    },
    {
      id: "restaurants",
      title: "Fine Dining Restaurant",
      description: "Savor exquisite cuisine crafted by our expert chefs in an elegant dining atmosphere with exceptional service.",
      image: "https://images.unsplash.com/photo-1731941465921-eb4285693713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZmluZSUyMGRpbmluZ3xlbnwxfHx8fDE3NTkyMTI3Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Filipino & International Cuisine", "Private Dining Areas", "Wine & Beverage Selection", "Special Occasion Menus"],
      priceRange: "₱800 - ₱2,500",
      icon: <Utensils className="h-6 w-6" />
    }
  ];

  const amenities = [
    { icon: <Wifi className="h-5 w-5" />, name: "Free Wi-Fi" },
    { icon: <Car className="h-5 w-5" />, name: "Parking" },
    { icon: <Coffee className="h-5 w-5" />, name: "24/7 Service" },
    { icon: <Crown className="h-5 w-5" />, name: "Concierge" },
    { icon: <Calendar className="h-5 w-5" />, name: "Event Planning" },
    { icon: <MapPin className="h-5 w-5" />, name: "Prime Location" }
  ];

  return (
    <section id="services" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Our Premium Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the exceptional services that make AAA Hotel your perfect choice for accommodation, events, and dining experiences
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                    {service.icon}
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <Badge variant="secondary">{service.priceRange}</Badge>
                </div>
                <p className="text-muted-foreground">{service.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => onViewOptions(service.id)}
                >
                  View Options
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Amenities Section */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl mb-3">Hotel Amenities</h3>
            <p className="text-muted-foreground">
              Enjoy world-class amenities designed for your comfort and convenience
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {amenity.icon}
                </div>
                <span className="text-sm">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl mb-4">Ready to Book Your Stay?</h3>
          <p className="text-muted-foreground mb-6">
            Experience luxury and comfort at AAA Hotel. Book now for the best rates and availability.
          </p>
          <Button size="lg" className="px-8" onClick={() => onViewOptions('all')}>
            Book Now
          </Button>
        </div>
      </div>
    </section>
  );
}