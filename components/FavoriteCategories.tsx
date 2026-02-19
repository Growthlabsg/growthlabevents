'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface FavoriteCategoriesProps {
  userId?: string;
}

export function FavoriteCategories({ userId = 'current-user' }: FavoriteCategoriesProps) {
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchFavoriteCategories();
    // Extract available categories from events (in production, get from API)
    const categories = new Set<string>();
    categories.add('AI & Tech');
    categories.add('Hackathon');
    categories.add('Networking');
    categories.add('Workshop');
    categories.add('Showcase');
    categories.add('Startup');
    categories.add('Fitness');
    categories.add('Sports');
    setAvailableCategories(Array.from(categories));
  }, [userId]);

  const fetchFavoriteCategories = async () => {
    try {
      const response = await fetch(`/api/users/favorite-categories?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setFavoriteCategories(data.data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch favorite categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (category: string) => {
    const isFavorite = favoriteCategories.includes(category);
    const action = isFavorite ? 'remove' : 'add';

    try {
      const response = await fetch('/api/users/favorite-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action,
          category,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFavoriteCategories(data.data.categories || []);
      } else {
        alert(data.message || 'Failed to update favorite categories');
      }
    } catch (error) {
      console.error('Failed to update favorite category:', error);
      alert('Failed to update favorite category');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Favorite Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Mark your favorite categories to get personalized event recommendations.
        </p>

        <div className="flex flex-wrap gap-2">
          {availableCategories.map((category) => {
            const isFavorite = favoriteCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => handleToggleFavorite(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isFavorite
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {isFavorite && (
                  <svg className="w-4 h-4 inline mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                )}
                {category}
              </button>
            );
          })}
        </div>

        {favoriteCategories.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center">
            No favorite categories selected. Click on categories above to mark them as favorites.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

