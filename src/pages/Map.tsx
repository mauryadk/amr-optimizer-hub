
import { useState } from "react";
import MapView from "@/components/map/MapView";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, Layers, MousePointer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Map() {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [currentPolygon, setCurrentPolygon] = useState<string | null>(null);
  
  const handleToggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    toast({
      title: !isDrawingMode ? "Drawing mode activated" : "Drawing mode deactivated",
      description: !isDrawingMode ? "Click on the map to start drawing a polygon" : "Drawing mode has been turned off",
    });
  };
  
  const handleSavePolygon = () => {
    setIsDrawingMode(false);
    setCurrentPolygon(null);
    toast({
      title: "Polygon saved",
      description: "Your polygon has been saved successfully",
    });
  };
  
  const handleCancelDrawing = () => {
    setIsDrawingMode(false);
    setCurrentPolygon(null);
    toast({
      title: "Drawing cancelled",
      description: "Polygon drawing has been cancelled",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">Interactive Navigation Map</h2>
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Real-time View
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={isDrawingMode ? "secondary" : "outline"} 
            size="sm"
            onClick={handleToggleDrawingMode}
            className="flex items-center"
          >
            {isDrawingMode ? <MousePointer className="mr-2 h-4 w-4" /> : <Pencil className="mr-2 h-4 w-4" />}
            {isDrawingMode ? "Exit Drawing" : "Draw Zone"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
            className="flex items-center"
          >
            <Layers className="mr-2 h-4 w-4" />
            {showLabels ? "Hide Labels" : "Show Labels"}
          </Button>
          
          {isDrawingMode && (
            <>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSavePolygon}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Zone
              </Button>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleCancelDrawing}
                className="flex items-center"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      
      <MapView 
        isFullscreen={false} 
        editMode={isDrawingMode}
        showLabels={showLabels}
        onPolygonCreated={setCurrentPolygon}
      />
    </div>
  );
}
