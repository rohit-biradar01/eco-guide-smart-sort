import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Search, Phone, Clock, CheckCircle, Loader2, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ListSkeleton } from "@/components/SkeletonLoader";
import L from "leaflet";

// Fix leaflet default icon
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

// Placeholder: ready for Supabase or external API integration
const fetchFacilities = async (_lat: number, _lng: number): Promise<Facility[]> => {
  // TODO: Replace with real API call e.g. Supabase query or external endpoint
  return [];
};

export default function FacilityLocator() {
  const [search, setSearch] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Update markers when facilities change
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();
    facilities.forEach(f => {
      const marker = L.marker([f.lat, f.lng]);
      marker.bindPopup(`
        <div style="min-width:180px">
          <strong>${f.name}</strong><br/>
          <small>${f.hours}</small><br/>
          <small>${f.phone}</small><br/>
          <em style="color:#666">${f.materials.join(", ")}</em>
        </div>
      `);
      markersRef.current!.addLayer(marker);
    });
  }, [facilities]);

  // Nominatim geocoding search
  const handleSearch = useCallback(async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        mapRef.current?.setView([latNum, lonNum], 14, { animate: true });
        toast.success(`Panned to: ${display_name.split(",").slice(0, 2).join(",")}`);

        // Fetch facilities near this location
        setLoading(true);
        const results = await fetchFacilities(latNum, lonNum);
        setFacilities(results);
        setLoading(false);

        if (results.length === 0) {
          toast.info("No facilities found yet — connect your data source to populate results.");
        }
      } else {
        toast.error("Location not found. Try a different search term.");
      }
    } catch {
      toast.error("Search failed. Check your connection.");
    } finally {
      setSearching(false);
    }
  }, [search]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        mapRef.current?.setView([latitude, longitude], 14, { animate: true });
        L.marker([latitude, longitude])
          .addTo(mapRef.current!)
          .bindPopup("You are here")
          .openPopup();
        toast.success("Located! Map centered on your position.");
      },
      () => toast.error("Unable to get your location.")
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-full mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Facility Locator
          </h1>
          <p className="text-sm text-muted-foreground">Search real locations and find recycling centers near you.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLocateMe}>
          <Navigation className="h-4 w-4 mr-1" /> My Location
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by city, zip code, or address..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
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
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Nearby Facilities</h2>
          {loading ? (
            <ListSkeleton count={3} />
          ) : facilities.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                Search a location to discover recycling facilities.
                <p className="text-xs mt-1 text-muted-foreground/60">Connect a data source to populate real facility data.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[490px] overflow-auto pr-1">
              {facilities.map(f => (
                <Card key={f.id} className="glass-card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => mapRef.current?.setView([f.lat, f.lng], 16, { animate: true })}
                >
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm">{f.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> {f.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {f.hours}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-primary" /> Accepted Materials
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {f.materials.map(m => (
                          <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
