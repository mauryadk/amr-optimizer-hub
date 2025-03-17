// This file contains implementations of API endpoints
// It will use Supabase for storage when available, or fall back to mock data

import { supabase } from '@/integrations/supabase/client';
import { robotPositions } from './mockData';

// Intercept fetch calls to our mock API endpoints
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  
  // Check if this is one of our mock API endpoints
  if (url.startsWith('/api/')) {
    return handleMockApi(url, init);
  }
  
  // Otherwise, use the original fetch
  return originalFetch.apply(this, [input, init]);
};

async function handleMockApi(url, init) {
  console.log(`Mock API call: ${url}`);
  
  try {
    // Try to use Supabase when available
    const response = await getSupabaseResponse(url, init);
    return response;
  } catch (error) {
    console.warn("Falling back to mock data:", error.message);
    
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = getMockResponse(url, init);
        resolve(response);
      }, 800);
    });
  }
}

async function getSupabaseResponse(url, init) {
  // Map endpoints to Supabase edge functions
  if (url === '/api/map/refresh') {
    const { data, error } = await supabase.functions.invoke('map-refresh', {
      body: { timestamp: new Date().toISOString() }
    });
    
    if (error) throw new Error(error.message);
    return createSuccessResponse(data);
  }
  
  if (url === '/api/map/save') {
    const body = init && init.body ? JSON.parse(init.body) : {};
    const { data, error } = await supabase.functions.invoke('map-save', {
      body: { 
        timestamp: new Date().toISOString(),
        ...body
      }
    });
    
    if (error) throw new Error(error.message);
    return createSuccessResponse(data);
  }
  
  if (url === '/api/tasks') {
    const { data, error } = await supabase.functions.invoke('tasks', {
      body: { operation: 'list' }
    });
    
    if (error) throw new Error(error.message);
    return createSuccessResponse(data);
  }
  
  if (url.includes('/api/fleet/optimize')) {
    // For path optimization and conflict resolution
    const body = init && init.body ? JSON.parse(init.body) : {};
    const { data, error } = await supabase.functions.invoke('fleet-management', {
      body: { 
        operation: 'optimizeFleet',
        ...body
      }
    });
    
    if (error) throw new Error(error.message);
    return createSuccessResponse(data);
  }
  
  // If we get here, we don't have a Supabase implementation for this endpoint
  throw new Error("No Supabase implementation for " + url);
}

function getMockResponse(url, init) {
  // Map endpoints
  if (url === '/api/map/refresh') {
    return createSuccessResponse({ success: true, message: 'Map refreshed successfully' });
  }
  
  if (url === '/api/map/save') {
    return createSuccessResponse({ success: true, id: 'map-' + Date.now(), message: 'Map saved successfully' });
  }
  
  if (url === '/api/map/background') {
    return createSuccessResponse({ 
      url: 'https://i.imgur.com/jVEwTyi.png',
      name: 'warehouse_1.pgm',
      width: 1024,
      height: 768,
      resolution: 0.05,
      origin: { x: -20.0, y: -20.0, theta: 0.0 }
    });
  }
  
  if (url.includes('/api/map/nodes/')) {
    const nodeId = url.split('/').pop();
    return createSuccessResponse({
      id: nodeId,
      name: nodeId.includes('pickup') ? 'Pickup Station A' : 'Junction Point',
      type: nodeId.includes('pickup') ? 'pickup' : 'junction',
      connections: 3,
      lastVisited: '2 hours ago',
      position: { x: 100, y: 150 },
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        createdBy: 'admin'
      }
    });
  }
  
  // Robot endpoints
  if (url === '/api/robots/positions') {
    // Add some randomness to the positions
    const updatedPositions = robotPositions.map(pos => ({
      ...pos,
      x: pos.x + (Math.random() * 10 - 5),
      y: pos.y + (Math.random() * 10 - 5)
    }));
    
    return createSuccessResponse(updatedPositions);
  }
  
  // If no matching endpoint
  return createErrorResponse(404, 'Endpoint not found');
}

function createSuccessResponse(data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

function createErrorResponse(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export default {
  // Export any utility functions that might be useful elsewhere
  createSuccessResponse,
  createErrorResponse
};
