import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CalendarEvent {
  id: string;
  date: Date;
  type: "General" | "Recyclable" | "Green Waste" | "Bulky Pickup";
  label: string;
  shifted?: boolean;
  shiftReason?: string;
}

interface CalendarContextType {
  customEvents: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  removeEvent: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    setCustomEvents(prev => [...prev, { ...event, id: crypto.randomUUID() }]);
  }, []);

  const removeEvent = useCallback((id: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <CalendarContext.Provider value={{ customEvents, addEvent, removeEvent }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}
