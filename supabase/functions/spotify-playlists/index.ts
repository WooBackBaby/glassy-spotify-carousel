
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Spotify credentials from Supabase secrets
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: 'Spotify credentials not configured' }),
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

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch all user's public playlists with pagination
    let allPlaylists: any[] = []
    let nextUrl = `https://api.spotify.com/v1/users/${userId}/playlists?limit=50`
    
    while (nextUrl) {
      const playlistsResponse = await fetch(nextUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      const playlistsData = await playlistsResponse.json()
      
      if (playlistsData.items) {
        allPlaylists = allPlaylists.concat(playlistsData.items)
      }
      
      // Check if there are more pages
      nextUrl = playlistsData.next
    }

    console.log(`Fetched ${allPlaylists.length} total playlists for user ${userId}`)
    
    // Log ALL playlist titles for analysis
    console.log('=== COMPLETE PLAYLIST ANALYSIS ===')
    allPlaylists.forEach((playlist: any, index: number) => {
      console.log(`${index + 1}. "${playlist.name}"`)
    })
    console.log('=== END COMPLETE ANALYSIS ===')

    // Transform the data to match our frontend format
    const transformedPlaylists = allPlaylists
      ?.filter((playlist: any) => playlist.public && playlist.images.length > 0)
      ?.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        cover: playlist.images[0]?.url || '',
        spotifyUrl: playlist.external_urls.spotify,
        embedId: playlist.id,
        description: playlist.description || 'Curated playlist',
        trackCount: playlist.tracks.total
      })) || []

    console.log(`Returning ${transformedPlaylists.length} public playlists with images`)

    return new Response(
      JSON.stringify({ playlists: transformedPlaylists }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching Spotify playlists:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch playlists' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
