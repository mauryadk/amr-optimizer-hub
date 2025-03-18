
import MapView from "@/components/map/MapView";

export default function Map() {
  return (
    <div className="min-h-screen flex flex-col">
      <MapView isFullscreen={false} />
    </div>
  );
}
