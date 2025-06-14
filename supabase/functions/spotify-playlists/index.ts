
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation function
function validateUserId(userId: string): boolean {
  // Check if userId is a non-empty string with reasonable length
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  
  // Allow alphanumeric characters, underscores, hyphens, and dots
  const validUserIdPattern = /^[a-zA-Z0-9._-]{1,50}$/;
  return validUserIdPattern.test(userId);
}

// Error logging function
function logError(error: any, context: string) {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    const { userId } = body;
    
    // Validate userId
    if (!validateUserId(userId)) {
      logError(new Error(`Invalid userId format: ${userId}`), 'VALIDATION');
      return new Response(
        JSON.stringify({ error: 'Invalid user ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Spotify credentials from Supabase secrets
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      logError(new Error('Missing Spotify credentials'), 'CONFIG');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get access token using client credentials flow
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    })

    if (!tokenResponse.ok) {
      logError(new Error(`Spotify token request failed: ${tokenResponse.status}`), 'SPOTIFY_AUTH');
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch all user's public playlists with pagination
    let allPlaylists: any[] = []
    let nextUrl = `https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists?limit=50`
    let requestCount = 0;
    const maxRequests = 10; // Prevent infinite loops
    
    while (nextUrl && requestCount < maxRequests) {
      requestCount++;
      
      const playlistsResponse = await fetch(nextUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!playlistsResponse.ok) {
        if (playlistsResponse.status === 404) {
          logError(new Error(`User not found: ${userId}`), 'SPOTIFY_API');
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        logError(new Error(`Spotify API error: ${playlistsResponse.status}`), 'SPOTIFY_API');
        return new Response(
          JSON.stringify({ error: 'Failed to fetch playlists' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const playlistsData = await playlistsResponse.json()
      
      if (playlistsData.items) {
        allPlaylists = allPlaylists.concat(playlistsData.items)
      }
      
      // Check if there are more pages
      nextUrl = playlistsData.next
    }

    console.log(`Successfully fetched ${allPlaylists.length} playlists for user ${userId}`)

    // Transform the data to match our frontend format
    const transformedPlaylists = allPlaylists
      ?.filter((playlist: any) => {
        // Additional safety checks
        return playlist && 
               playlist.public && 
               playlist.images && 
               Array.isArray(playlist.images) && 
               playlist.images.length > 0
      })
      ?.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name || 'Untitled Playlist',
        cover: playlist.images[0]?.url || '',
        spotifyUrl: playlist.external_urls?.spotify || '',
        embedId: playlist.id,
        description: playlist.description || 'Curated playlist',
        trackCount: playlist.tracks?.total || 0
      })) || []

    console.log(`Returning ${transformedPlaylists.length} valid playlists`)

    return new Response(
      JSON.stringify({ playlists: transformedPlaylists }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    logError(error, 'GENERAL');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
