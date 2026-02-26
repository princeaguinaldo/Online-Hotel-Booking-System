import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SearchForm, SearchData } from "./SearchForm";

interface HeroSectionProps {
  onSearch?: (data: SearchData) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="relative h-[70vh] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc1OTIwMDM2MHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury hotel lobby"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl mb-6">
          Welcome to AAA Hotel
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90">
          Experience luxury and comfort with our premium rooms, elegant banquet halls, and fine dining restaurants
        </p>
        
        <SearchForm onSearch={onSearch} />
      </div>
    </section>
  );
}