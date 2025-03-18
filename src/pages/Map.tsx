
import MapView from "@/components/map/MapView";
import { useAuth } from "@/contexts/AuthContext";

export default function Map() {
  const { profile } = useAuth();

  return (
    <div className="min-h-full flex flex-col">
      <MapView isFullscreen={true} />
    </div>
  );
}
