
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
  const { data, error } = await supabase.functions.invoke('spotify-playlists', {
    body: { userId }
  });

  if (error) {
    console.error('Error fetching playlists:', error);
    throw new Error('Failed to fetch playlists');
  }

  return data.playlists || [];
};

export const useSpotifyPlaylists = (userId: string) => {
  return useQuery({
    queryKey: ['spotify-playlists', userId],
    queryFn: () => fetchSpotifyPlaylists(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};
