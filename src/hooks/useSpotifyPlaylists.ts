
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Playlist {
  id: string;
  name: string;
  cover: string;
  spotifyUrl: string;
  embedId: string;
  description: string;
  trackCount: number;
}

interface SpotifyPlaylistsResponse {
  playlists: Playlist[];
}

const fetchSpotifyPlaylists = async (userId: string): Promise<Playlist[]> => {
  // Client-side validation
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error('Invalid user ID provided');
  }

  try {
    const { data, error } = await supabase.functions.invoke('spotify-playlists', {
      body: { userId: userId.trim() }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('Failed to fetch playlists');
    }

    if (!data || !Array.isArray(data.playlists)) {
      throw new Error('Invalid response format');
    }

    return data.playlists;
  } catch (error) {
    console.error('Error in fetchSpotifyPlaylists:', error);
    throw error;
  }
};

export const useSpotifyPlaylists = (userId: string) => {
  return useQuery({
    queryKey: ['spotify-playlists', userId],
    queryFn: () => fetchSpotifyPlaylists(userId),
    enabled: !!userId && typeof userId === 'string' && userId.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (400-499)
      if (error.message.includes('Invalid user ID') || error.message.includes('User not found')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};
