import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  getFavoriteCategories,
  addFavoriteCategory,
  removeFavoriteCategory,
  setFavoriteCategories,
} from '@/lib/favoriteCategories';

// GET /api/users/favorite-categories - Get favorite categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'current-user';

    const favorites = getFavoriteCategories(userId);

    return jsonResponse({
      success: true,
      data: {
        userId,
        categories: favorites,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get favorite categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/users/favorite-categories - Add or remove favorite category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'current-user', action, category, categories } = body;

    if (action === 'add') {
      if (!category) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required field: category',
          },
          400
        );
      }

      addFavoriteCategory(userId, category);
      const favorites = getFavoriteCategories(userId);

      return jsonResponse({
        success: true,
        data: {
          userId,
          categories: favorites,
        },
        message: 'Category added to favorites',
      });
    } else if (action === 'remove') {
      if (!category) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required field: category',
          },
          400
        );
      }

      removeFavoriteCategory(userId, category);
      const favorites = getFavoriteCategories(userId);

      return jsonResponse({
        success: true,
        data: {
          userId,
          categories: favorites,
        },
        message: 'Category removed from favorites',
      });
    } else if (action === 'set') {
      if (!Array.isArray(categories)) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing or invalid "categories" field (must be an array)',
          },
          400
        );
      }

      setFavoriteCategories(userId, categories);

      return jsonResponse({
        success: true,
        data: {
          userId,
          categories,
        },
        message: 'Favorite categories updated',
      });
    } else {
      return jsonResponse(
        {
          success: false,
          message: 'Invalid action. Use "add", "remove", or "set"',
        },
        400
      );
    }
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to update favorite categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

