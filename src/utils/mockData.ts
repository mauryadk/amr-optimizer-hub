// Robot statuses
export type RobotStatus = 'active' | 'idle' | 'charging' | 'maintenance' | 'error';

// Robot type
export interface Robot {
  id: string;
  name: string;
  model: string;
  status: RobotStatus;
  batteryLevel: number;
  location: string;
  lastActive: string;
  currentTask?: string;
  image: string;
  ipAddress: string;
}

// Task statuses
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';

// Task type
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  location: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

// Location type
export interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'station' | 'charging' | 'pickup' | 'delivery' | 'storage';
}

// Mock robots data
export const robots: Robot[] = [
  {
    id: '001',
    name: 'Scout-01',
    model: 'AMR-100',
    status: 'active',
    batteryLevel: 78,
    location: 'Warehouse Zone A',
    lastActive: new Date().toISOString(),
    currentTask: 'Package delivery to Station 3',
    image: 'https://images.unsplash.com/photo-1581092921461-7765b507d9e4?auto=format&fit=crop&q=80&w=300&h=300',
    ipAddress: '192.168.1.101'
  },
  {
    id: '002',
    name: 'Voyager-02',
    model: 'AMR-200',
    status: 'idle',
    batteryLevel: 92,
    location: 'Charging Station 2',
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=300&h=300',
    ipAddress: '192.168.1.102'
  },
  {
    id: '003',
    name: 'Carrier-03',
    model: 'AMR-300',
    status: 'charging',
    batteryLevel: 34,
    location: 'Charging Station 1',
    lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=300&h=300',
    ipAddress: '192.168.1.103'
  },
  {
    id: '004',
    name: 'Hauler-04',
    model: 'AMR-400',
    status: 'maintenance',
    batteryLevel: 100,
    location: 'Maintenance Bay',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    image: 'https://images.unsplash.com/photo-1592609931102-ada546e9269f?auto=format&fit=crop&q=80&w=300&h=300',
    ipAddress: '192.168.1.104'
  },
  {
    id: '005',
    name: 'Swift-05',
    model: 'AMR-100',
    status: 'error',
    batteryLevel: 45,
    location: 'Warehouse Zone C',
    lastActive: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=300&h=300',
    ipAddress: '192.168.1.105'
  },
  {
    id: '006',
    name: 'Pathfinder-06',
    model: 'AMR-200',
    status: 'active',
    batteryLevel: 67,
    location: 'Warehouse Zone B',
    lastActive: new Date().toISOString(),
    currentTask: 'Inventory scanning in Zone B',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=300&h=300',
    ipAddress: '192.168.1.106'
  }
];

// Mock tasks data
export const tasks: Task[] = [
  {
    id: 't001',
    title: 'Delivery to Station 3',
    description: 'Transport package #XY-789 from pickup zone to delivery station 3',
    status: 'in-progress',
    priority: 'high',
    assignedTo: '001',
    location: 'Warehouse Zone A to Station 3',
    startTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 't002',
    title: 'Inventory Scan',
    description: 'Perform full inventory scan of Zone B shelves',
    status: 'pending',
    priority: 'medium',
    assignedTo: '006',
    location: 'Warehouse Zone B',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: 't003',
    title: 'Return to Charging',
    description: 'Battery low, return to nearest charging station',
    status: 'completed',
    priority: 'high',
    assignedTo: '003',
    location: 'Warehouse Zone C to Charging Station 1',
    startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: 't004',
    title: 'Maintenance Check',
    description: 'Scheduled maintenance inspection',
    status: 'in-progress',
    priority: 'low',
    assignedTo: '004',
    location: 'Maintenance Bay',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 't005',
    title: 'Emergency Pickup',
    description: 'Urgent retrieval of package #AB-123 from Zone D',
    status: 'pending',
    priority: 'critical',
    location: 'Warehouse Zone D',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  }
];

// Mock locations for map
export const locations: Location[] = [
  { id: 'loc1', name: 'Charging Station 1', x: 100, y: 150, type: 'charging' },
  { id: 'loc2', name: 'Charging Station 2', x: 450, y: 400, type: 'charging' },
  { id: 'loc3', name: 'Pickup Zone A', x: 200, y: 250, type: 'pickup' },
  { id: 'loc4', name: 'Pickup Zone B', x: 350, y: 200, type: 'pickup' },
  { id: 'loc5', name: 'Delivery Station 1', x: 300, y: 100, type: 'delivery' },
  { id: 'loc6', name: 'Delivery Station 2', x: 500, y: 150, type: 'delivery' },
  { id: 'loc7', name: 'Delivery Station 3', x: 400, y: 300, type: 'delivery' },
  { id: 'loc8', name: 'Storage Area A', x: 150, y: 350, type: 'storage' },
  { id: 'loc9', name: 'Storage Area B', x: 550, y: 300, type: 'storage' },
  { id: 'loc10', name: 'Maintenance Bay', x: 250, y: 450, type: 'station' }
];

// Mock robot positions on map
export const robotPositions = [
  { robotId: 'robot1', x: 150, y: 150 },
  { robotId: 'robot2', x: 300, y: 200 },
  { robotId: 'robot3', x: 250, y: 300 },
  { robotId: 'robot4', x: 400, y: 150 }
];

// Summary statistics
export const fleetSummary = {
  totalRobots: robots.length,
  activeRobots: robots.filter(r => r.status === 'active').length,
  chargingRobots: robots.filter(r => r.status === 'charging').length,
  idleRobots: robots.filter(r => r.status === 'idle').length,
  maintenanceRobots: robots.filter(r => r.status === 'maintenance').length,
  errorRobots: robots.filter(r => r.status === 'error').length,
  batteryAverage: Math.round(robots.reduce((sum, robot) => sum + robot.batteryLevel, 0) / robots.length),
  pendingTasks: tasks.filter(t => t.status === 'pending').length,
  completedTasks: tasks.filter(t => t.status === 'completed').length,
  inProgressTasks: tasks.filter(t => t.status === 'in-progress').length
};

// Get status color mapping function
export const getStatusColor = (status: RobotStatus): string => {
  const colors = {
    active: 'bg-green-500',
    idle: 'bg-blue-400',
    charging: 'bg-yellow-400',
    maintenance: 'bg-purple-500',
    error: 'bg-red-500'
  };
  return colors[status] || 'bg-gray-400';
};

// Get task priority color mapping
export const getTaskPriorityColor = (priority: string): string => {
  const colors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };
  return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

// Get task status color mapping
export const getTaskStatusColor = (status: TaskStatus): string => {
  const colors = {
    pending: 'bg-blue-500',
    'in-progress': 'bg-yellow-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-500'
  };
  return colors[status] || 'bg-gray-400';
};

// Format date function
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Calculate time elapsed
export const timeElapsed = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};
