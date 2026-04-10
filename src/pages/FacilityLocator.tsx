import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Search, Phone, Clock, CheckCircle, Loader2, Navigation, Route } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Facility {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  materials: string[];
}

const puneFacilities: Facility[] = [
  { id: "1", name: "Kothrud Recycling Hub", lat: 18.5074, lng: 73.8077, phone: "+91 20 2546 1234", hours: "Mon–Sat 9 AM – 6 PM", materials: ["Paper", "Plastic", "Metal", "Glass"] },
  { id: "2", name: "Viman Nagar E-Waste Center", lat: 18.5679, lng: 73.9143, phone: "+91 20 2668 5678", hours: "Mon–Fri 10 AM – 5 PM", materials: ["Electronics", "Batteries", "Cables"] },
  { id: "3", name: "Hinjewadi Green Depot", lat: 18.5912, lng: 73.7390, phone: "+91 20 2293 9012", hours: "Mon–Sat 8 AM – 7 PM", materials: ["Organic Waste", "Garden Waste", "Paper"] },
  { id: "4", name: "Shivajinagar Scrap Collection", lat: 18.5308, lng: 73.8474, phone: "+91 20 2553 3456", hours: "Mon–Sat 9 AM – 5 PM", materials: ["Metal", "Plastic", "Rubber", "Wood"] },
  { id: "5", name: "Hadapsar Waste Processing Unit", lat: 18.5089, lng: 73.9260, phone: "+91 20 2699 7890", hours: "Mon–Fri 8 AM – 4 PM", materials: ["Hazardous", "Chemical", "Medical Waste"] },
];

export default function FacilityLocator() {
  const [search, setSearch] = useState("");
  const [facilities] = useState<Facility[]>(puneFacilities);
  const [searching, setSearching] = useState(false);
  const [travelInfo, setTravelInfo] = useState<Record<string, string>>({});
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current).setView([18.5204, 73.8567], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();
    facilities.forEach(f => {
      const marker = L.marker([f.lat, f.lng]);
      marker.bindPopup(`<div style="min-width:180px"><strong>${f.name}</strong><br/><small>${f.hours}</small><br/><small>${f.phone}</small><br/><em style="color:#666">${f.materials.join(", ")}</em></div>`);
      markersRef.current!.addLayer(marker);
    });
  }, [facilities]);

  const handleSearch = useCallback(async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=1`, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        mapRef.current?.setView([parseFloat(lat), parseFloat(lon)], 14, { animate: true });
        toast.success(`Panned to: ${display_name.split(",").slice(0, 2).join(",")}`);
      } else {
        toast.error("Location not found.");
      }
    } catch {
      toast.error("Search failed.");
    } finally {
      setSearching(false);
    }
  }, [search]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        mapRef.current?.setView([latitude, longitude], 14, { animate: true });
        L.marker([latitude, longitude]).addTo(mapRef.current!).bindPopup("You are here").openPopup();
        toast.success("Located!");
      },
      () => toast.error("Unable to get your location.")
    );
  };

  const handleGetDirections = (facility: Facility) => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported."); return; }
    toast.info("Calculating travel time...");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        // Haversine distance for estimation
        const R = 6371;
        const dLat = (facility.lat - latitude) * Math.PI / 180;
        const dLon = (facility.lng - longitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(latitude * Math.PI / 180) * Math.cos(facility.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
        const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const timeMin = Math.round(dist / 25 * 60); // ~25 km/h city speed

        setTravelInfo(prev => ({ ...prev, [facility.id]: `~${dist.toFixed(1)} km • ~${timeMin} min` }));
        mapRef.current?.setView([facility.lat, facility.lng], 15, { animate: true });
        toast.success(`Estimated travel: ${timeMin} min (${dist.toFixed(1)} km)`);
      },
      () => toast.error("Unable to get location for routing.")
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-full mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
            <MapPin className="h-6 w-6 text-eco-blue" />
            Facility Locator
          </h1>
          <p className="text-sm text-muted-foreground">Recycling centers in Pune — click a facility to get travel time.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLocateMe}>
          <Navigation className="h-4 w-4 mr-1" /> My Location
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by city, zip code, or address..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
        </div>
        <Button onClick={handleSearch} disabled={searching}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-4">
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0 h-[550px]">
            <div ref={mapContainerRef} className="h-full w-full z-0" />
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-heading">Nearby Facilities</h2>
          <div className="space-y-3 max-h-[490px] overflow-auto pr-1">
            {facilities.map(f => (
              <Card key={f.id} className="glass-card hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => mapRef.current?.setView([f.lat, f.lng], 16, { animate: true })}
              >
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-sm font-heading">{f.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" /> {f.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {f.hours}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-eco-green" /> Accepted Materials
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {f.materials.map(m => (
                        <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                      ))}
                    </div>
                  </div>
                  {travelInfo[f.id] && (
                    <p className="text-xs font-semibold text-eco-blue">{travelInfo[f.id]}</p>
                  )}
                  <Button size="sm" variant="outline" className="w-full text-xs" onClick={(e) => { e.stopPropagation(); handleGetDirections(f); }}>
                    <Route className="h-3 w-3 mr-1" /> Get Travel Time
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
