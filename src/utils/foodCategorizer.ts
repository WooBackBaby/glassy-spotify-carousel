
export interface FoodCategory {
  name: string;
  emoji: string;
  keywords: string[];
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    name: 'Breads & Baked Goods',
    emoji: '🍞',
    keywords: [
      'biscuits', 'marbled rye', 'hardtack', 'pumpernickel', 'focaccia', 
      'sourdough', 'beignets', 'glazed donut'
    ]
  },
  {
    name: 'Vegetables',
    emoji: '🥬',
    keywords: [
      'asparagus', 'green beans', 'squash', 'beets', 'radish', 
      'brussels sprouts', 'cucumber', 'mustard greens', 'yams', 
      'fried green tomatoes', 'artichoke', 'pickles'
    ]
  },
  {
    name: 'Fruits',
    emoji: '🍎',
    keywords: [
      'pomegranate', 'blueberry', 'papaya', 'key lime', 'passionfruit', 
      'lychee', 'guava', 'mango', 'plum', 'pineapple', 'strawberries', 
      'grapefruit'
    ]
  },
  {
    name: 'Sweets & Desserts',
    emoji: '🍰',
    keywords: [
      'gummy worms', 'toffee', 'caramel', 'pudding', 'devil\'s food cake', 
      'butterscotch', 'jelly beans', 'dulce de leche', 'box of chocolates'
    ]
  },
  {
    name: 'Beverages',
    emoji: '🥤',
    keywords: [
      'caipirinha', 'amarula', 'lemonade', 'dandelion wine', 'sarsaparilla', 
      'cocoa', 'champagne'
    ]
  },
  {
    name: 'Special Occasions',
    emoji: '🎉',
    keywords: [
      'mantém a fé', '🎅🏾'
    ]
  }
];

export interface CategorizedPlaylist {
  id: string;
  name: string;
  cover: string;
  spotifyUrl: string;
  embedId: string;
  description: string;
  trackCount: number;
  category: string;
  categoryEmoji: string;
}

export const categorizePlaylists = (playlists: any[]): CategorizedPlaylist[] => {
  return playlists.map(playlist => {
    const playlistName = playlist.name.toLowerCase().trim();
    
    // Find the first matching category
    for (const category of FOOD_CATEGORIES) {
      for (const keyword of category.keywords) {
        if (playlistName.includes(keyword.toLowerCase())) {
          return {
            ...playlist,
            category: category.name,
            categoryEmoji: category.emoji
          };
        }
      }
    }
    
    // Default category for unmatched items
    return {
      ...playlist,
      category: 'Other',
      categoryEmoji: '🍽️'
    };
  });
};

export const groupPlaylistsByCategory = (categorizedPlaylists: CategorizedPlaylist[]) => {
  const groups: { [key: string]: CategorizedPlaylist[] } = {};
  
  categorizedPlaylists.forEach(playlist => {
    const categoryKey = playlist.category;
    if (!groups[categoryKey]) {
      groups[categoryKey] = [];
    }
    groups[categoryKey].push(playlist);
  });
  
  // Sort playlists within each group alphabetically
  Object.keys(groups).forEach(category => {
    groups[category].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return groups;
};
