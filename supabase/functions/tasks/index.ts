
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for task data
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  robotId?: string;
  startLocation?: string;
  endLocation?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock task data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Pickup from Station A',
    description: 'Retrieve package from Station A and deliver to Station B',
    status: 'in-progress',
    priority: 'high',
    robotId: 'robot1',
    startLocation: 'Station A',
    endLocation: 'Station B',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Restock inventory',
    description: 'Move items from storage to production line',
    status: 'pending',
    priority: 'medium',
    startLocation: 'Storage Area',
    endLocation: 'Production Line',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    title: 'Emergency maintenance',
    description: 'Check faulty equipment at Zone C',
    status: 'pending',
    priority: 'critical',
    startLocation: 'Charging Station',
    endLocation: 'Zone C',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  }
];

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

    // Parse the URL to get the request path
    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);
    
    // Handle different API endpoints
    if (req.method === 'GET') {
      if (path[path.length - 1] === 'list') {
        // Return list of tasks
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: mockTasks 
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      } else if (path[path.length - 2] === 'detail' && path[path.length - 1]) {
        // Return details for a specific task
        const taskId = path[path.length - 1];
        const task = mockTasks.find(t => t.id === taskId);
        
        if (!task) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'Task not found' 
            }),
            { 
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json' 
              },
              status: 404
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: task 
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }
    } else if (req.method === 'POST') {
      // Create a new task
      const body = await req.json();
      
      // Validate request data
      if (!body.title || !body.priority) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Missing required fields' 
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            },
            status: 400
          }
        );
      }
      
      // In a real application, you would save the task to your database
      // For this example, we'll just return a success response with a generated ID
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: body.title,
        description: body.description || '',
        status: 'pending',
        priority: body.priority,
        robotId: body.robotId,
        startLocation: body.startLocation,
        endLocation: body.endLocation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Task created successfully',
          data: newTask
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else if (req.method === 'PUT' && path[path.length - 2] === 'update' && path[path.length - 1]) {
      // Update an existing task
      const taskId = path[path.length - 1];
      const body = await req.json();
      
      // In a real application, you would update the task in your database
      // For this example, we'll just return a success response
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Task updated successfully',
          taskId: taskId
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else if (req.method === 'DELETE' && path[path.length - 2] === 'delete' && path[path.length - 1]) {
      // Delete a task
      const taskId = path[path.length - 1];
      
      // In a real application, you would delete the task from your database
      // For this example, we'll just return a success response
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Task deleted successfully',
          taskId: taskId
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // If no matching endpoint is found
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Endpoint not found' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 404
      }
    );
  } catch (error) {
    console.error("Error in tasks function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});
