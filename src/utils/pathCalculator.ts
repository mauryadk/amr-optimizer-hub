
export interface PathNode {
  id: string;
  name: string;
  type: 'charging' | 'pickup' | 'delivery' | 'storage' | 'junction';
  x: number;
  y: number;
}

export interface PathEdge {
  id: string;
  source: string;
  target: string;
  bidirectional: boolean;
  cost: number;
  preferred: boolean;
  speedLimit?: number;
}

// Calculate shortest path using Dijkstra's algorithm
export function findShortestPath(
  nodes: PathNode[],
  edges: PathEdge[],
  startNodeId: string,
  endNodeId: string
): { path: string[], totalCost: number } {
  // Initialize distances with Infinity for all nodes except start node
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  // Initialize data structures
  nodes.forEach(node => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentNodeId = null;
    let minDistance = Infinity;
    
    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNodeId = nodeId;
      }
    }
    
    // If we can't find a node or we reached our target, break
    if (currentNodeId === null || currentNodeId === endNodeId) break;
    
    // Remove current node from unvisited
    unvisited.delete(currentNodeId);
    
    // Find all neighbors of current node
    const neighbors = edges.filter(edge => 
      (edge.source === currentNodeId) || 
      (edge.bidirectional && edge.target === currentNodeId)
    );
    
    for (const edge of neighbors) {
      // Determine neighbor node ID
      const neighborId = edge.source === currentNodeId ? edge.target : edge.source;
      
      // Skip if already visited
      if (!unvisited.has(neighborId)) continue;
      
      // Calculate new distance
      const cost = edge.cost;
      const newDistance = distances[currentNodeId!] + cost;
      
      // Update if new distance is shorter
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currentNodeId;
      }
    }
  }
  
  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endNodeId;
  
  // If there's no path, return empty
  if (previous[endNodeId] === null && startNodeId !== endNodeId) {
    return { path: [], totalCost: Infinity };
  }
  
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  return { 
    path, 
    totalCost: distances[endNodeId] 
  };
}

// Calculate preferred path based on "preferred" edge attribute
export function findPreferredPath(
  nodes: PathNode[],
  edges: PathEdge[],
  startNodeId: string,
  endNodeId: string
): { path: string[], totalCost: number } {
  // Create a copy of edges with modified costs to favor preferred paths
  const modifiedEdges = edges.map(edge => ({
    ...edge,
    cost: edge.preferred ? edge.cost * 0.5 : edge.cost * 2
  }));
  
  // Use the same algorithm but with modified costs
  return findShortestPath(nodes, modifiedEdges, startNodeId, endNodeId);
}

// Generate a test navigation graph
export function generateTestNavigationGraph(): { nodes: PathNode[], edges: PathEdge[] } {
  const nodes: PathNode[] = [
    { id: 'n1', name: 'Charging Station 1', type: 'charging', x: 100, y: 100 },
    { id: 'n2', name: 'Pickup Point A', type: 'pickup', x: 250, y: 150 },
    { id: 'n3', name: 'Junction 1', type: 'junction', x: 400, y: 100 },
    { id: 'n4', name: 'Delivery Point B', type: 'delivery', x: 500, y: 200 },
    { id: 'n5', name: 'Storage Area', type: 'storage', x: 300, y: 300 },
    { id: 'n6', name: 'Charging Station 2', type: 'charging', x: 150, y: 350 },
    { id: 'n7', name: 'Junction 2', type: 'junction', x: 450, y: 350 }
  ];
  
  const edges: PathEdge[] = [
    { id: 'e1', source: 'n1', target: 'n2', bidirectional: true, cost: 1, preferred: true },
    { id: 'e2', source: 'n2', target: 'n3', bidirectional: true, cost: 1, preferred: true },
    { id: 'e3', source: 'n3', target: 'n4', bidirectional: true, cost: 1, preferred: true },
    { id: 'e4', source: 'n2', target: 'n5', bidirectional: true, cost: 1.5, preferred: false },
    { id: 'e5', source: 'n5', target: 'n6', bidirectional: true, cost: 1, preferred: false },
    { id: 'e6', source: 'n5', target: 'n7', bidirectional: true, cost: 1, preferred: false },
    { id: 'e7', source: 'n7', target: 'n4', bidirectional: true, cost: 1, preferred: false },
    { id: 'e8', source: 'n1', target: 'n6', bidirectional: true, cost: 2, preferred: false }
  ];
  
  return { nodes, edges };
}
