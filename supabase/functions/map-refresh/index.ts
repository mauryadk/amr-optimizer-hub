
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    
    // Get request data
    const body = await req.json();
    console.log("Map refresh request:", body);
    
    // Fetch AMR data from database
    const { data: amrData, error: amrError } = await supabaseClient
      .from('AMR')
      .select('*');
    
    if (amrError) throw new Error(`Error fetching AMR data: ${amrError.message}`);
    
    // For this example, we'll return mock data, but in production
    // this would integrate with your actual map and robot systems
    const mockPositions = [
      { robotId: 'robot1', x: 150 + Math.random() * 10, y: 120 + Math.random() * 10 },
      { robotId: 'robot2', x: 300 + Math.random() * 10, y: 200 + Math.random() * 10 },
      { robotId: 'robot3', x: 220 + Math.random() * 10, y: 300 + Math.random() * 10 },
      { robotId: 'robot4', x: 400 + Math.random() * 10, y: 150 + Math.random() * 10 },
    ];
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Map refreshed successfully',
        data: { 
          positions: mockPositions,
          amrData: amrData || []
        } 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in map-refresh function:", error);
    
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
