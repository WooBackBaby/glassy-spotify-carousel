
export interface FoodCategory {
  name: string;
  emoji: string;
  keywords: string[];
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    name: 'Breads',
    emoji: '🍞',
    keywords: [
      'pumpernickel', 'focaccia', 'sourdough', 'baguette', 'ciabatta', 'rye', 'wheat',
      'bagel', 'croissant', 'brioche', 'challah', 'naan', 'pita', 'tortilla',
      'bread', 'roll', 'loaf', 'toast'
    ]
  },
  {
    name: 'Vegetables',
    emoji: '🥬',
    keywords: [
      'green beans', 'squash', 'carrots', 'broccoli', 'spinach', 'kale', 'lettuce',
      'tomato', 'cucumber', 'pepper', 'onion', 'garlic', 'potato', 'celery',
      'beans', 'peas', 'corn', 'cabbage', 'asparagus', 'mushroom', 'zucchini'
    ]
  },
  {
    name: 'Fruits',
    emoji: '🍎',
    keywords: [
      'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'raspberry',
      'peach', 'pear', 'plum', 'cherry', 'mango', 'pineapple', 'watermelon',
      'lemon', 'lime', 'kiwi', 'avocado', 'coconut'
    ]
  },
  {
    name: 'Grains & Cereals',
    emoji: '🌾',
    keywords: [
      'rice', 'quinoa', 'oats', 'barley', 'wheat', 'corn', 'millet', 'buckwheat',
      'cereal', 'granola', 'oatmeal', 'pasta', 'noodles'
    ]
  },
  {
    name: 'Proteins',
    emoji: '🥩',
    keywords: [
      'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'turkey', 'lamb',
      'eggs', 'tofu', 'tempeh', 'beans', 'lentils', 'nuts', 'seeds'
    ]
  },
  {
    name: 'Dairy',
    emoji: '🥛',
    keywords: [
      'milk', 'cheese', 'yogurt', 'butter', 'cream', 'mozzarella', 'cheddar',
      'parmesan', 'gouda', 'brie', 'feta', 'ricotta'
    ]
  },
  {
    name: 'Herbs & Spices',
    emoji: '🌿',
    keywords: [
      'basil', 'oregano', 'thyme', 'rosemary', 'sage', 'parsley', 'cilantro',
      'mint', 'dill', 'cinnamon', 'pepper', 'salt', 'ginger', 'turmeric'
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
    const playlistName = playlist.name.toLowerCase();
    
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
      category: 'Other Foods',
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
