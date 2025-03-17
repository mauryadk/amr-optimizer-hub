
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
    console.log("Map save request:", body);
    
    // In a real application, you would save the map data to your database
    // or external storage system here
    
    // For this example, we'll just return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Map saved successfully',
        id: `map-${Date.now()}`,
        timestamp: new Date().toISOString(),
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in map-save function:", error);
    
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
