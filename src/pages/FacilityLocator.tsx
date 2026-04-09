import { useState } from "react";
import { MapPin, Search, Phone, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const facilities = [
  { id: 1, name: "GreenCycle Hub", lat: 28.6139, lng: 77.209, phone: "+91 98765 43210", hours: "8am-6pm", materials: ["Glass", "Cardboard", "Paper", "Plastic"] },
  { id: 2, name: "TechReclaim Center", lat: 28.6229, lng: 77.219, phone: "+91 98765 43211", hours: "9am-5pm", materials: ["Electronics", "Batteries", "Cables"] },
  { id: 3, name: "EcoMetal Recyclers", lat: 28.6049, lng: 77.199, phone: "+91 98765 43212", hours: "7am-7pm", materials: ["Metal", "Aluminium", "Steel", "Copper"] },
  { id: 4, name: "CompostKing Organics", lat: 28.6189, lng: 77.225, phone: "+91 98765 43213", hours: "6am-4pm", materials: ["Food Waste", "Garden Waste", "Wood"] },
  { id: 5, name: "SafeDispose HazMat", lat: 28.608, lng: 77.215, phone: "+91 98765 43214", hours: "10am-4pm", materials: ["Paint", "Chemicals", "Medical Waste"] },
];

export default function FacilityLocator() {
  const [search, setSearch] = useState("");
  const filtered = facilities.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.materials.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <MapPin className="h-7 w-7 text-primary" />
          Recycling Facility Locator
        </h1>
        <p className="text-muted-foreground">Find nearby recycling centers and check accepted materials.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0 h-[500px]">
            <MapContainer center={[28.6139, 77.209]} zoom={14} className="h-full w-full z-0">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.map(f => (
                <Marker key={f.id} position={[f.lat, f.lng]}>
                  <Popup>
                    <strong>{f.name}</strong><br />
                    {f.materials.join(", ")}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search facilities or materials..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-3 max-h-[440px] overflow-auto pr-1">
            {filtered.map(f => (
              <Card key={f.id} className="glass-card hover:shadow-md transition-shadow cursor-pointer">
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
        </div>
      </div>
    </div>
  );
}
