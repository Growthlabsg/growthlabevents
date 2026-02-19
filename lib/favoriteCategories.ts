// Favorite Categories Management

// In-memory storage (in production, use database)
const favoriteCategories: Map<string, string[]> = new Map(); // userId -> category names

// Add category to favorites
export function addFavoriteCategory(userId: string, category: string): void {
  if (!favoriteCategories.has(userId)) {
    favoriteCategories.set(userId, []);
  }
  const favorites = favoriteCategories.get(userId)!;
  if (!favorites.includes(category)) {
    favorites.push(category);
  }
}

// Remove category from favorites
export function removeFavoriteCategory(userId: string, category: string): void {
  const favorites = favoriteCategories.get(userId);
  if (!favorites) return;
  
  const index = favorites.indexOf(category);
  if (index > -1) {
    favorites.splice(index, 1);
  }
}

// Get favorite categories for user
export function getFavoriteCategories(userId: string): string[] {
  return favoriteCategories.get(userId) || [];
}

// Check if category is favorite
export function isFavoriteCategory(userId: string, category: string): boolean {
  const favorites = favoriteCategories.get(userId) || [];
  return favorites.includes(category);
}

// Set favorite categories (replace all)
export function setFavoriteCategories(userId: string, categories: string[]): void {
  favoriteCategories.set(userId, [...categories]);
}

