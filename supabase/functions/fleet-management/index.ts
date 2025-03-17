
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Types for path planning and conflict resolution
interface Node {
  id: string;
  x: number;
  y: number;
  type: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  cost: number;
  bidirectional: boolean;
}

interface Robot {
  id: string;
  currentPosition: { x: number; y: number };
  status: string;
  batteryLevel: number;
  currentTask?: string;
}

interface Path {
  robotId: string;
  nodeSequence: string[];
  estimatedTime: number;
}

// Intelligent fleet management algorithm for path conflict resolution
function resolvePathConflicts(paths: Path[], nodes: Node[], robots: Robot[]): Path[] {
  console.log("Resolving path conflicts for", paths.length, "paths");
  
  // Step 1: Identify potential conflicts (robots crossing the same node at similar times)
  const conflicts = [];
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      const path1 = paths[i];
      const path2 = paths[j];
      
      // Find common nodes
      const commonNodes = path1.nodeSequence.filter(node => 
        path2.nodeSequence.includes(node)
      );
      
      if (commonNodes.length > 0) {
        conflicts.push({
          path1Index: i,
          path2Index: j,
          commonNodes
        });
      }
    }
  }
  
  // Step 2: Resolve conflicts
  const resolvedPaths = [...paths];
  
  conflicts.forEach(conflict => {
    // Simple strategy: Adjust the path of the robot with lower priority
    // In a real system, this would consider:
    // - Task priorities
    // - Battery levels
    // - Optimal timing
    // - Alternative routes
    
    // For this example, we'll add a wait node to one path
    const path1 = resolvedPaths[conflict.path1Index];
    const path2 = resolvedPaths[conflict.path2Index];
    
    // Determine which path to modify (in this simplified example, we'll always modify path2)
    const pathToModify = path2;
    
    // Find the first conflicting node
    const firstConflictNode = conflict.commonNodes[0];
    const nodeIndex = pathToModify.nodeSequence.indexOf(firstConflictNode);
    
    if (nodeIndex > 0) {
      // Insert a "wait" instruction by duplicating the previous node
      // This effectively makes the robot wait at that position
      const waitNodeId = pathToModify.nodeSequence[nodeIndex - 1];
      pathToModify.nodeSequence.splice(nodeIndex, 0, waitNodeId);
      
      // Increase estimated time to account for waiting
      pathToModify.estimatedTime += 5;
    }
  });
  
  return resolvedPaths;
}

// Function to optimize path by adjusting speed at different segments
function optimizePath(path: Path, nodes: Node[], edges: Edge[]): Path {
  console.log("Optimizing path for robot", path.robotId);
  
  // In a real implementation, this would:
  // 1. Analyze road conditions for each segment
  // 2. Consider robot's load and capabilities
  // 3. Adjust speed for efficiency and safety
  // 4. Recalculate timing and energy consumption
  
  // For this example, we'll just make a simplified adjustment
  // by slightly increasing the estimated time for realism
  const optimizedPath = { ...path };
  
  // Add small random variation to make it realistic
  optimizedPath.estimatedTime = Math.round(optimizedPath.estimatedTime * (1 + Math.random() * 0.1));
  
  return optimizedPath;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { headers: { Authorization: req.headers.get('Authorization')! } } 
      }
    );
    
    // Get request body
    const body = await req.json();
    
    // Handle different operations
    switch (body.operation) {
      case 'findPath': {
        const { robotId, startNodeId, endNodeId, nodes, edges } = body;
        
        // Use A* algorithm to find the shortest path
        // For demonstration, we're returning a mock path
        const mockPath: Path = {
          robotId,
          nodeSequence: [startNodeId, 'node123', 'node456', endNodeId],
          estimatedTime: 120 // seconds
        };
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            path: mockPath
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'optimizeFleet': {
        const { paths, nodes, edges, robots } = body;
        
        // Step 1: Resolve any path conflicts
        const resolvedPaths = resolvePathConflicts(paths, nodes, robots);
        
        // Step 2: Optimize each path individually
        const optimizedPaths = resolvedPaths.map(path => 
          optimizePath(path, nodes, edges)
        );
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            optimizedPaths
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Unknown operation' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
    }
  } catch (error) {
    console.error("Error in fleet-management function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
