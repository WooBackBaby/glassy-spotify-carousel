
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

    // Fetch user's public playlists
    const playlistsResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists?limit=50`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const playlistsData = await playlistsResponse.json()

    // Transform the data to match our frontend format
    const transformedPlaylists = playlistsData.items
      ?.filter((playlist: any) => playlist.public && playlist.images.length > 0)
      ?.map((playlist: any, index: number) => ({
        id: playlist.id,
        name: playlist.name,
        cover: playlist.images[0]?.url || '',
        spotifyUrl: playlist.external_urls.spotify,
        embedId: playlist.id,
        description: playlist.description || 'Curated playlist',
        trackCount: playlist.tracks.total
      })) || []

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
