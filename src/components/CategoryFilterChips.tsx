
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface Category {
  name: string;
  count: number;
  emoji: string;
}

interface CategoryFilterChipsProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  darkMode: boolean;
}

const CategoryFilterChips: React.FC<CategoryFilterChipsProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  darkMode
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-8 mb-12">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full flex items-center justify-center gap-2 mb-4 transition-all duration-300 ${
              darkMode
                ? 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filter by Category</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Badge
                key={category.name}
                variant={selectedCategory === category.name || (selectedCategory === null && category.name === 'All') ? 'default' : 'outline'}
                className={`cursor-pointer transition-all duration-300 px-4 py-2 text-sm font-medium rounded-full backdrop-blur-sm ${
                  selectedCategory === category.name || (selectedCategory === null && category.name === 'All')
                    ? darkMode 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-[0_0_3px_rgba(34,197,94,0.1)]' 
                      : 'bg-green-500/20 text-green-700 border-green-500/30 shadow-[0_0_3px_rgba(34,197,94,0.1)]'
                    : darkMode
                      ? 'bg-neutral-800/60 text-neutral-300 border-neutral-700/40 hover:bg-neutral-700/60 hover:border-neutral-600/40'
                      : 'bg-white/60 text-slate-700 border-slate-300/40 hover:bg-white/80 hover:border-slate-400/40'
                }`}
                onClick={() => onCategorySelect(category.name === 'All' ? null : category.name)}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  selectedCategory === category.name || (selectedCategory === null && category.name === 'All')
                    ? darkMode ? 'bg-green-400/20 text-green-200' : 'bg-green-600/20 text-green-800'
                    : darkMode ? 'bg-neutral-700/60 text-neutral-400' : 'bg-slate-200/60 text-slate-600'
                }`}>
                  {category.count}
                </span>
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CategoryFilterChips;
